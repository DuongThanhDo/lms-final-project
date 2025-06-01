import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  message,
  Tooltip,
  Switch,
  Card,
  Input,
  Popconfirm,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { configs } from "../../configs";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const CertificateList = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch danh sách chứng chỉ
  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${configs.API_BASE_URL}/certificates`);
      setCertificates(res.data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách chứng chỉ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  // Tìm kiếm chứng chỉ
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Lọc chứng chỉ theo tên
  const filteredCertificates = certificates.filter((certificate) =>
    certificate.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle trạng thái
  const handleStatusToggle = async (record) => {
    const newStatus = !record.status;
    try {
      const res = await axios.patch(
        `${configs.API_BASE_URL}/certificates/${record.id}`,
        {
          status: newStatus,
        }
      );

      if (res.data.success === false) {
        message.warning(res.data.message || "Không thể cập nhật trạng thái");
      } else {
        message.success(res.data.message || "Cập nhật trạng thái thành công");
        fetchCertificates();
      }
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra khi kết nối máy chủ");
    }
  };

  // Xóa chứng chỉ
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${configs.API_BASE_URL}/certificates/${id}`);
      message.success("Xóa chứng chỉ thành công");
      fetchCertificates();
    } catch (error) {
      console.log(error.data?.message);
      message.warning('Đang có khóa học sử dụng chứng chỉ này');
    }
  };

  const columns = [
    {
      title: "Trạng thái",
      key: "status",
      align: "center",
      render: (_, record) => (
        <div>
          <Switch
            checked={record.status}
            onChange={() => handleStatusToggle(record)}
          />
        </div>
      ),
      width: 180,
    },
    {
      title: "Tên chứng chỉ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => dayjs(text).format("DD/MM/YYYY"),
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      align: "center",
      render: (_, record) => (
        <div>
          <Link
            to={`/center/certificates/${record.id}`}
            style={{ marginRight: 8 }}
          >
            <Button type="primary" icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="Bạn có chắc muốn xóa chứng chỉ này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Input
          placeholder="Tìm kiếm danh mục"
          value={searchTerm}
          onChange={handleSearch}
          style={{ flexGrow: 1, marginRight: 16 }}
        />
        <Link to={`/center/certificates`}>
          <Button type="primary">+ Thêm chứng chỉ</Button>
        </Link>
      </div>
      <Table
        columns={columns}
        dataSource={filteredCertificates}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 6 }}
      />
    </Card>
  );
};

export default CertificateList;
