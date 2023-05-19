import { api } from "~/utils/api";
import Button from "~/components/basic/Button";
import { toast } from "react-toastify";
import Todo from "~/components/todo/Todo";

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
      <div className="flex flex-col gap-3 overflow-scroll scrollbar-hide">
        {todos.data?.map((todo, index) => (
          <Todo todo={todo} key={index} />
        ))}
      </div>
      <Button onClick={createTodoHandler}>Create Todo</Button>
    </div>
  );
}
