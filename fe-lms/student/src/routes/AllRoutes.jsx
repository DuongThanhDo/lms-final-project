import { configs } from "../configs";
import CourseLayout from "../layouts/CourseLayout";
import NoContainer from "../layouts/NoContainer";
import OnlyHeader from "../layouts/OnlyHeader";
import About from "../pages/About";
import ChangePassword from "../pages/ChangePassword";
import Courses from "../pages/Course";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Register from "../pages/Register";
import Teacher from "../pages/Teacher";
import DetailTeacher from "../pages/Teacher/DetailTeacher";
import ViewCourse from "../pages/Course/ViewCourse";
import Lecture from "../pages/Course/ViewCourse/contents/Lecture";
import CourseDetail from "../pages/Course/CourseDetail";
import Payment from "../pages/Payment";
import MyCourse from "../pages/MyCourse";
import Quiz from "../pages/Course/ViewCourse/contents/Quiz";
import CalendarPage from "../pages/Calendar";
import CourseCompleted from "../pages/Course/CourseCompleted";
import MessagePage from "../pages/Message";
import Certificate from "../pages/Course/Certificate";

export const AllRoutes = [
    { path: configs.routes.home, component: Home, },
    { path: configs.routes.login, component: Login, layout: OnlyHeader },
    { path: configs.routes.register, component: Register, layout: OnlyHeader },
    { path: configs.routes.about, component: About, },
    { path: configs.routes.changePassword, component: ChangePassword, },
    { path: configs.routes.profile, component: Profile, },
    { path: configs.routes.teacher, component: Teacher, },
    { path: configs.routes.courses, component: Courses, },
    { path: configs.routes.myCourse, component: MyCourse, },
    { path: configs.routes.detailTeacher, component: DetailTeacher, },
    { path: configs.routes.detailCourse, component: CourseDetail, },
    { path: configs.routes.paymentrResult, component: Payment, },
    { path: configs.routes.detailMyCourse, component: ViewCourse},
    { path: configs.routes.lectureCourse, component: Lecture, layout: CourseLayout},
    { path: configs.routes.quizCourse, component: Quiz, layout: CourseLayout},
    { path: configs.routes.schedule, component: CalendarPage},
    { path: configs.routes.courseCompleted, component: CourseCompleted},
    { path: configs.routes.message, component: MessagePage},
    { path: configs.routes.certificate, component: Certificate },
];