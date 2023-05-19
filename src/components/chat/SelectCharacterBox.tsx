import { api } from "~/utils/api";
import { Character } from "~/components/chat/Character";

export function SelectCharacterBox(props: { goToChat: () => void }) {
  const characters = api.character.findAll.useQuery();

  return (
    <div className="flex h-full w-full flex-col items-center gap-1 rounded  pl-3 pr-3 pt-1">
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
