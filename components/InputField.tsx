interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
}

export default function InputField({
  id,
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  disabled = false,
  required = false,
}: Readonly<InputFieldProps>) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-regular">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="bg-white dark:bg-stone-900 dark:placeholder-stone-500 placeholder-stone-400 w-full p-3 rounded-md border-[0.5] border-gray-400 dark:border-stone-700 focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
      />
    </div>
  );
}
