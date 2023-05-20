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
      <div
        className={
          "w-full rounded-2xl bg-white p-2 " +
          (message.isGPT ? " rounded-bl-none" : "rounded-br-none")
        }
      >
        {message.isGPT && message.character?.name && (
          <p className="text-green-500">{message.character.name}</p>
        )}
        {visualContent.split("\\n").map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
      {message.isGPT && <div className="w-2/6" />}
    </div>
  );
}
