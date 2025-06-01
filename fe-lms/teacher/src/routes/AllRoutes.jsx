import { configs } from "../configs";
import CourseLayout from "../layouts/CourseLayout";
import ChangePassword from "../pages/ChangePassword";
import Courses from "../pages/Courses";
import Dashboard from "../pages/Dashboard";
import EditCourse from "../pages/EditCourse";
import Lecture from "../pages/Lecture";
import Login from "../pages/Login";
import MessagePage from "../pages/Message";
import Profile from "../pages/Profile";
import Quiz from "../pages/Quiz";
import Students from "../pages/Student";
import ViewCourse from "../pages/ViewCourse";

export const AllRoutes = [
    { path: configs.routes.dashboard, component: Dashboard, },
    { path: configs.routes.login, component: Login, layout: null },
    { path: configs.routes.changePassword, component: ChangePassword, },
    { path: configs.routes.profile, component: Profile, },
    { path: configs.routes.courses, component: Courses, },
    { path: configs.routes.editCourse, component: EditCourse, },
    { path: configs.routes.viewCourse, component: ViewCourse, layout: null},
    { path: configs.routes.lectureCourse, component: Lecture, layout: CourseLayout},
    { path: configs.routes.quizCourse, component: Quiz, layout: CourseLayout},
    { path: configs.routes.messages, component: MessagePage, },
    { path: configs.routes.students, component: Students, },
];