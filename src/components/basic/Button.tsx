import { BaseType } from "~/types/baseType";

type ButtonProps = BaseType & {
  onClick: () => void;
};

export default function Button(props: ButtonProps) {
  return (
    <button
      className="h-20 w-full rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
      {...props}
    />
  );
}
