import React from "react";
import { Card, Button } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import { assets } from "../assets";
import { Link } from "react-router-dom";
import { configs } from "../configs";

const TeacherCard = ({ teacher }) => {
  return (
    <Card className="shadow-sm rounded-3 border-0" style={{ width: 300 }}>
      <img
        src={teacher.profile?.avatar?.file_url || assets.images.noAvatar}
        alt={teacher.profile?.name}
        className="w-100 rounded-top"
        style={{ height: 200, objectFit: "contain" }}
      />
      <div className="p-1 mt-2">
        <h5 className="fw-bold">{teacher.profile?.name || "Giáo viên"}</h5>
        <p className="mb-1">
          <strong>Chuyên Ngành:</strong> {teacher.profession?.major}
        </p>
        <p className="mb-3">
          <strong>Trình độ:</strong> {teacher.profession?.degree}
        </p>
        <Link to={`${configs.routes.teacher}/${teacher.id}`}>
          <Button type="primary" block>
            Xem chi tiết
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default TeacherCard;
