import { type BaseType } from "~/types/baseType";
import { type CharacterResponse } from "~/types/character";
import React from "react";
import { api } from "~/utils/api";

type CharacterProps = BaseType & {
  character: CharacterResponse;
  goToChat: () => void;
};

export function Character(props: CharacterProps) {
  const { character, goToChat } = props;

  const context = api.useContext();

  const setCharacter = api.character.setActiveCharacter.useMutation({
    onSuccess: async () => {
      await context.me.invalidate();
      goToChat();
    },
  });

  return (
    <button
      onClick={() => setCharacter.mutate({ id: character.id })}
      className="flex h-8 w-full items-center rounded bg-white pl-2"
    >
      <p className="text-1xl ">{character.name}</p>
    </button>
  );
}
