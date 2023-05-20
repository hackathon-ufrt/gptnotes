import React from "react";
import { type TodoResponse } from "~/types/todo";

import { api } from "~/utils/api";
import { toast } from "react-toastify";

export default function Todo(props: { todo: TodoResponse }) {
  const { title, done, due } = props.todo;

  const context = api.useContext();

  const checkTodo = api.todo.check.useMutation({
    onSuccess: async () => {
      await context.todo.invalidate();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onClick = () => {
    void toast.promise(
      checkTodo.mutateAsync({ id: props.todo.id, done: !done }),
      {
        pending: "Loading...",
      }
    );
  };

  const deleteTodo = api.todo.delete.useMutation({
    onSuccess: async () => {
      await context.todo.invalidate();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const deleteTodoHandler = () => {
    void toast.promise(
      deleteTodo.mutateAsync({ id: props.todo.id }),
      {
        pending: "Loading...",
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white/10 p-4">
      <div className="flex w-full items-center gap-3">
        <input
          onClick={onClick}
          type="checkbox"
          checked={done}
          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
        />
        <p className="text-2xl text-white">{title}</p>
        {due && <p className="text-gray-300">{due.toDateString()}</p>}
        <div className="flex-1" />
        <button className="text-white rounded-full bg-red-500 w-8 h-8" onClick={deleteTodoHandler}>X</button>
      </div>
    </div>
  );
}
