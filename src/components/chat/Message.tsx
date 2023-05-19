import { type MessageResponse } from "~/types/message";
import { type BaseType } from "~/types/baseType";
import { useMemo } from "react";
import { parseActionCode } from "~/external/openai/chatGPTActionItems";

type MessageProps = BaseType & {
  message: MessageResponse;
};

export function Message(props: MessageProps) {
  const { message } = props;

  const visualContent = useMemo(() => {
    if (message.isGPT) {
      const actions = parseActionCode(message.content);
      for (const action of actions) {
        if (action.type === "print") {
          return action.content;
        }
      }
      return "";
    }
    return message.content;
  }, [message]);

  return (
    <div className="flex w-full flex-row">
      {!message.isGPT && <div className="w-2/6" />}
      <div className="w-full rounded bg-purple-50 p-1">{visualContent}</div>
      {message.isGPT && <div className="w-2/6" />}
    </div>
  );
}
