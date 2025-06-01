import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { configs } from "../configs";

export const protectedRoutes = [
    configs.routes.dashboard,
    configs.routes.changePassword,
    configs.routes.profile,
    configs.routes.courses,
    configs.routes.editCourse,
    configs.routes.viewCourse,
    configs.routes.lectureCourse,
    configs.routes.quizCourse,
    configs.routes.messages,
    configs.routes.students,
  ];

const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
