import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Input, Select, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ModalCreateCourse from "../../components/ModalCreateCourse";
import CourseList from "../../components/CourseList";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../store/slices/categorySlice";
import { configs } from "../../configs";

const { Option } = Select;

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [category, setCategory] = useState(null);
  const [type, setType] = useState(null);
  const [status, setStatus] = useState(null);

  const user = useSelector((state) => state.auth.userInfo);
  const categories = useSelector((state) => state.categories.list);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        `${configs.API_BASE_URL}/courses/search`,
        {
          params: { teacherId: user.id, searchValue, category, type, status },
        }
      );
      setCourses(response.data);
    } catch (error) {
      console.error("Lỗi khi tải khóa học:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSearch = () => {
    fetchCourses();
    console.log(courses);
  };

  return (
    <Container className="my-4">
      <div className="w-100 d-flex flex-wrap align-items-center gap-2 py-3 bg-white rounded mb-3">
        <Input
          placeholder="Tìm kiếm"
          style={{ flex: 1, minWidth: "200px" }}
          allowClear
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />

        <Select
          placeholder="Danh mục"
          style={{ width: "200px" }}
          value={category}
          onChange={(value) => setCategory(value)}
          allowClear
        >
          {categories.map((category) => (
            <Option key={category.id} value={category.id}>
              {category.name}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Loại"
          style={{ width: "100px" }}
          value={type}
          onChange={(value) => setType(value)}
          allowClear
        >
          <Option value="online">Online</Option>
          <Option value="offline">Offline</Option>
        </Select>

        <Select
          placeholder="Trạng thái"
          style={{ width: "120px" }}
          value={status}
          onChange={(value) => setStatus(value)}
          allowClear
        >
          <Option value="draft">Nháp</Option>
          <Option value="pending">Chờ duyệt</Option>
          <Option value="published">Đã đăng</Option>
          <Option value="hidden">Ẩn</Option>
          <Option value="rejected">Bị từ chối</Option>
        </Select>

        <Button
          type="primary"
          icon={<SearchOutlined />}
          style={{ width: "100px" }}
          onClick={handleSearch}
        >
          Tìm
        </Button>

        <div style={{ width: "150px" }}>
          <ModalCreateCourse />
        </div>
      </div>

      <CourseList courses={courses} fetchCourses={fetchCourses} />
    </Container>
  );
};

export default Courses;
