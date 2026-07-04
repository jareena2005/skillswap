import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function ChatRoomPage() {
  const { swapId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { myUsername, otherUser } = location.state || { myUsername: "Me", otherUser: "Them" };
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("Connecting...");
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!swapId) {
      setStatus("Invalid room");
      setError("Chat room ID is missing.");
      return;
    }

    const wsUrlBase = import.meta.env.VITE_WS_URL || import.meta.env.VITE_API_URL;
    let wsUrl;

    if (wsUrlBase?.startsWith("ws://") || wsUrlBase?.startsWith("wss://")) {
      wsUrl = `${wsUrlBase.replace(/\/$/, "")}/chat/${swapId}/`;
    } else if (wsUrlBase) {
      const protocol = wsUrlBase.startsWith("https") ? "wss" : "ws";
      const host = wsUrlBase.replace(/^https?:\/\//, "").replace(/\/api\/?$/, "");
      wsUrl = `${protocol}://${host}/ws/chat/${swapId}/`;
    } else {
      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      wsUrl = `${protocol}://${window.location.hostname}:8000/ws/chat/${swapId}/`;
    }

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected", wsUrl);
      setStatus("Connected");
      setIsConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data.message) return;
        setMessages((prev) => [
          ...prev,
          { text: data.message, sender: data.sender || "Unknown", id: Date.now() + Math.random() },
        ]);
      } catch (err) {
        console.error("Invalid websocket message", err, event.data);
      }
    };

    ws.onerror = (event) => {
      console.error("WebSocket error", event);
      setStatus("Connection error");
      setError("Unable to connect to the chat server.");
    };

    ws.onclose = (event) => {
      console.log("WebSocket disconnected", event.code, event.reason);
      setStatus("Disconnected");
      setIsConnected(false);
      if (!error) {
        setError("Chat connection closed.");
      }
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [swapId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setError("WebSocket is not connected yet. Please wait.");
      return;
    }

    ws.send(
      JSON.stringify({
        message: input.trim(),
        sender: myUsername,
      })
    );

    setInput("");
  };

  return (
    <div className="p-6 min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-100/50 p-6 flex flex-col h-[80vh]">
        <div className="flex justify-between items-start gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span>Chat Room with</span>
              <span className="text-blue-650 bg-blue-50 px-2.5 py-0.5 rounded-lg text-sm">{otherUser}</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">Room: {swapId} · {status}</p>
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-slate-500 hover:text-blue-600 text-sm font-semibold transition cursor-pointer"
          >
            &larr; Back to Dashboard
          </button>
        </div>

        <div className="flex-1 overflow-y-auto border border-slate-100 rounded-xl p-4 mb-4 bg-slate-50/50 flex flex-col gap-3">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <span className="text-3xl mb-1">💬</span>
              <p className="text-sm font-medium">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender === myUsername;
              return (
                <div
                  key={msg.id}
                  className={`px-4 py-2.5 rounded-2xl max-w-[75%] shadow-sm ${isMe
                    ? "bg-blue-600 text-white self-end rounded-tr-none text-left"
                    : "bg-white border border-slate-200 text-slate-800 self-start rounded-tl-none text-left"
                  }`}
                >
                  <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                    {isMe ? `${msg.sender} (you)` : msg.sender}
                  </div>
                  <div className="text-sm leading-relaxed font-medium">{msg.text}</div>
                </div>
              );
            })
          )}
          <div ref={scrollRef} />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder={isConnected ? "Type a message..." : "Connecting to chat..."}
            className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 transition-all"
            disabled={!isConnected}
          />
          <button
            onClick={sendMessage}
            disabled={!isConnected || !input.trim()}
            className={`px-5 py-2.5 rounded-lg font-bold text-sm shadow-sm transition ${isConnected ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-slate-200 text-slate-500 cursor-not-allowed"}`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
