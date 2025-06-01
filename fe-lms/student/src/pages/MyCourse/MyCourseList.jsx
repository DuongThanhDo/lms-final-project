// MyCourseList.jsx
import { Spin, Empty, Row, Col } from "antd";
import MyCourseItem from "./MyCourseItem";

const MyCourseList = ({ data, loading }) => {
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <Spin tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <Empty description="Không có khóa học nào" />
      </div>
    );
  }

  console.log(data);

  return (
    <Row gutter={[16, 16]}>
      {data.map((item) => (
        <Col
          key={item.id}
          xs={24} sm={12} md={8} lg={6} xl={6}
        >
          <MyCourseItem course={item} />
        </Col>
      ))}
    </Row>
  );
};

export default MyCourseList;
