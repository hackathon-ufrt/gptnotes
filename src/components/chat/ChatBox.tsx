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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void sendMessage.mutateAsync({ content: message }).then(() => {
      requestGPTResponse.mutate();
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <form
      onSubmit={onSubmit}
      className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-lg "
    >
      <div className="flex w-full flex-col items-end gap-3 overflow-scroll pl-3 pr-3">
        {messages.data?.map((message, index) => (
          <Message message={message} key={index} />
        ))}
        <div className="h-0 w-0" ref={messagesEndRef} />
      </div>
      <TextInput placeholder="Message" value={message} setValue={setMessage} />
    </form>
  );
}
