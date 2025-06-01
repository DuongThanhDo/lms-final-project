import React, { useState, useEffect } from "react";
import QuizQuestionForm from "./QuizQuestionForm";
import QuizQuestionList from "./QuizQuestionList";
import { configs } from "../configs";
import axios from "axios";
import { message } from "antd";

const QuizQuestionManager = ({ quizId, showForm, setShowForm }) => {
  const [questionData, setQuestionData] = useState({
    id: undefined,
    name: "",
    explain: "",
    answers: [{ id: undefined, value: "", correct: false }],
  });
  const [isEditingIndex, setIsEditingIndex] = useState(null);
  const [questions, setQuestions] = useState([]);

  const resetForm = () => {
    setQuestionData({
      id: undefined,
      name: "",
      explain: "",
      answers: [{ id: undefined, value: "", correct: false }],
    });
    setIsEditingIndex(null);
  };

  const handleSaveSuccess = () => {
    resetForm();
    loadQuestions();
  };

  const loadQuestions = async () => {
    try {
      const response = await axios.get(
        `${configs.API_BASE_URL}/quizzes/${quizId}/questions`
      );
      const data = await response.data;
      setQuestions(data.data || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const loadAnswersForQuestion = async (questionId) => {
    try {
      const response = await axios.get(
        `${configs.API_BASE_URL}/quizzes/${quizId}/questions/${questionId}/answers`
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching answers:", error);
      return [];
    }
  };

  const onDelete = async (index) => {
    try {
      const questionToDelete = questions[index];
      await axios.delete(
        `${configs.API_BASE_URL}/quizzes/${quizId}/questions/${questionToDelete.id}`
      );
      const updated = [...questions];
      message.success("Xóa thành công câu hỏi.");
      updated.splice(index, 1);
      setQuestions(updated);
    } catch (error) {
      console.error("Error deleting question:", error);
      message.error("Có lỗi xảy ra khi xóa câu hỏi.");
    }
  };

  useEffect(() => {
    if (quizId) {
      loadQuestions();
    }
  }, [quizId]);

  return (
    <div>
      {showForm && (
        <QuizQuestionForm
          quizId={quizId}
          questionData={questionData}
          isEditing={isEditingIndex !== null}
          onSaveSuccess={handleSaveSuccess}
          onCancelEdit={resetForm}
        />
      )}

      <QuizQuestionList
        questions={questions}
        onEdit={async (index) => {
          const q = questions[index];
          const answers = await loadAnswersForQuestion(q.id);
          setQuestionData({
            id: q.id,
            name: q.name,
            explain: q.explain,
            answers: answers,
          });
          setIsEditingIndex(index);
          setShowForm(true);
        }}
        onDelete={onDelete}
      />
    </div>
  );
};

export default QuizQuestionManager;
