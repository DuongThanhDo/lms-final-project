import { Table, Switch, message, Modal, Input, Card } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import React, { useState, useMemo, useEffect } from "react";
import { debounce } from "lodash";
import { Roles } from "../../utils/enums";
import axios from "axios";
import { configs } from "../../configs";

const { Search } = Input;

const UserList = ({ role, refreshKey }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${configs.API_BASE_URL}/users`, {
        params: { role },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Lỗi tải người dùng:", error);
      message.error("Lỗi tải người dùng. Vui lòng tải lại!");
    }
  };

  const handleSearch = debounce((value) => {
    setSearchTerm(value);
  }, 500);

  useEffect(() => {
    if (!role) return;
    fetchUser();
  }, [refreshKey]);

  const handleToggleLock = async (user) => {
    Modal.confirm({
      title: user.isLock ? "Xác nhận mở khóa" : "Xác nhận khóa",
      icon: <ExclamationCircleOutlined />,
      content: user.isLock
        ? `Bạn có chắc muốn mở khóa người dùng "${user.profile.name}" không?`
        : `Bạn có chắc muốn khóa người dùng "${user.profile.name}" không?`,
      okText: user.isLock ? "Mở khóa" : "Khóa",
      cancelText: "Hủy",
      centered: true,
      onOk: async () => {
        try {
          const response = await axios.patch(
            `${configs.API_BASE_URL}/users/lock/${user.id}`,
            {
              isLock: !user.isLock,
            }
          );

          fetchUser();

          message.success(
            response.data.isLock
              ? "Đã khóa người dùng!"
              : "Đã mở khóa người dùng!"
          );
        } catch (error) {
          message.error("Thao tác thất bại!");
        }
      },
    });
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const idMatch = user.id?.toString().includes(searchTerm);
      const nameMatch = user.profile?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const emailMatch = user.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      return idMatch || nameMatch || emailMatch;
    });
  }, [searchTerm, users]);

  const columns = [
    {
      title: "Trạng thái",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Switch
          checked={!record.isLock}
          onChange={() => handleToggleLock(record)}
        />
      ),
      fixed: "left",
      width: 120,
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id) => id ?? "N/A",
      width: 80,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => email ?? "N/A",
      width: 200,
    },
    {
      title: "Họ tên",
      dataIndex: ["profile", "name"],
      key: "name",
      render: (name) => name ?? "N/A",
      width: 160,
    },
    {
      title: "SĐT",
      dataIndex: ["profile", "phone"],
      key: "phone",
      render: (phone) => phone ?? "N/A",
      width: 140,
    },
    {
      title: "Ngày sinh",
      dataIndex: ["profile", "date_of_birth"],
      key: "dob",
      render: (dob) =>
        dob ? new Date(dob).toLocaleDateString("vi-VN") : "N/A",
      width: 120,
    },
    {
      title: "Giới tính",
      dataIndex: ["profile", "gender"],
      key: "gender",
      render: (gender) =>
        gender === true ? "Nam" : gender === false ? "Nữ" : "N/A",
      width: 100,
    },
    {
      title: "Địa chỉ",
      dataIndex: ["profile", "address"],
      key: "address",
      render: (address) => address ?? "N/A",
      width: 180,
    },
    role === Roles.TEACHER && {
      title: "Chuyên ngành",
      dataIndex: ["profession", "major"],
      key: "major",
      render: (major) => major ?? "N/A",
      width: 200,
    },
    role === Roles.TEACHER && {
      title: "Trình độ",
      dataIndex: ["profession", "level"],
      key: "level",
      render: (level) => level ?? "N/A",
      width: 140,
    },
  ].filter(Boolean);

  return (
    <Card style={{ overflowX: "auto" }}>
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Tìm kiếm theo ID, tên hoặc email"
          allowClear
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        pagination={{ pageSize: 6 }}
        scroll={{ x: 1200 }}
      />
    </Card>
  );
};

export default UserList;
