import { configs } from "../configs";
import CourseLayout from "../layouts/CourseLayout";
import Center from "../pages/Center";
import ChangePassword from "../pages/ChangePassword";
import Courses from "../pages/Courses";
import Dashboard from "../pages/Dashboard";
import FormsBuilder from "../pages/FormBuilt";
import Lecture from "../pages/Lecture";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Quiz from "../pages/Quiz";
import User from "../pages/User";
import ViewCourse from "../pages/ViewCourse";

export const AllRoutes = [
    { path: configs.routes.dashboard, component: Dashboard, },
    { path: configs.routes.login, component: Login, layout: null },
    { path: configs.routes.changePassword, component: ChangePassword, },
    { path: configs.routes.profile, component: Profile, },
    { path: configs.routes.courses, component: Courses, },
    { path: configs.routes.users, component: User, },
    { path: configs.routes.center, component: Center, },
    { path: configs.routes.updateFormBuilt, component: FormsBuilder, },
    { path: configs.routes.addFormBuilt, component: FormsBuilder, },
    { path: configs.routes.viewCourse, component: ViewCourse, layout: null},
    { path: configs.routes.lectureCourse, component: Lecture, layout: CourseLayout},
    { path: configs.routes.quizCourse, component: Quiz, layout: CourseLayout},
];