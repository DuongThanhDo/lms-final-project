import React, { useState } from "react";
import { Input, Button, message } from "antd";
import { CheckOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { configs } from "../configs";
import { formatDuration } from "../utils/functions/time";

const { TextArea } = Input;

const AddNoteForm = ({
  lectureId,
  courseId,
  studentId,
  currentTime,
  videoRef,
  onNoteCreated,
}) => {
  const [note, setNote] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const onCancel = () => {
    setShowForm(false);
    setNote("");
    videoRef?.current?.play(); // Tiếp tục phát video khi hủy
  };

  const onAddNote = async () => {
    if (!note.trim()) {
      message.warning("Vui lòng nhập nội dung ghi chú");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        lecture_id: Number(lectureId),
        course_id: Number(courseId),
        student_id: Number(studentId),
        content: note.trim(),
        timestamp: Math.floor(currentTime),
      };      

      await axios.post(`${configs.API_BASE_URL}/notes`, payload);
      message.success("Thêm mới ghi chú thành công!");
      setNote("");
      setShowForm(false);
      videoRef?.current?.play();
      onNoteCreated?.();
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi khi thêm ghi chú");
    } finally {
      setLoading(false);
    }
  };

  const handleShowForm = () => {
    setShowForm(true);
    videoRef?.current?.pause(); // Dừng video khi mở form
  };

  return (
    <div>
      {!showForm ? (
        <Input
          placeholder={`Tạo ghi chú mới tại ${formatDuration(currentTime)}`}
          prefix={<PlusOutlined />}
          style={{ width: "100%", marginBottom: 12 }}
          onClick={handleShowForm}
          readOnly
        />
      ) : (
        <div style={{ marginBottom: 16 }}>
          <h5>Thêm ghi chú mới tại {formatDuration(currentTime)}</h5>
          <TextArea
            autoFocus
            placeholder="Nội dung ghi chú"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            style={{ marginBottom: 8 }}
          />
          <Button onClick={onCancel} icon={<CloseOutlined />}>
            Hủy
          </Button>
          <Button
            type="primary"
            onClick={onAddNote}
            icon={<CheckOutlined />}
            loading={loading}
            style={{ marginLeft: 8 }}
          >
            Lưu
          </Button>
        </div>
      )}
    </div>
  );
};

export default AddNoteForm;
