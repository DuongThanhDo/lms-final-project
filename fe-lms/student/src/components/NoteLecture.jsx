import { useState, useEffect } from "react";
import React from "react";
import AddNoteForm from "./AddNoteForm";
import { Select, Space } from "antd";
import NoteItem from "./NoteItem";
import axios from "axios";
import { configs } from "../configs";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const NoteLecture = ({ currentTime, videoRef }) => {
  const { courseId, lectureId } = useParams();
  const user = useSelector((state) => state.auth.userInfo);
  const studentId = user?.id;
  const [notes, setNotes] = useState([]);
  const [lectureFilter, setLectureFilter] = useState("current");
  const [sortOrder, setSortOrder] = useState("latest");

  const fetchNotes = async () => {
    try {
      const params = {
        student_id: Number(user?.id),
        course_id: Number(courseId),
      };
      if (lectureFilter === "current" && lectureId && !isNaN(lectureId)) {
        params.lecture_id = Number(lectureId);
      }

      const response = await axios.get(`${configs.API_BASE_URL}/notes`, {
        params,
      });
      let sorted = response.data.sort((a, b) => {
        const aTime = new Date(a.updated_at || a.created_at).getTime();
        const bTime = new Date(b.updated_at || b.created_at).getTime();
        return sortOrder === "latest" ? bTime - aTime : aTime - bTime;
      });
      setNotes(sorted);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    if (lectureId && studentId) {
      fetchNotes();
    }
  }, [lectureId, studentId, lectureFilter, sortOrder]);

  return (
    <div className="container p-3">
      <AddNoteForm
        currentTime={currentTime}
        lectureId={lectureId}
        courseId={courseId}
        studentId={studentId}
        videoRef={videoRef}
        onNoteCreated={fetchNotes}
      />

      <Space style={{ marginBottom: 16 }} wrap>
        <Select
          value={lectureFilter}
          style={{ width: 200 }}
          onChange={(value) => setLectureFilter(value)}
        >
          <Select.Option value="all">Tất cả các bài giảng</Select.Option>
          <Select.Option value="current">Bài giảng hiện tại</Select.Option>
        </Select>

        <Select
          value={sortOrder}
          style={{ width: 240 }}
          onChange={(value) => setSortOrder(value)}
        >
          <Select.Option value="latest">Mới nhất</Select.Option>
          <Select.Option value="oldest">Cũ nhất</Select.Option>
        </Select>
      </Space>

      {notes.map((note) => (
        <NoteItem key={note.id} note={note} fetchNotes={fetchNotes} />
      ))}
    </div>
  );
};

export default NoteLecture;
