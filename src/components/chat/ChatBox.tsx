import { TextInput } from "~/components/basic/TextInput";
import { useState } from "react";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import { Message } from "~/components/chat/Message";

export function ChatBox() {
  const [message, setMessage] = useState("");

  const context = api.useContext();

  const messages = api.message.findAll.useQuery();

  const sendMessage = api.message.create.useMutation({
    onSuccess: () => {
      void context.message.invalidate();
      setMessage("");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage.mutate({ content: message });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full flex-col items-center justify-center gap-1 rounded-lg bg-white/10 "
    >
      <div className="flex h-full w-full flex-col items-end gap-3 overflow-scroll p-3">
        {messages.data?.map((message, index) => (
          <Message message={message} key={index} />
        ))}
      </div>

      <TextInput placeholder="Message" value={message} setValue={setMessage} />
    </form>
  );
}
