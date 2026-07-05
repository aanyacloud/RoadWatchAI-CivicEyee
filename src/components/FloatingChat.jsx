import { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roadData, setRoadData] = useState([]);
  const [complaints, setComplaints] = useState([]);

  const messagesEndRef = useRef(null);

  const language =
    localStorage.getItem("language") || "en";

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const fetchData = async () => {
    try {
      const roadSnapshot = await getDocs(
        collection(db, "road_metadata")
      );

      const roadInfo =
        roadSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

      setRoadData(roadInfo);

      const complaintSnapshot =
        await getDocs(
          collection(db, "complaints")
        );

      const complaintInfo =
        complaintSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

      setComplaints(complaintInfo);
    } catch (error) {
      console.log(error);
    }
  };

  const askAI = async () => {
    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      text: message,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setLoading(true);

    try {
      const genAI =
        new GoogleGenerativeAI(
          import.meta.env
            .VITE_GEMINI_API_KEY
        );

      const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

      const prompt = `
You are RoadWatch AI Assistant.

Answer ONLY using provided data.

Language:
${
  language === "hi"
    ? "Hindi"
    : "English"
}

Road Metadata:
${JSON.stringify(roadData)}

Complaints:
${JSON.stringify(complaints)}

Question:
${message}
`;

      const result =
        await model.generateContent(
          prompt
        );

      const answer =
        result.response.text();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: answer,
        },
      ]);
    } catch (error) {
      console.log(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            language === "hi"
              ? "उत्तर प्राप्त नहीं हुआ।"
              : "Unable to generate response.",
        },
      ]);
    }

    setMessage("");
    setLoading(false);
  };

  return (
    <>
      {/* FLOAT BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="
        fixed
        bottom-6
        right-6
        z-[9999]
        bg-cyan-500
        hover:bg-cyan-600
        text-white
        rounded-full
        w-16
        h-16
        text-3xl
        shadow-2xl
        transition
        "
      >
        🤖
      </button>

      {/* CHAT WINDOW */}
      {open && (
        <div
          className="
          fixed
          bottom-24
          right-6
          w-[400px]
          h-[550px]
          bg-slate-900
          border
          border-slate-700
          rounded-3xl
          shadow-2xl
          flex
          flex-col
          z-[9999]
        "
        >
          {/* HEADER */}
          <div
            className="
            p-4
            border-b
            border-slate-700
            flex
            justify-between
            items-center
          "
          >
            <h2
              className="
              text-cyan-400
              text-xl
              font-bold
            "
            >
              🤖 RoadWatch AI
            </h2>

            <button
              onClick={() =>
                setOpen(false)
              }
              className="text-slate-400"
            >
              ✖
            </button>
          </div>

          {/* CHAT */}
          <div
            className="
            flex-1
            overflow-y-auto
            p-4
            space-y-3
          "
          >
            {messages.length === 0 && (
              <div className="text-slate-400 text-sm">
                {language === "hi"
                  ? "सड़क, बजट, ठेकेदार या शिकायतों के बारे में पूछें।"
                  : "Ask about roads, budgets, contractors or complaints."}
              </div>
            )}

            {messages.map(
              (msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-2xl max-w-[85%] ${
                    msg.role ===
                    "user"
                      ? "bg-cyan-500 ml-auto text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {msg.text}
                </div>
              )
            )}

            {loading && (
              <div className="bg-slate-800 p-3 rounded-2xl text-slate-300">
                {language === "hi"
                  ? "सोच रहा है..."
                  : "Thinking..."}
              </div>
            )}

            <div
              ref={messagesEndRef}
            />
          </div>

          {/* INPUT */}
          <div
            className="
            p-4
            border-t
            border-slate-700
            flex
            gap-2
          "
          >
            <input
              type="text"
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter"
                ) {
                  askAI();
                }
              }}
              placeholder={
                language === "hi"
                  ? "सवाल पूछें..."
                  : "Ask a question..."
              }
              className="
              flex-1
              bg-slate-800
              border
              border-slate-700
              rounded-xl
              px-4
              py-3
              text-white
            "
            />

            <button
              onClick={askAI}
              className="
              bg-cyan-500
              hover:bg-cyan-600
              px-5
              rounded-xl
              font-bold
            "
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}