import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Form, Input, Button, Typography, Spin } from "antd";
import { Card } from "react-bootstrap";
import { DeleteOutlined } from "@ant-design/icons";
import { configs } from "../configs";

const { Text } = Typography;

const EditableList = ({ title, description, apiEndpoint, items, setItems }) => {
  const { id } = useParams();
  const courseId = parseInt(id, 10);
  const [newItem, setNewItem] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleAddItem = () => {
    if (newItem.trim()) {
      axios.post(`${configs.API_BASE_URL}/${apiEndpoint}`, { courseId, description: newItem })
        .then((res) => setItems([...items, res.data]))
        .catch((err) => console.error(err));
      setNewItem("");
    }
  };

  const handleChangeItem = (index, value) => {
    const updatedItems = [...items];
    updatedItems[index].description = value;
    setItems(updatedItems);
    axios.patch(`${configs.API_BASE_URL}/${apiEndpoint}/${updatedItems[index].id}`, { description: value })
      .catch((err) => console.error(err));
  };

  const handleDeleteItem = (index) => {
    axios.delete(`${configs.API_BASE_URL}/${apiEndpoint}/${items[index].id}`)
      .then(() => setItems(items.filter((_, i) => i !== index)))
      .catch((err) => console.error(err));
  };

  return (
    <Form.Item label={<Text strong>{title}</Text>}>
      <p>{description}</p>
      {items.map((item, index) => (
        <div
          key={item.id}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{ display: "flex", alignItems: "center", gap: "8px", margin: "8px 0" }}
        >
          <Input
            value={item.description}
            onChange={(e) => handleChangeItem(index, e.target.value)}
            onBlur={() => setItems([...items])}
          />
          {hoveredIndex === index && (
            <Button danger size="small" onClick={() => handleDeleteItem(index)}>
              <DeleteOutlined />
            </Button>
          )}
        </div>
      ))}
      <Input
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        placeholder="Nhập nội dung..."
        onPressEnter={handleAddItem}
      />
      <Button className="mt-3" type="dashed" onClick={handleAddItem} block disabled={!newItem.trim()}>
        + Thêm nội dung
      </Button>
    </Form.Item>
  );
};

export default EditableList;
