import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { Formik, Form, Field } from "formik";
import { useUserStore } from "../Stores/useUserStore";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<
    { role: string; content: string | undefined }[]
  >([]);
  const { postChatbot } = useUserStore();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white w-12 h-12
                   rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 
                   transition-all z-50"
      >
        <MessageCircle size={28} />
      </button>
      {open && (
        <div
          className="fixed bottom-24 right-6 w-80 h-[480px] bg-white shadow-2xl 
                        rounded-xl flex flex-col border border-gray-200 animate-slide-up z-50"
        >
          <div className="flex justify-between items-center p-4 bg-blue-600 text-white rounded-t-xl">
            <h2 className="font-semibold">Finance Assistant</h2>
            <button onClick={() => setOpen(false)}>
              <X size={22} />
            </button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`my-2 flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-[75%] text-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t bg-white">
            <Formik
              initialValues={{ message: "" }}
              onSubmit={async (values, { resetForm }) => {
                const text = values.message.trim();
                if (!text) return;
                setMessages((prev) => [
                  ...prev,
                  { role: "user", content: text },
                ]);
                resetForm();
                const reply = await postChatbot(text);
                setMessages((prev) => [
                  ...prev,
                  { role: "assistant", content: reply },
                ]);
              }}
            >
              {() => (
                <Form className="flex gap-2">
                  <Field
                    name="message"
                    placeholder="Ask something..."
                    className="flex-1 border rounded-lg px-3 py-2 text-sm"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Send
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
