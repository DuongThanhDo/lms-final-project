import React, { useState } from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { configs } from "../configs";

const { Option } = Select;

const ModalCreateCourse = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.userInfo);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("Dữ liệu khóa học:", values);

      setLoading(true);
      const response = await axios.post(`${configs.API_BASE_URL}/courses`, {
        ...values,
        teacherId: user?.id,
      });

      if (response.data) {
        message.success("Tạo khóa học thành công!");
        
        setTimeout(() => {
          navigate(`/courses/edit/${response.data}`);
        }, 1000);
      } else {
        message.error(response.data.message || "Tạo khóa học thất bại!");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi kết nối đến server!");
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      form.resetFields();
    }
  };

  return (
    <div>
      <Button color="cyan" variant="solid" onClick={showModal}>
        <PlusOutlined className="mr-1" /> Khóa học mới
      </Button>
      <Modal
        title="Tạo khóa học mới"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Tạo"
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên khóa học"
            rules={[{ required: true, message: "Vui lòng nhập tên khóa học!" }]}
          >
            <Input placeholder="Nhập tên khóa học" />
          </Form.Item>
          <Form.Item
            name="type"
            label="Loại khóa học"
            rules={[
              { required: true, message: "Vui lòng chọn loại khóa học!" },
            ]}
          >
            <Select placeholder="Chọn loại">
              <Option value="online">Online</Option>
              <Option value="offline">Offline</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ModalCreateCourse;
