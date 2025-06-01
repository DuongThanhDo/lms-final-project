import { Tabs } from "antd";
import { useState } from "react";
import CenterInfoForm from "./CenterInfoForm";
import CertificateList from "./CertificateList";
import CategoryList from "./CategoryList";

const { TabPane } = Tabs;

const Center = () => {
  const [activeTab, setActiveTab] = useState("1");

  return (
    <div className="container mt-4">
      <h3>Quản lý trung tâm</h3>
      <Tabs defaultActiveKey="1" onChange={(key) => setActiveTab(key)}>
        <TabPane tab="Chứng chỉ" key="1">
          <CertificateList />
        </TabPane>
        <TabPane tab="Thông tin trung tâm" key="2">
          <CenterInfoForm />
        </TabPane>
        <TabPane tab="Danh mục" key="3">
          <CategoryList />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Center
