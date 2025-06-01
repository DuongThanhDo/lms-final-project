import React from "react";
import LectureItem from "./LectureItem";

const SectionItem = ({ item, index }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", }}>
      {item.type === "lecture" && <LectureItem lecture={item} lectureIndex={index} />}
    </div>
  );
};

export default SectionItem;
