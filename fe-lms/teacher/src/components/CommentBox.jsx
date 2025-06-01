import React, { useEffect, useState } from "react";
import socket from "../services/socket";
import axios from "axios";
import { Button, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from "react-redux";
import CommentItem from "./CommentItem";
import "dayjs/locale/vi";
import { configs } from "../configs";

dayjs.extend(relativeTime);
dayjs.locale("vi");

function CommentBox({ contentType, contentId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [infoUser, setInfoUser] = useState({});
  const user = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    if (!user?.id) return;

    const fetchUserAvatar = async () => {
      try {
        const response = await fetch(
          `${configs.API_BASE_URL}/user-profiles/${user.id}`
        );
        if (!response.ok) throw new Error("Không thể tải ảnh đại diện.");
        const data = await response.json();
        setInfoUser(data);
      } catch (error) {
        console.error("Lỗi tải ảnh đại diện:", error);
      }
    };

    fetchUserAvatar();
  }, [user?.id]);

  useEffect(() => {
    fetchComments();
    socket.emit("joinRoom", { contentType, contentId });

    socket.on("newComment", (newComment) => {
      if (
        newComment.commentable_type === contentType &&
        newComment.commentable_id === contentId
      ) {
        setComments((prev) => [...prev, newComment]);
      }
    });

    return () => {
      socket.off("newComment");
    };
  }, [contentType, contentId]);

  const fetchComments = async () => {
    const res = await axios.get(
      `${configs.API_BASE_URL}/comments/${contentType}/${contentId}`
    );
    setComments(res.data);
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      await axios.post(`${configs.API_BASE_URL}/comments`, {
        content,
        user_id: user.id,
        commentable_type: contentType,
        commentable_id: contentId,
      });

      setContent("");
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
    }
  };

  const renderComments = (list, parentId = null) =>
    list
      .filter((c) => c.parent_id === parentId)
      .map((c) => (
        <CommentItem
          key={c.id}
          comment={c}
          user={user}
          currentUser={infoUser}
          contentType={contentType}
          contentId={contentId}
          allComments={comments}
          setAllComments={setComments}
        />
      ));

  return (
    <div className="container p-3">
      {/* Input */}
      <div className="d-flex mb-5 align-items-center">
        <Avatar
          size="large"
          src={infoUser?.avatar?.file_url}
          icon={<UserOutlined />}
          className="me-2"
          style={{ minWidth: 40 }}
        />
        <textarea
          className="form-control me-2"
          rows={1}
          placeholder="Nhập bình luận của bạn..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <Button type="primary" onClick={handleSubmit}>
          Bình luận
        </Button>
      </div>

      <div style={{ maxHeight: "500px", overflowY: "auto", paddingRight: 12 }}>
        {renderComments(comments)}
      </div>
    </div>
  );
}

export default CommentBox;
