import React, { useState } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AddNewSectionForm from "../../../components/AddNewSectionForm";
import CurriculumSection from "../../../components/CurriculumSection";
import { useCurriculum } from "../../../context/CurriculumContext";
import { CourseStatus } from "../../../utils/enums";

const Curriculum = () => {
  const { course, sections, addSection } = useCurriculum();
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");

  return (
    <div>
      {sections.map((section, index) => (
        <CurriculumSection key={section.id} section={{ ...section, index }} />
      ))}

      {isAddingSection ? (
        <AddNewSectionForm
          newSectionTitle={newSectionTitle}
          setNewSectionTitle={setNewSectionTitle}
          onAddSection={() => {
            addSection(newSectionTitle);
            setIsAddingSection(false);
            setNewSectionTitle("");
          }}
          setIsAddingSection={setIsAddingSection}
        />
      ) : (
        course?.status != CourseStatus.PUBLISHED && (<Button type="dashed" onClick={() => setIsAddingSection(true)} icon={<PlusOutlined />}>
          Thêm chương
        </Button>)
      )}
    </div>
  );
};

export default Curriculum;
