import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Form, Spin } from "antd";
import { Card } from "react-bootstrap";
import EditableList from "../../../components/EditableList";
import { configs } from "../../../configs";


const TargetStudents = () => {
    const { id } = useParams();
    const courseId = parseInt(id, 10);
    const [learningGoals, setLearningGoals] = useState([]);
    const [requirements, setRequirements] = useState([]);
  
    useEffect(() => {
      axios.get(`${configs.API_BASE_URL}/course-outcomes?courseId=${courseId}`)
        .then((res) => setLearningGoals(res.data))
        .catch((err) => console.error(err));
  
      axios.get(`${configs.API_BASE_URL}/course-requirements?courseId=${courseId}`)
        .then((res) => setRequirements(res.data))
        .catch((err) => console.error(err))
    }, [courseId]);
  
    return (
      <Card className="p-4">
        <Form layout="vertical">
          <EditableList
            title="Học viên sẽ học được gì trong khóa học của bạn?"
            description="Bạn hãy liệt kê các mục tiêu hoặc kết quả học tập mà học viên có thể mong đợi sau khi hoàn thành khóa học."
            apiEndpoint="course-outcomes"
            items={learningGoals}
            setItems={setLearningGoals}
          />
  
          <EditableList
            title="Yêu cầu hoặc điều kiện tiên quyết để tham gia khóa học?"
            description="Liệt kê các kỹ năng, kinh nghiệm, hoặc thiết bị học viên cần có."
            apiEndpoint="course-requirements"
            items={requirements}
            setItems={setRequirements}
          />
        </Form>
      </Card>
    );
  };

export default TargetStudents;