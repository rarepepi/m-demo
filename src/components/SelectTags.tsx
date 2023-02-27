import React, { useCallback, useEffect, useRef, useState } from "react";
import type { InputRef } from "antd";
import { Input, Tag } from "antd";
import { MdOutlineAdd } from "react-icons/md";
import { FieldType } from "@utils/types";
import { Controller } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { toast } from "react-toastify";

const { CheckableTag } = Tag;

type Props = {
  control: any;
  initialTags?: string[];
  initialSelectedTags?: string[];
  name: string;
  error?: any;
};

const SelectTags: React.FC<Props> = ({
  control,
  initialTags,
  initialSelectedTags,
  name,
  error,
}) => {
  const [parentRef] = useAutoAnimate();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleChange = useCallback(
    (field: FieldType, tag: string) => (checked: boolean) => {
      const nextSelectedTags = checked
        ? [...selectedTags, tag]
        : selectedTags.filter((t) => t !== tag);

      setSelectedTags(nextSelectedTags);
      field.onChange(nextSelectedTags);
    },
    [selectedTags]
  );

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = useCallback(
    (field: FieldType) => () => {
      const trimmedInputValue = inputValue?.trim();
      const inputValueOnTagArray = tags.indexOf(trimmedInputValue);

      if (
        trimmedInputValue &&
        trimmedInputValue.length > 3 &&
        inputValueOnTagArray === -1
      ) {
        setTags([...tags, trimmedInputValue]);
        setSelectedTags([...selectedTags, trimmedInputValue]);
        field.onChange([...selectedTags, trimmedInputValue]);
      }

      if (inputValueOnTagArray !== -1) {
        setSelectedTags([...selectedTags, tags[inputValueOnTagArray]]);
      }

      setInputVisible(false);
      setInputValue("");
    },
    [inputValue, selectedTags, tags]
  );

  useEffect(() => {
    if (initialTags && !tags?.length) {
      setTags(initialTags);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTags]);

  useEffect(() => {
    if (initialSelectedTags && !selectedTags?.length) {
      setSelectedTags(initialSelectedTags);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSelectedTags]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div>
          <h2 className="text-2xl">Tags</h2>
          <ErrorMessage error={error} />
          <div ref={parentRef} className="flex flex-wrap gap-2 mb-4 mt-2">
            {tags.map((tag) => (
              <CheckableTag
                className="flex items-center p-2 text-sm select-none border-neutral-300 dark:border-neutral-600 rounded-none dark:text-neutral-200 "
                key={tag}
                checked={selectedTags.includes(tag)}
                onChange={handleChange(field, tag)}
              >
                {tag}
              </CheckableTag>
            ))}
          </div>
          <div className="w-full relative">
            {inputVisible ? (
              <Input
                className="bg-white border-zinc-300 h-[46px] dark:text-white dark:border-neutral-800 p-3 w-full dark:bg-neutral-900 rounded-none focus:border-emerald-500"
                ref={inputRef}
                type="text"
                size="small"
                maxLength={30}
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputConfirm(field)}
                onPressEnter={handleInputConfirm(field)}
              />
            ) : (
              <Tag
                onClick={showInput}
                className="bg-white text-neutral-500 h-[46px] text-sm border-zinc-300 border-[1px] dark:border-neutral-800 p-3 w-full rounded-none dark:bg-neutral-900"
              >
                create new tag
              </Tag>
            )}
            <button
              type="button"
              disabled={!inputValue}
              onClick={handleInputConfirm(field)}
              className="h-full px-5 absolute right-0 bg-emerald-500 flex items-center justify-center hover:opacity-80 top-1/2 -translate-y-1/2"
              aria-label="Add new tag"
              title="Add new tag"
            >
              <MdOutlineAdd size={22} className="text-white" />
            </button>
          </div>
        </div>
      )}
    />
  );
};

export default SelectTags;