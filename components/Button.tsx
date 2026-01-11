import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
}
export default function Button({
  isLoading = false,
  children,
  className = "",
  ...props
}: Readonly<ButtonProps>) {
  return (
    <button
      {...props}
      className={`
        h-12 flex justify-center items-center font-medium
        bg-black text-white dark:bg-white dark:text-black
        hover:bg-stone-800 dark:hover:bg-stone-200
        transition-all duration-500 ease-in-out
        mx-auto
        ${isLoading ? "w-12 rounded-full" : "w-full rounded-full"}
        ${className}
      `}
      disabled={props.disabled || isLoading}
    >
      {isLoading ? (
        <div className="w-6 h-6 border-2 border-white/20 border-t-white dark:border-black/20 dark:border-t-black rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}
