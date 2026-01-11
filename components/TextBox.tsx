"use client";
import React, { useRef, useEffect, useState } from "react";
import { Send } from "lucide-react";

interface TextBoxProps {
  text: string;
  setText: (text: string) => void;
  onSend: () => void;
  isDisabled?: boolean;
}

export default function TextBox({
  text,
  setText,
  onSend,
  isDisabled = false,
}: Readonly<TextBoxProps>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = textarea.scrollHeight;
      textarea.style.height = `${newHeight}px`;

      setIsExpanded(newHeight > 40);
    }
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}
      className="w-full max-w-3xl px-4 flex flex-col items-center gap-2"
    >
      <div
        onClick={() => textareaRef.current?.focus()}
        className={`
          w-full flex items-end gap-2 border-[0.5] border-gray-300 dark:border-stone-700 
          bg-white dark:bg-stone-900 p-3 pl-6 pr-4 shadow-sm cursor-text 
          ${isExpanded ? "rounded-3xl" : "rounded-full"}
          
        `}
      >
        <textarea
          disabled={isDisabled}
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
          rows={1}
          onKeyDown={handleKeyDown}
          className="flex-1 resize-none min-h-[40px] max-h-[33vh] py-2 overflow-y-auto border-none outline-none placeholder-stone-500 text-stone-800 dark:text-stone-100"
        />

        <button
          type="submit"
          disabled={!text.trim()}
          className={`p-2 ${
            isExpanded ? "self-end" : "self-center"
          } text-sm font-medium dark:bg-white dark:text-black bg-black text-white rounded-full cursor-pointer hover:opacity-80 disabled:opacity-20`}
        >
          <Send size={18} />
        </button>
      </div>

      <div className={`w-full flex justify-start px-4 duration-200`}>
        <span className="text-[10px] tracking-widest text-stone-500">
          {text.length} / 200
        </span>
      </div>
    </form>
  );
}
