import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { configs } from "../configs";

export const protectedRoutes = [
  configs.routes.dashboard,
  configs.routes.changePassword,
  configs.routes.profile,
  configs.routes.courses,
  configs.routes.users,
  configs.routes.center,
  configs.routes.updateFormBuilt,
  configs.routes.addFormBuilt,
  configs.routes.viewCourse,
  configs.routes.lectureCourse,
  configs.routes.quizCourse,
];


const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
