import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ChatBotVisibility = () => {
  const location = useLocation();

  useEffect(() => {
    const bot = document.querySelector("df-messenger");

    if (!bot) return;

    if (location.pathname === "/") {
      bot.style.display = "block";
    } else {
      bot.style.display = "none";
    }
  }, [location]);

  return null;
};

export default ChatBotVisibility;
