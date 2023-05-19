import { useState } from "react";
import { ChatBox } from "~/components/chat/ChatBox";
import { SelectCharacterBox } from "~/components/chat/SelectCharacterBox";

export function SelectPageWrapper() {
  const [selected, setSelected] = useState<"CHARACTER" | "CHAT">("CHAT");

  return (
    <div className="flex h-full w-full flex-col overflow-clip pb-10">
      <div className="h-10 w-full rounded bg-white">
        <button
          className="h-10 w-10"
          onClick={() => {
            selected === "CHARACTER"
              ? setSelected("CHAT")
              : setSelected("CHARACTER");
          }}
        >
          {"<"}
        </button>
      </div>
      {selected === "CHAT" ? <ChatBox /> : <SelectCharacterBox />}
    </div>
  );
}
