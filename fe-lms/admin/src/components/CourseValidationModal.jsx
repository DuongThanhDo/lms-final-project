import React from "react";
import { Modal, Button, List } from "antd";

const CourseValidationModal = ({ errors, visible, onClose }) => {
  return (
    <Modal
      title="Lỗi khi kiểm tra khóa học"
      visible={visible}
      onCancel={onClose}
      centered={true}
      footer={[
        <Button key="close" type="primary" onClick={onClose}>
          Đóng
        </Button>,
      ]}
    >
      <List
        dataSource={errors}
        renderItem={(error) => <List.Item>{error}</List.Item>}
      />
    </Modal>
  );
};

export default CourseValidationModal;