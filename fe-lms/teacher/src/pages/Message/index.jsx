import React, { useState, useEffect, useCallback } from "react";
import { List, Avatar, Input, Button, message as antdMessage } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import socket from "../../services/socket";
import axios from "axios";
import { configs } from "../../configs";

const MessagePage = () => {
  const user = useSelector((state) => state.auth.userInfo);

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");

  const getOtherParticipant = (participants = []) =>
    participants.find((u) => u.id !== user.id);

  const fetchMessages = useCallback(async (conversationId) => {
    try {
      const res = await axios.get(
        `${configs.API_BASE_URL}/messages/conversation/${conversationId}/messages`
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Lỗi tải tin nhắn:", err);
    }
  }, []);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await axios.get(
        `${configs.API_BASE_URL}/messages/user/${user.id}/conversations`
      );
      setConversations(res.data);

      if (res.data.length > 0 && !selectedConversation) {
        const firstConv = res.data[0];
        setSelectedConversation(firstConv);
        fetchMessages(firstConv.id);
      }
    } catch (err) {
      console.error("Lỗi tải danh sách cuộc trò chuyện:", err);
    }
  }, [user.id, selectedConversation, fetchMessages]);

  const sendMessage = async () => {
    if (!messageContent.trim()) return;

    const payload = {
      content: messageContent,
      senderId: user.id,
      conversationId: selectedConversation.id,
    };

    socket.emit("sendMessage", payload);

    setMessageContent("");
  };

  const handleNewMessage = useCallback(
    (newMsg) => {
      if (
        newMsg.conversation?.id === selectedConversation?.id ||
        newMsg.conversationId === selectedConversation?.id
      ) {
        setMessages((prev) => [...prev, newMsg]);
      }
    },
    [selectedConversation]
  );

  useEffect(() => {
    fetchConversations();
    socket.emit("userConnected", user.id);
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [fetchConversations, user.id, handleNewMessage]);

  const handleSelectConversation = async (conv) => {
    if (selectedConversation?.id === conv.id) return;

    setSelectedConversation(conv);
    setMessages([]);

    fetchMessages(conv.id);
  };

  useEffect(() => {
    const container = document.querySelector(".flex-grow-1");
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages]);

  return (
    <div className="container-fluid">
      <div className="row" style={{ height: "90vh" }}>
        {/* Sidebar */}
        <div className="col-md-3 border-end overflow-auto">
          <h5 className="p-3 border-bottom bg-light text-center">Tin nhắn</h5>
          <List
            itemLayout="horizontal"
            dataSource={conversations}
            renderItem={(item) => {
              const other = getOtherParticipant(item.participants);
              return (
                <List.Item
                  onClick={() => handleSelectConversation(item)}
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      selectedConversation?.id === item.id
                        ? "#f0f2f5"
                        : "white",
                  }}
                >
                  <List.Item.Meta
                    style={{
                      padding: "0 10px",
                      display: "flex",
                      alignItems: "center",
                    }}
                    avatar={
                      <Avatar src={other?.profile?.avatar?.file_url}>
                        {other?.profile?.name?.[0]}
                      </Avatar>
                    }
                    title={other?.profile?.name || other?.email || "Người dùng"}
                  />
                </List.Item>
              );
            }}
          />
        </div>

        {/* Chatbox */}
        <div className="col-md-9 d-flex flex-column pt-2">
          <div
            className="flex-grow-1 p-3 overflow-auto"
            style={{
              background: "#fafafa",
              height: "calc(90vh - 120px)",
              overflowY: "auto",
            }}
          >
            {messages.map((msg, idx) => {
              const isMine = msg.sender.id === user.id;
              const showAvatar =
                idx === 0 || messages[idx - 1].sender.id !== msg.sender.id;

              return (
                <div
                  key={idx}
                  className={`mb-2 d-flex ${
                    isMine ? "justify-content-end" : "justify-content-start"
                  }`}
                >
                  {!isMine ? (
                    showAvatar ? (
                      <Avatar
                        src={msg.sender?.profile?.avatar?.file_url}
                        style={{ marginRight: 8 }}
                      >
                        {msg.sender?.profile?.name?.[0]}
                      </Avatar>
                    ) : (
                      <div style={{ width: 40 }} />
                    )
                  ) : null}
                  <div
                    className={`p-2 rounded ${
                      isMine ? "bg-primary text-white" : "bg-light"
                    }`}
                    style={{
                      maxWidth: "70%",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-2 border-top">
            <Input
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              onPressEnter={sendMessage}
              placeholder="Nhập tin nhắn..."
              addonAfter={
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={sendMessage}
                  size="small"
                >
                  Gửi
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
