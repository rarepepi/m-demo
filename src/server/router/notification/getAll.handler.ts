import type { Notification, PrismaClient } from "@prisma/client";
import type { GetAllInput } from "@schema/notification.schema";
import { formatDate } from "@server/utils/formatDate";
import type { Session } from "next-auth";

type GetAllOptions = {
  input: GetAllInput;
  ctx: {
    prisma: PrismaClient;
    session: Session;
  };
};

type NotificationTypes =
  | "reply"
  | "comment"
  | "like"
  | "favorite"
  | "follow"
  | "following-post"
  | "first-post"
  | "welcome"
  | "no-username"
  | "no-avatar";

// Get the main notification text.
const notificationText: Record<NotificationTypes, string> = {
  comment: "commented on your post {{postName}}",
  favorite: "favorited your post {{postName}}",
  follow: "just followed you",
  like: "liked your post {{postName}}",
  reply: "replied to your comment in {{postName}}",
  "following-post": "from your following just posted: {{postName}}",
  "first-post":
    "Start by writing your first post! Share a link, create a poll, and more!",
  welcome: "Welcome to Maneki Blog! We are very pleased to have you here!",
  "no-username":
    "You have no username! Set one for yourself on your account page",
  "no-avatar": "You have no avatar! You can add one on your account page",
};

const systemNotificationTypes = [
  "first-post",
  "welcome",
  "no-avatar",
  "no-username",
];

// Get the notification redirect link.
function getHref(notification: Notification) {
  const { postId, commentId, notifierId } = notification || {};

  const currentType = notification.type.toLowerCase() as NotificationTypes;

  const postTypes = ["following-post"];
  const commentTypes = ["reply", "comment"];
  const userTypes = ["favorite", "like", "follow", "no-username", "no-avatar"];

  if (postTypes.includes(currentType)) return `/posts/${postId}`;

  if (currentType === "first-post") return `/posts/new`;

  if (commentTypes.includes(currentType))
    return `/posts/${postId}?highlightedComment=${commentId}`;

  if (userTypes.includes(currentType)) return `/users/${notifierId}`;
}

export const getAllHandler = async ({ input, ctx }: GetAllOptions) => {
  const { limit, skip, cursor, read } = input;

  const notifications = await ctx.prisma.notification.findMany({
    take: limit + 1,
    skip: skip,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: {
      createdAt: "desc",
    },
    where: {
      notifiedId: ctx.session?.user?.id,
      read,
    },
    include: {
      comment: true,
      post: true,
      notifier: true,
    },
  });

  let nextCursor: typeof cursor | undefined = undefined;
  if (notifications.length > limit) {
    const nextItem = notifications.pop(); // return the last item from the array
    nextCursor = nextItem?.id;
  }

  const filteredNotifications = notifications?.map((notification) => {
    const currentType = notification.type.toLowerCase() as NotificationTypes;

    const href = getHref(notification);
    const formattedDate = formatDate(notification.createdAt, {
      smart: true,
    });

    const isSystem = systemNotificationTypes.includes(currentType);

    return {
      ...notification,
      type: currentType,
      createdAt: formattedDate,
      message: notificationText[currentType].replace(
        "{{postName}}",
        notification?.post?.title || ""
      ),
      href,
      isSystem,
    };
  });

  return {
    list: filteredNotifications,
    nextCursor,
  };
};
