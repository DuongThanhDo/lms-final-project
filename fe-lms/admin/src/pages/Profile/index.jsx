import React from "react";
import { Tabs } from "antd";
import PersonalInfoForm from "./PersonalInfoForm";
import AvatarUpload from "./AvatarUpload";
import ProfessionInfoForm from "./ProfessionInfoForm";

const { TabPane } = Tabs;

const Profile = () => {
  return (
    <div className="container mt-4">
      <h2>Trang cá nhân</h2>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Thông tin cá nhân" key="1">
          <PersonalInfoForm />
        </TabPane>
        <TabPane tab="Ảnh đại diện" key="2">
          <AvatarUpload />
        </TabPane>
        <TabPane tab="Thông tin chuyên ngành" key="3">
          <ProfessionInfoForm />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Profile;