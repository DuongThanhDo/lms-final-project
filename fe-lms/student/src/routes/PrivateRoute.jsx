import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { configs } from "../configs";

export const protectedRoutes = [
    configs.routes.profile,
    configs.routes.changePassword,
    configs.routes.myCourse,
    configs.routes.detailMyCourse,
    configs.routes.lectureCourse,
    configs.routes.quizCourse,
    configs.routes.schedule,
    configs.routes.message,
    configs.routes.courseCompleted,
    configs.routes.certificate,
  ];

const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
