import { type TodoResponse } from "~/types/todo";
import Todo from "~/components/todo/Todo";

export function TodoList(props: { todos: TodoResponse[] }) {
  return (
    <div className="flex flex-col gap-3 overflow-scroll">
      {props.todos.map((todo, index) => (
        <Todo todo={todo} key={index} />
      ))}
    </div>
  );
}
