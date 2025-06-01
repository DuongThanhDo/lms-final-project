import { Form, Input, Button, Row, Col, message, Card } from "antd";
import { useEffect } from "react";
import axios from "axios";
import { configs } from "../../configs";

const CenterInfoForm = () => {
  const [form] = Form.useForm();

  const fetchInfo = async () => {
    try {
      const { data } = await axios.get(`${configs.API_BASE_URL}/central-information/1`);
      form.setFieldsValue(data);
    } catch (error) {
      message.error("Không thể tải thông tin trung tâm");
    }
  };

  const onFinish = async (values) => {
    try {
      await axios.put(`${configs.API_BASE_URL}/central-information/1`, values);
      message.success("Cập nhật thành công!");
    } catch (error) {
      message.error("Cập nhật thất bại");
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <Card>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label="Tên trung tâm">
              <Input placeholder="Nhập tên trung tâm" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="phone" label="Số điện thoại">
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
        </Row>
  
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="email" label="Email">
              <Input placeholder="Nhập email" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="address" label="Địa chỉ">
              <Input placeholder="Nhập địa chỉ" />
            </Form.Item>
          </Col>
        </Row>
  
        <Form.Item name="description" label="Giới thiệu">
          <Input.TextArea rows={4} placeholder="Giới thiệu về trung tâm" />
        </Form.Item>
  
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CenterInfoForm;
