import { Tabs } from "antd";
import { useState } from "react";
import UserList from "./UserList";
import { Roles } from "../../utils/enums";
import AddNewUserForm from "./AddNewUserForm";

const { TabPane } = Tabs;

const User = () => {
  const [activeTab, setActiveTab] = useState("1");

  return (
    <div className="container mt-4">
      <h3>Quản lý người dùng</h3>
      <Tabs defaultActiveKey="1" onChange={(key) => setActiveTab(key)}>
        <TabPane tab="Tài khoản giảng viên" key="1">
          <UserList role={Roles.TEACHER} refreshKey={activeTab} />
        </TabPane>
        <TabPane tab="Tài khoản học viên" key="2">
          <UserList role={Roles.STUDENT} refreshKey={activeTab} />
        </TabPane>
        <TabPane tab="Cấp tài khoản" key="3">
          <AddNewUserForm />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default User;
