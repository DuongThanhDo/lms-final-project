import React from "react";
import LectureItem from "./LectureItem";
import QuizItem from "./QuizItem";

const SectionItem = ({ item, index }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", }}>
      {item.type === "lecture" && <LectureItem lecture={item} lectureIndex={index} />}
      {item.type === "quiz" && <QuizItem quiz={item} quizIndex={index} />}
    </div>
  );
};

export default SectionItem;
