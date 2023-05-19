import { TodoList } from "~/components/todo/TodoList";
import { api } from "~/utils/api";
import Button from "~/components/basic/Button";
import { toast } from "react-toastify";

export function TodoBox() {
  const todos = api.todo.findAll.useQuery();

  const createTodo = api.todo.create.useMutation({
    onSuccess: async () => {
      await todos.refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  function createTodoHandler() {
    createTodo.mutate({
      title: "Neues Todo 🎉",
      dueDate: new Date(),
    });
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <TodoList todos={todos.data ?? []} />
      <Button onClick={createTodoHandler}>Create Todo</Button>
    </div>
  );
}
