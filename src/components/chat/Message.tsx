import { type MessageResponse } from "~/types/message";
import { type BaseType } from "~/types/baseType";

type MessageProps = BaseType & {
  message: MessageResponse;
};

export function Message(props: MessageProps) {
  const { message } = props;

  return (
    <div className="flex w-full flex-row">
      {!message.isGPT && <div className="w-2/6" />}
      <div className="w-full rounded bg-white p-1">{message.content}</div>
      {message.isGPT && <div className="w-2/6" />}
    </div>
  );
}
