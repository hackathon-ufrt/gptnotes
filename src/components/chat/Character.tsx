import { type BaseType } from "~/types/baseType";
import { type CharacterResponse } from "~/types/character";
import React from "react";
import { api } from "~/utils/api";

type CharacterProps = BaseType & {
  character: CharacterResponse;
};

export function Character(props: CharacterProps) {
  const { character } = props;

  const setCharacter = api.character.setActiveCharacter.useMutation();

  return (
    <button
      onClick={() => setCharacter.mutate({ id: character.id })}
      className="flex h-8 w-full items-center rounded bg-white"
    >
      <p className="text-2xl ">{character.name}</p>
    </button>
  );
}
