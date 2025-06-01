import React from "react";
import { Form, Input, Button, Select, message, Card } from "antd";
import axios from "axios";
import { configs } from "../../configs";

const { Option } = Select;

const AddNewUserForm = () => {
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    try {
      await axios.post(`${configs.API_BASE_URL}/users/registerByAdmin`, values);
      message.success("Thêm người dùng thành công!");

      await axios.post(`${configs.API_BASE_URL}/mailer/send`, {
        to: values.email,
        subject: "Thông tin tài khoản của bạn",
        html: `
          <p>Chào bạn <b>${values.name}</b>,</p>
          <p>Tài khoản của bạn đã được tạo với thông tin:</p>
          <ul>
            <li>Email: ${values.email}</li>
            <li>Mật khẩu: ${values.password}</li>
            <li>Vai trò: ${values.role === "teacher" ? "Giáo viên" : "Học viên"}</li>
          </ul>
          <p>Vui lòng đăng nhập và thay đổi mật khẩu để bảo mật tài khoản.</p>
          <p>Trân trọng,</p>
          <p>Đội ngũ hỗ trợ</p>
        `,
      });
      
      form.resetFields();
    } catch (error) {
      const errMsg = error.response?.data?.message || "Đã có lỗi xảy ra!";
      message.error(errMsg);
    }
  };

  return (
    <Card>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Họ tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input placeholder="Nhập họ tên" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        <Form.Item
          label="Vai trò"
          name="role"
          rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
        >
          <Select placeholder="Chọn vai trò">
            <Option value="teacher">Giáo viên</Option>
            <Option value="student">Học viên</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Thêm người dùng
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddNewUserForm;
