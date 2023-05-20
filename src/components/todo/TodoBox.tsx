import { api } from "~/utils/api";
import Todo from "~/components/todo/Todo";

export function TodoBox() {
  const todos = api.todo.findAll.useQuery();

  return (
    <div className="flex  w-full flex-col gap-2">
      <div className="flex flex-col gap-3 overflow-scroll rounded scrollbar-hide">
        {todos.data?.map((todo, index) => (
          <Todo todo={todo} key={index} />
        ))}
      </div>
    </div>
  );
}
