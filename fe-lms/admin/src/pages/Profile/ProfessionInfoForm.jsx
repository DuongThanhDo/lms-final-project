import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";
import { Card } from "react-bootstrap";
import { configs } from "../../configs";

const ProfessionInfoForm = () => {
  const [form] = Form.useForm();
  const user = useSelector((state) => state.auth.userInfo);
  const [loading, setLoading] = useState(false);
  const [profession, setProfession] = useState({});

  useEffect(() => {
    if (!user?.id) return;

    const fetchProfessionInfo = async () => {
      try {
        const response = await axios.get(
          `${configs.API_BASE_URL}/professions/${user.id}`
        );
        const data = response.data;

        setProfession(data[0]);

        form.setFieldsValue({
          major: data[0].major || "",
          level: data[0].level || "",
          bio: data[0].bio || "",
        });
      } catch (error) {
        console.error("Lỗi tải thông tin chuyên ngành:", error);
      }
    };

    fetchProfessionInfo();
  }, [user?.id, form]);

  const handleSave = async (values) => {
    if (!profession?.id) return;
    setLoading(true);
    console.log(values);

    try {
      await axios.put(`${configs.API_BASE_URL}/professions/${profession?.id}`, {
        major: values.major || null,
        level: values.level || null,
        bio: values.bio || null,
      });

      message.success("Thông tin chuyên ngành đã được cập nhật!");
    } catch (error) {
      message.error("Lưu thông tin thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <Form form={form} layout="vertical" onFinish={handleSave}>
        <Form.Item label="Chuyên ngành" name="major">
          <Input placeholder="Nhập chuyên ngành" />
        </Form.Item>
        <Form.Item label="Trình độ" name="level">
          <Input placeholder="Nhập trình độ" />
        </Form.Item>
        <Form.Item label="Kinh nghiệm làm việc" name="bio">
          <Input.TextArea placeholder="Nhập kinh nghiệm làm việc" rows={4} />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Lưu thông tin
        </Button>
      </Form>
    </Card>
  );
};

export default ProfessionInfoForm;
