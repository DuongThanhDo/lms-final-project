import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

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