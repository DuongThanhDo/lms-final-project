import React, { useEffect, useState } from "react";
import { Radio, Space, Button, Alert, Typography, message } from "antd";
import axios from "axios";
import { configs } from "../../configs";

const { Text } = Typography;

const QuizQuestion = ({ question, quizId, onNext, isLast }) => {
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  const fetchAnswers = async () => {
    try {
      const res = await axios.get(
        `${configs.API_BASE_URL}/quizzes/${quizId}/questions/${question.id}/answers`
      );
      setAnswers(res.data.data);
      const correct = res.data.data.find((ans) => ans.correct === true);
      setCorrectAnswer(correct);
    } catch (error) {
      message.error("Lỗi khi tải đáp án");
    }
  };

  useEffect(() => {
    fetchAnswers();
    setSelected(null);
    setSubmitted(false);
  }, [question.id]);

  if (!answers || answers.length === 0) return null;

  const isCorrect = selected === correctAnswer?.id;

  return (
    <div>
      <Text strong>{question.name}</Text>

      <Radio.Group
        onChange={(e) => setSelected(e.target.value)}
        value={selected}
        style={{ display: "block", marginTop: 20 }}
        disabled={submitted}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          {answers.map((opt) => (
            <Radio
              value={opt.id}
              key={opt.id}
              style={{
                width: "100%",
                border: "1px solid #d9d9d9",
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "8px",
                transition: "background-color 0.3s ease",
                backgroundColor: selected === opt.id ? "#f0f5ff" : "white",
                boxShadow:
                  selected === opt.id
                    ? "0 0 10px rgba(81, 134, 255, 0.5)"
                    : "none",
              }}
            >
              {opt.value}
            </Radio>
          ))}
        </Space>
      </Radio.Group>

      {submitted && (
        <div style={{ marginTop: 20 }}>
          {isCorrect ? (
            <Alert message="Chính xác!" type="success" showIcon />
          ) : (
            <Alert
              message="Sai rồi!"
              description={
                <span>
                  Đáp án đúng: <strong>{correctAnswer?.value}</strong>
                </span>
              }
              type="error"
              showIcon
            />
          )}
          {question.explain && (
            <Text style={{ display: "block", marginTop: 10 }}>
              <strong>Giải thích:</strong> {question.explain}
            </Text>
          )}
        </div>
      )}

      <div style={{ marginTop: 30, textAlign: "right" }}>
        {!submitted ? (
          <Button
            type="primary"
            disabled={selected === null}
            onClick={() => setSubmitted(true)}
          >
            Xác nhận
          </Button>
        ) : (
          <Button type="primary" onClick={() => onNext(isCorrect)}>
            {isLast ? "Kết thúc" : "Câu tiếp theo"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizQuestion;
