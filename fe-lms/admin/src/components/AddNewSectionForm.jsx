import React from "react";
import { Input, Button } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const AddNewSectionForm = ({ newSectionTitle, setNewSectionTitle, onAddSection, setIsAddingSection }) => {
    
  return (
    <div style={{ marginBottom: 16 }}>
      <h5>Thêm mới chương</h5>
      <Input autoFocus placeholder="Nhập tiêu đề chương mới" value={newSectionTitle} onChange={(e) => setNewSectionTitle(e.target.value)} style={{ marginBottom: 8 }} />
      <Button onClick={() => {setIsAddingSection(false); setNewSectionTitle("")}} icon={<CloseOutlined />}>Hủy</Button>
      <Button style={{ marginLeft: 8 }} type="primary" onClick={onAddSection} icon={<CheckOutlined />}>Lưu</Button>
    </div>
  );
};

export default AddNewSectionForm;
