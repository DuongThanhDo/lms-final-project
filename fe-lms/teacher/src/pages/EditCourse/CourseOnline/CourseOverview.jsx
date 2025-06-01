import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, message } from "antd";
import { Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { configs } from "../../../configs";

const CourseOverview = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const [certificates, setCertificates] = useState([]);

  const { id: courseId } = useParams();

  const categories = useSelector((state) => state.categories.list);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `${configs.API_BASE_URL}/courses/${courseId}`
        );

        const response2 = await axios.get(
          `${configs.API_BASE_URL}/certificates/status`,
          { params: { status: true } }
        );
        const data = response.data;
        setCourse(data);
        setCertificates(response2.data);

        form.setFieldsValue({
          name: data.name || "",
          description: data.description || "",
          category: data.category?.id || null,
          price: data.price || "",
          certificate: data.certificate?.id || null,
        });
      } catch (error) {
        console.error("Lỗi tải thông tin khóa học:", error);
      }
    };

    fetchCourseDetails();
  }, [courseId, form]);

  const handleSave = async (values) => {
    if (!courseId) return;
    setLoading(true);

    try {
      await axios.put(`${configs.API_BASE_URL}/courses/${courseId}`, {
        name: values.name || null,
        description: values.description || null,
        category: values.category || null,
        price: values.price || null,
        certificate: values.certificate || null,
      });

      message.success("Thông tin khóa học đã được cập nhật thành công!");
    } catch (error) {
      message.error("Lưu thông tin thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <Form form={form} layout="vertical" onFinish={handleSave}>
        <Form.Item label="Tên khóa học" name="name">
          <Input placeholder="Nhập tên khóa học" />
        </Form.Item>
        <Form.Item label="Mô tả khóa học" name="description">
          <Input.TextArea placeholder="Nhập mô tả khóa học" rows={4} />
        </Form.Item>
        <Form.Item label="Danh mục" name="category">
          <Select
            allowClear
            onChange={(value) =>
              form.setFieldsValue({ category: Number(value) })
            }
          >
            {categories.map((category) => (
              <Select.Option value={category.id}>{category.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Giá" name="price">
          <Input placeholder="Nhập giá" />
        </Form.Item>
        <Form.Item label="Chứng chỉ" name="certificate">
          <Select
            allowClear
            placeholder="Chọn chứng chỉ"
            onChange={(value) =>
              form.setFieldsValue({ certificate: Number(value) })
            }
          >
            {certificates.map((certificate) => (
              <Select.Option value={certificate.id}>
                {certificate.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Lưu thông tin
        </Button>
      </Form>
    </Card>
  );
};

export default CourseOverview;
