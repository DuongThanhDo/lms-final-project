import React, { useState } from "react";
import { Card, Button, Input, Modal } from "antd";
import { EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import SectionItem from "./SectionItem";
import AddNewItemForm from "./AddNewItemForm";
import { useCurriculum } from "../context/CurriculumContext";

const { confirm } = Modal;

const CurriculumSection = ({ section }) => {
  const { deleteSection, editSection } = useCurriculum();
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(section.title);
  const [hovered, setHovered] = useState(false);

  const getLastOrder = (section) => {
    if (!section.items.length) return 1;
    return Math.max(...section.items.map(item => item.order)) + 1;
  };

  const showDeleteConfirm = () => {
    confirm({
      title: "Xác nhận xóa chương này?",
      icon: <ExclamationCircleOutlined />,
      content: "Chương này và tất cả bài giảng bên trong sẽ bị xóa vĩnh viễn. Bạn có chắc chắn muốn tiếp tục?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      centered: true,
      onOk() {
        deleteSection(section.id);
      },
    });
  };

  return (
    <Card
      className="mb-3"
      title={
        <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ display: "flex", alignItems: "center" }}>
          {editing ? (
            <>
              <Input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} autoFocus style={{ width: "100%", marginRight: 8 }} />
              <Button type="primary" onClick={() => { editSection(section.id, editedTitle); setEditing(false); }} icon={<CheckOutlined />}>Lưu</Button>
              <Button style={{ marginLeft: 8 }} onClick={() => setEditing(false)} icon={<CloseOutlined />}>Hủy</Button>
            </>
          ) : (
            <span>{`Chương ${section.index + 1}: ${section.title}`}</span>
          )}

          {hovered && !editing && (
            <div>
              <Button size="small" className="me-2" style={{ marginLeft: 8 }} icon={<EditOutlined />} onClick={() => setEditing(true)} />
              <Button size="small" danger icon={<DeleteOutlined />} onClick={showDeleteConfirm} />
            </div>
          )}
        </div>
      }
    >
      {section.items.map((item, index) => <SectionItem key={item.id} item={item} index={index} />)}

      <AddNewItemForm sectionId={section.id} order={getLastOrder(section)} />
    </Card>
  );
};

export default CurriculumSection;
