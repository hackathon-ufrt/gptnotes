import { useState } from "react";
import { ChatBox } from "~/components/chat/ChatBox";
import { SelectCharacterBox } from "~/components/chat/SelectCharacterBox";
import { api } from "~/utils/api";

export function SelectPageWrapper() {
  const [selected, setSelected] = useState<"CHARACTER" | "CHAT">("CHAT");

  const me = api.me.getMe.useQuery();

  return (
    <div className="flex w-full flex-col overflow-clip rounded bg-purple-200">
      <div className="h-10 w-full  rounded bg-white">
        {selected === "CHAT" && <button
          className="h-10 w-10"
          onClick={() => {
            setSelected("CHARACTER");
          }}
        >
          {"<"}
        </button>}
        {selected === "CHAT" && me?.data?.activeCharacter?.name}
      </div>
      {selected === "CHAT" ? (
        <ChatBox />
      ) : (
        <SelectCharacterBox goToChat={() => setSelected("CHAT")} />
      )}
    </div>
  );
}
