import React, { useState } from "react";
import { Avatar, Button, Input, List, Typography } from "antd";

const { TextArea } = Input;

const QASection = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Đặng Nguyễn Tiến",
      content: "Lỗi Unhandled Rejection (TypeError): t.flatten is not a function thì thêm import * as tf from '@tensorflow/tfjs' nhé",
      replies: [
        {
          id: 11,
          author: "Đô Lê",
          content: "Sửa lỗi Unhandled Rejection (TypeError): t.flatten is not a function kiểu gì ạ?",
        },
        {
          id: 12,
          author: "Đặng Nguyễn Tiến",
          content: "import * as tf from '@tensorflow/tfjs' bạn import cái này vào nhé",
        },
        {
          id: 13,
          author: "Đô Lê",
          content: "Cảm ơn ạ",
        },
      ],
    },
  ]);

  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    const newItem = {
      id: Date.now(),
      author: "Bạn",
      content: newComment,
      replies: [],
    };
    setComments([newItem, ...comments]);
    setNewComment("");
  };

  return (
    <div>
      {/* Input comment */}
      <div style={{ marginBottom: 16 }}>
        <Avatar style={{ backgroundColor: "#87d068" }}>B</Avatar>
        <TextArea
          rows={2}
          placeholder="Nhập bình luận của bạn"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
          type="primary"
          onClick={handleAddComment}
          style={{ marginTop: 8 }}
        >
          Bình luận
        </Button>
      </div>

      {/* Danh sách comment */}
      <List
        itemLayout="horizontal"
        dataSource={comments}
        renderItem={(item) => (
          <div key={item.id} style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 8 }}>
              <Avatar style={{ backgroundColor: "#87d068" }}>
                {item.author[0]}
              </Avatar>
              <Typography.Text strong style={{ marginLeft: 8 }}>
                {item.author}
              </Typography.Text>
            </div>
            <Typography.Paragraph>{item.content}</Typography.Paragraph>
            <div>
              <Button size="small" style={{ marginRight: 8 }}>
                Thích
              </Button>
              <Button size="small">Phản hồi</Button>
            </div>

            {/* Replies */}
            {item.replies.map((reply) => (
              <div key={reply.id} style={{ marginLeft: 32, marginTop: 8 }}>
                <div style={{ marginBottom: 8 }}>
                  <Avatar style={{ backgroundColor: "#87d068" }}>
                    {reply.author[0]}
                  </Avatar>
                  <Typography.Text style={{ marginLeft: 8 }}>
                    {reply.author}
                  </Typography.Text>
                </div>
                <Typography.Paragraph>{reply.content}</Typography.Paragraph>
                <div>
                  <Button size="small" style={{ marginRight: 8 }}>
                    Thích
                  </Button>
                  <Button size="small">Phản hồi</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      />
    </div>
  );
};

export default QASection;
