import React, { useEffect, useState } from "react";
import TeacherCard from "../../components/TeacherCard";
import { assets } from "../../assets";
import { Col, Row } from "react-bootstrap";
import { Empty, Input, message } from "antd";
import axios from "axios";
import { configs } from "../../configs";
import { Roles } from "../../utils/enums";

const { Search } = Input;

const Teacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredTeachers, setFilteredTeachers] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${configs.API_BASE_URL}/users`, {
        params: { role: Roles.TEACHER },
      });
      setTeachers(response.data);
      setFilteredTeachers(response.data);
    } catch (error) {
      console.log(error);
      message.error("Lỗi lấy danh sách giảng viên");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (value) => {
    setSearchKeyword(value);
    const filtered = teachers.filter((teacher) =>
      teacher.profile?.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTeachers(filtered);
  };

  return (
    <div>
      <h1 className="text-center mt-3">Danh sách giảng viên</h1>
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Tìm kiếm theo tên giảng viên"
          allowClear
          value={searchKeyword}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>
      <Row>
        {filteredTeachers.length > 0 ? (
          filteredTeachers.map((teacher) => (
            <Col key={teacher.id} className="mt-4" xs={12} sm={6} md={4} lg={3}>
              <TeacherCard teacher={teacher} />
            </Col>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Empty description="Không tìm thấy giảng viên nào" />
          </div>
        )}
      </Row>
    </div>
  );
};

export default Teacher;
