import { api } from "~/utils/api";
import { Character } from "~/components/chat/Character";

export function SelectCharacterBox(props: { goToChat: () => void }) {
  const characters = api.character.findAll.useQuery();

  return (
    <div className="ronded flex h-full w-full flex-col items-center gap-3  bg-purple-200 pl-2 pr-2 pt-3">
      {characters.data?.map((character, index) => (
        <Character
          character={character}
          key={index}
          goToChat={props.goToChat}
        />
      ))}
    </div>
  );
}
