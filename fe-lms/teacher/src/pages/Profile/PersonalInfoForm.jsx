import React, { useEffect, useState } from "react";
import { Form, Input, DatePicker, Select, Button, message } from "antd";
import { useSelector } from "react-redux";
import moment from "moment";
import axios from "axios";
import { Card } from "react-bootstrap";
import { configs } from "../../configs";

const PersonalInfoForm = () => {
  const [form] = Form.useForm();
  const user = useSelector((state) => state.auth.userInfo);
  const [loading, setLoading] = useState(false);
  const [profileId, setProfileId] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${configs.API_BASE_URL}/user-profiles/${user.id}`);
        const data = response.data;
        setProfileId(response.data.id);

        form.setFieldsValue({
          name: data.name || "",
          phone: data.phone || "",
          dob: data.date_of_birth ? moment(data.date_of_birth) : null,
          gender: data.gender ? "male" : "female",
          address: data.address || "",
        });
      } catch (error) {
        console.error("Lỗi tải thông tin cá nhân:", error);
      }
    };

    fetchUserProfile();
  }, [user?.id, form]);

  const handleSave = async (values) => {
    if (!user?.id) return;
    setLoading(true);

    try {
      await axios.put(`${configs.API_BASE_URL}/user-profiles/${profileId}`, {
        name: values.name || null,
        phone: values.phone || null,
        date_of_birth: values.dob ? values.dob.format("YYYY-MM-DD") : null,
        gender: values.gender === "male",
        address: values.address || null,
      });

      message.success("Thông tin đã được cập nhật thành công!");
    } catch (error) {
      message.error("Lưu thông tin thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4">
    <Form form={form} layout="vertical" onFinish={handleSave}>
      <Form.Item label="Họ và tên" name="name">
        <Input placeholder="Nhập họ và tên" />
      </Form.Item>
      <Form.Item label="Số điện thoại" name="phone">
        <Input placeholder="Nhập số điện thoại" />
      </Form.Item>
      <Form.Item label="Ngày sinh" name="dob">
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item label="Giới tính" name="gender">
        <Select>
          <Select.Option value="male">Nam</Select.Option>
          <Select.Option value="female">Nữ</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Địa chỉ" name="address">
        <Input placeholder="Nhập địa chỉ" />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        Lưu thông tin
      </Button>
    </Form></Card>
  );
};

export default PersonalInfoForm;
