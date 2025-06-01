import React from "react";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";

const NoContainer = ({ children }) => {
  return (
    <div>
      <Header />
      <div>{children}</div>
      <Footer />
    </div>
  );
};

export default NoContainer;