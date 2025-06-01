import React, { useContext, useEffect, useState } from "react";
import { Card, Typography, message, Button, Space } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import QuizQuestion from "../../../../components/QuizQuestion";
import { configs } from "../../../../configs";
import { LearningProgressContext } from "../../../../layouts/CourseLayout";
import { ReloadOutlined } from "@ant-design/icons";

const { Title } = Typography;

const Quiz = () => {
  const { quizId } = useParams();
  const user = useSelector((state) => state.auth.userInfo);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quiz, setQuiz] = useState(0);
  const [quizProsess, setQuizProsess] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { watchedPercent, setWatchedPercent } = useContext(
    LearningProgressContext
  );

  const fetchDataQuiz = async () => {
    try {
      const quiz = await axios.get(`${configs.API_BASE_URL}/quizSQL/${quizId}`);
      const response = await axios.get(
        `${configs.API_BASE_URL}/quizzes/${quiz.data.quizFB_id}/questions`
      );
      setQuiz(quiz.data);
      setQuestions(response.data.data);
      setIsQuizStarted(true);
      setCorrectAnswers(0);
    } catch (error) {
      message.error("Lỗi lấy câu hỏi");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProgressQuiz = async () => {
    try {
      const response = await axios.get(
        `${configs.API_BASE_URL}/lesson-progresses/${quizId}/user/${user.id}`
      );

      setQuizProsess(response.data);
    } catch (error) {
      console.log("Error: ", error);
    } finally {
    }
  };

  useEffect(() => {
    fetchProgressQuiz();
    fetchDataQuiz();
  }, [quizId]);

  const handleNext = (isCorrect) => {
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const handleCompleted = async () => {
    try {
      const response = await axios.patch(
        `${configs.API_BASE_URL}/lesson-progresses/${quizProsess?.id}`,
        {
          score: Number(correctAnswers),
        }
      );

      setWatchedPercent(true);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleRetry = async () => {
  try {
    setCurrentIndex(0);
    setCorrectAnswers(0);
    setQuizProsess((prev) => ({ ...prev, status: false })); 
    setIsLoading(true);
    fetchDataQuiz();
  } catch (error) {
    message.error("Không thể làm lại quiz");
  }
};

  if (isLoading) {
    return (
      <Card style={{ maxWidth: 600, margin: "auto", marginTop: 40 }}>
        <Title level={4}>Đang tải câu hỏi...</Title>
      </Card>
    );
  }

  if (!isLoading && questions.length === 0) {
    return (
      <Card style={{ maxWidth: 600, margin: "auto", marginTop: 40 }}>
        <Title level={4}>Quiz này chưa có câu hỏi nào.</Title>
      </Card>
    );
  }

  return (
    <div className="container">
      <Title style={{ maxWidth: 600, margin: "auto", marginTop: 40 }} level={2}>
        {quiz.name}
      </Title>
      {currentIndex >= questions.length || (quizProsess?.status) ? (
        <Card style={{ maxWidth: 600, margin: "auto", marginTop: 40 }}>
          <Title level={4}>Kết quả</Title>
          <Title level={2}>
            {`Điểm của bạn: ${
              quizProsess?.status ? quizProsess.score : correctAnswers
            } / ${questions.length}`}
          </Title>

          <Space
            style={{ marginTop: 24 }}
            size="middle"
            direction="horizontal"
            align="center"
          >
            <Button
              icon={<ReloadOutlined />}
              type="default"
              size="large"
              onClick={handleRetry}
            >
              Làm lại
            </Button>

            {correctAnswers > questions.length / 2 && (
              <Button type="primary" size="large" onClick={handleCompleted}>
                Hoàn thành
              </Button>
            )}
          </Space>
        </Card>
      ) : (
        <Card style={{ maxWidth: 600, margin: "auto", marginTop: 10 }}>
          <Title level={4}>
            Câu {currentIndex + 1} / {questions.length}
          </Title>
          <QuizQuestion
            question={questions[currentIndex]}
            onNext={handleNext}
            isLast={currentIndex + 1 === questions.length}
            quizId={quiz.quizFB_id}
          />
        </Card>
      )}
    </div>
  );
};

export default Quiz;
