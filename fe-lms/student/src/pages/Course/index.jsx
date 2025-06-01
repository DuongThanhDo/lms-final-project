import React, { useState, useEffect } from "react";
import { Card, Input, Select, Row, Col, Empty } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import CourseCard from "../../components/CourseCard";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { configs } from "../../configs";

const { Option } = Select;
const { Search } = Input;

const Courses = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  const [courses, setCourses] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [type, setType] = useState(null);
  const [category, setCategory] = useState(categoryId);
  const [categories, setCategories] = useState([]);
  const [sort, setSort] = useState("best");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 12;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${configs.API_BASE_URL}/categories`);
        setCategories(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách danh mục:", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchCourses(1, true);
  }, [searchValue, category, type, sort]);

  const fetchCourses = async (pageNumber = page, reset = false) => {
    try {
      const res = await axios.get(`${configs.API_BASE_URL}/courses/student`, {
        params: {
          searchValue,
          category,
          type,
          sort,
          page: pageNumber,
          limit: pageSize,
        },
      });

      const newCourses = res.data.data || [];

      if (reset) {
        setCourses(newCourses);
      } else {
        setCourses((prev) => [...prev, ...newCourses]);
      }

      if (newCourses.length < pageSize) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Lỗi khi tải khóa học:", err);
    }
  };

  const fetchNext = () => {
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      fetchCourses(nextPage);
      return nextPage;
    });
  };

  return (
    <Row gutter={[40, 0]} className="mt-5">
      <Col span={6}>
        <Card title="Lọc theo" bordered={false}>
          <div className="mb-2 font-semibold">Loại khóa học</div>
          <Select
            placeholder="Chọn loại"
            value={type}
            onChange={(value) => setType(value)}
            allowClear
            className="mb-4"
            style={{ width: "100%" }}
          >
            <Option value="online">Online</Option>
            <Option value="offline">Offline</Option>
          </Select>

          <div className="mb-2 font-semibold">Chủ đề</div>
          <Select
            placeholder="Chọn danh mục"
            value={category}
            onChange={(value) => setCategory(value)}
            allowClear
            className="mb-4"
            style={{ width: "100%" }}
          >
            {categories.map((cate) => (
              <Option key={cate.id} value={String(cate.id)}>
                {cate.name}
              </Option>
            ))}
          </Select>
        </Card>
      </Col>

      <Col span={18}>
        <Row gutter={16} style={{ padding: "0 10px" }}>
          <Col span={18}>
            <Search
              placeholder="Tìm khóa học"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onSearch={() => fetchCourses(1, true)}
              enterButton
              className="mb-4"
            />
          </Col>
          <Col span={6}>
            <Select
              value={sort}
              style={{ width: "100%" }}
              className="mb-4"
              onChange={(value) => setSort(value)}
            >
              <Option value="best">Phù hợp nhất</Option>
              <Option value="newest">Mới nhất</Option>
              <Option value="priceLow">Giá thấp đến cao</Option>
              <Option value="priceHigh">Giá cao đến thấp</Option>
            </Select>
          </Col>
        </Row>

        <InfiniteScroll
          dataLength={courses.length}
          next={fetchNext}
          hasMore={hasMore}
          loader={<p style={{ textAlign: "center" }}>Đang tải khóa học...</p>}
        >
          <div style={{ overflowX: "hidden", padding: "10px" }}>
            {courses.length > 0 ? (
              <Row gutter={[16, 16]}>
                {courses.map((course) => (
                  <Col span={8} key={course.id}>
                    <CourseCard course={course} />
                  </Col>
                ))}
              </Row>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <Empty description="Không tìm khóa học nào" />
              </div>
            )}
          </div>
        </InfiniteScroll>
      </Col>
    </Row>
  );
};

export default Courses;
