import React from "react";
import { type TodoResponse } from "~/types/todo";

export default function Todo(props: { todo: TodoResponse }) {
  const { title, content } = props.todo;

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white/10 p-4">
      <p className="text-2xl text-white">{title}</p>
      <p className="text-white">{content}</p>
    </div>
  );
}
