import { TextInput } from "~/components/basic/TextInput";
import { useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import { Message } from "~/components/chat/Message";

export function ChatBox() {
  const [message, setMessage] = useState("");

  const context = api.useContext();

  const messages = api.message.findAll.useQuery();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = api.message.create.useMutation({
    onSuccess: () => {
      void context.message.invalidate();
      setMessage("");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const requestGPTResponse = api.message.generateGPT.useMutation({
    onSuccess: () => {
      void context.message.invalidate();
      void context.todo.invalidate();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const deleteMessage = api.message.deleteAll.useMutation({
    onSuccess: async () => {
      await context.message.invalidate();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const clearChatHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    void toast.promise(
      deleteMessage.mutateAsync(),
      {
        pending: "Loading...",
      }
    );
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void sendMessage.mutateAsync({ content: message }).then(() => {
      void toast.promise(requestGPTResponse.mutateAsync(), {
        pending: "Thinking...",
      });
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div
      className="flex h-96 grow w-full flex-col items-center justify-center gap-1 rounded-lg "
    >
      <button className="h-8 w-full" onClick={clearChatHandler}>Clear chat</button>
      <div className="m-0 flex h-full w-full flex-col items-end gap-3 overflow-scroll p-2 scrollbar-hide">
        {messages.data?.slice(0).reverse().map((message, index) => (
          <Message message={message} key={index} />
        ))}
        <div className="h-0 w-0" ref={messagesEndRef} />
      </div>
      <form className="flex w-full" onSubmit={onSubmit}>
        <TextInput placeholder="Message" value={message} setValue={setMessage} />
        <button className="h-8 w-20" type="submit">Send</button>
      </form>
    </div>
  );
}
