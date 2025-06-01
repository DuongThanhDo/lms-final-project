import React, { useState, useEffect, useCallback } from "react";
import {
  List,
  Avatar,
  Input,
  Button,
  message as antdMessage,
  Grid,
} from "antd";
import { SendOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import socket from "../../services/socket";
import axios from "axios";
import { configs } from "../../configs";

const { useBreakpoint } = Grid;

const MessagePage = () => {
  const [searchParams] = useSearchParams();
  const teacherId = searchParams.get("teacher");
  const user = useSelector((state) => state.auth.userInfo);

  const screens = useBreakpoint();

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");

  const [showSidebar, setShowSidebar] = useState(true);

  const isMobile = !screens.md;

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

      if (res.data.length > 0 && !selectedConversation && !teacherId) {
        const firstConv = res.data[0];
        setSelectedConversation(firstConv);
        fetchMessages(firstConv.id);
      }
    } catch (err) {
      console.error("Lỗi tải danh sách cuộc trò chuyện:", err);
    }
  }, [user.id, selectedConversation, teacherId, fetchMessages]);

  const initConversationWithTeacher = useCallback(async () => {
    try {
      const res = await axios.get(
        `${configs.API_BASE_URL}/messages/conversation-between`,
        { params: { user1: teacherId, user2: user.id } }
      );

      if (res.data) {
        setSelectedConversation(res.data);
        fetchMessages(res.data.id);
      } else {
        const newConv = await axios.post(
          `${configs.API_BASE_URL}/messages/conversation`,
          { participantIds: [teacherId, user.id] }
        );
        setSelectedConversation(newConv.data);
      }
    } catch (err) {
      console.error("Lỗi tạo hoặc lấy cuộc trò chuyện với giáo viên:", err);
    }
  }, [teacherId, user.id, fetchMessages]);

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

  useEffect(() => {
    if (teacherId && user.id) {
      initConversationWithTeacher();
    }
  }, [teacherId, user.id, initConversationWithTeacher]);

  useEffect(() => {
    if (!isMobile) {
      setShowSidebar(true);
    }
  }, [isMobile]);

  const handleSelectConversation = (conv) => {
    if (selectedConversation?.id === conv.id) return;

    setSelectedConversation(conv);
    setMessages([]);
    fetchMessages(conv.id);

    // Trên mobile, sau khi chọn thì ẩn sidebar
    if (isMobile) setShowSidebar(false);
  };

  useEffect(() => {
    const container = document.querySelector(".flex-grow-1");
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages]);

  return (
    <div className="container-fluid">
      <div className="row" style={{ height: "90vh" }}>
        {/* Sidebar */}
        {(showSidebar || !selectedConversation) && (
          <div
            className={`${
              isMobile ? "col-12" : "col-md-3"
            } border-end overflow-auto`}
            style={{ display: showSidebar ? "block" : "none" }}
          >
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
                      title={
                        other?.profile?.name || other?.email || "Người dùng"
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </div>
        )}

        {/* Chatbox */}
        {(!isMobile || (selectedConversation && !showSidebar)) && (
          <div
            className={`${
              isMobile ? "col-12" : "col-md-9"
            } d-flex flex-column pt-2`}
          >
            {/* Back button for mobile */}
            {isMobile && (
              <div className="p-2 border-bottom d-flex align-items-center bg-light">
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => setShowSidebar(true)}
                  type="link"
                ></Button>
                <strong className="ms-2">
                  {
                    getOtherParticipant(selectedConversation.participants)
                      ?.profile?.name
                  }
                </strong>
              </div>
            )}
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
        )}
      </div>
    </div>
  );
};

export default MessagePage;
