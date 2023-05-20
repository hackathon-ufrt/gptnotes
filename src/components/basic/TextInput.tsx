import { type BaseType } from "~/types/baseType";

type TextInputProps = BaseType & {
  placeholder?: string;
  required?: boolean;
  value?: string;
  setValue?: (value: string) => void;
};

export function TextInput(props: TextInputProps) {
  const { placeholder, required, setValue, value, className } = props;

  return (
    <input
      type="text"
      className={
        (className || "") +
        " block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
      }
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={(e) => setValue && setValue(e.target.value)}
    />
  );
}
