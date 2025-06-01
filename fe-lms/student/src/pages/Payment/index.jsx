import React from "react";
import { useLocation } from "react-router-dom";
import ReturnPayment from "./ReturnPayment";

const Payment = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");
  const courseId = queryParams.get("courseId");
  return <ReturnPayment status={status} courseId={courseId}/>;
};

export default Payment;
