import React, { useState } from "react";
import { Button, Input, Dropdown, Menu } from "antd";
import { PlusOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useCurriculum } from "../context/CurriculumContext";
import { CourseStatus } from "../utils/enums";

const typeLabels = {
  lecture: "Bài giảng",
  coding: "Bài tập coding",
  quiz: "Bài tập trắc nghiệm",
};

const AddNewItemForm = ({ sectionId, order }) => {
  const { addItem, course } = useCurriculum();
  const [isAdding, setIsAdding] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [selectedType, setSelectedType] = useState("");

  return isAdding ? (
    <div style={{ marginBottom: 16 }}>
      <h5>Thêm mới {typeLabels[selectedType] || "mục"}</h5>
      <Input placeholder="Nhập tiêu đề" value={newItemTitle} onChange={(e) => setNewItemTitle(e.target.value)} style={{ marginBottom: 8 }} />
      <Button type="primary" onClick={() => { addItem(sectionId, selectedType, newItemTitle, order); setIsAdding(false); setNewItemTitle(""); }} icon={<CheckOutlined />}>Lưu</Button>
      <Button style={{ marginLeft: 8 }} onClick={() => setIsAdding(false)} icon={<CloseOutlined />}>Hủy</Button>
    </div>
  ) : (
    course?.status != CourseStatus.PUBLISHED && (<Dropdown overlay={<Menu onClick={(e) => { setSelectedType(e.key); setIsAdding(true); }}>{Object.keys(typeLabels).map((type) => <Menu.Item key={type}>{typeLabels[type]}</Menu.Item>)}</Menu>}>
      <Button icon={<PlusOutlined />}>Mục mới</Button>
    </Dropdown>)
  );
};

export default AddNewItemForm;
