import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Input, message, Card, Popconfirm } from "antd";
import axios from "axios";
import { configs } from "../../configs";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State để lưu trữ từ khóa tìm kiếm

  // Fetch danh sách danh mục
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${configs.API_BASE_URL}/categories`);
      setCategories(res.data);
      setFilteredCategories(res.data); // Cập nhật filteredCategories
    } catch (error) {
      message.error("Lỗi khi tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Lọc danh sách danh mục theo từ khóa tìm kiếm
    if (value) {
      const filtered = categories.filter((category) =>
        category.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  };

  const showModal = (category = null) => {
    if (category) {
      setIsEditing(true);
      setCurrentCategory(category);
      setCategoryName(category.name);
    } else {
      setIsEditing(false);
      setCategoryName("");
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCategoryName("");
  };

  const handleOk = async () => {
    if (!categoryName) {
      message.error("Tên danh mục không được để trống");
      return;
    }
    try {
      if (isEditing) {
        await axios.patch(
          `${configs.API_BASE_URL}/categories/${currentCategory.id}`,
          { name: categoryName }
        );
        message.success("Cập nhật danh mục thành công");
      } else {
        await axios.post(`${configs.API_BASE_URL}/categories`, {
          name: categoryName,
        });
        message.success("Thêm danh mục thành công");
      }
      fetchCategories();
      handleCancel();
    } catch (error) {
      message.error(
        isEditing ? "Cập nhật danh mục thất bại" : "Thêm danh mục thất bại"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${configs.API_BASE_URL}/categories/${id}`);
      message.success("Xóa danh mục thành công");
      fetchCategories();
    } catch (error) {
      message.error("Xóa danh mục thất bại");
    }
  };

  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      render: (_, record) => (
        <div>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa danh mục này?"
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
          alignItems: "center",
        }}
      >
        <Input
          placeholder="Tìm kiếm danh mục"
          value={searchTerm}
          onChange={handleSearch}
          style={{ marginBottom: 16, flexGrow: 1, marginRight: 16 }}
        />
        <Button type="primary" onClick={() => showModal()} className="mb-3">
          + Thêm danh mục
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredCategories}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 6 }}
      />
      <Modal
        title={isEditing ? "Sửa danh mục" : "Thêm danh mục"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        okText={isEditing ? "Cập nhật" : "Thêm"}
      >
        <Input
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Nhập tên danh mục"
        />
      </Modal>
    </Card>
  );
};

export default CategoryList;
