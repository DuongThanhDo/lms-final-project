import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  createContext,
} from "react";
import { Button, Layout } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../assets/css/CourseLayout.css";
import CourseHeader from "../components/layouts/CourseHeader";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { configs } from "../configs";
import SidebarCourse from "../components/layouts/SidebarCourse";
import { useSelector } from "react-redux";

const { Content, Footer } = Layout;
const SIDEBAR_WIDTH = 320;

const fetchCourseData = async (userId, courseId) => {
  try {
    const courseResponse = await axios.get(
      `${configs.API_BASE_URL}/course-registrations/get-one`,
      {
        params: {
          userId,
          courseId,
        },
      }
    );
    const contentsResponse = await axios.get(
      `${configs.API_BASE_URL}/chapters/student/content?userId=${userId}&courseId=${courseId}`
    );
    return { course: courseResponse.data, contents: contentsResponse.data };
  } catch (error) {
    console.error("Lỗi tải thông tin khóa học:", error);
    return { course: null, contents: [] };
  }
};

export const LearningProgressContext = createContext({
  watchedPercent: 0,
  setWatchedPercent: () => {},
});

const CourseLayout = ({ children }) => {
  const [showSider, setShowSider] = useState(true);
  const [course, setCourse] = useState(null);
  const [contents, setContents] = useState([]);
  const [selectedItem, setSelectedItem] = useState({ type: null, id: null });

  const { courseId } = useParams();

  const user = useSelector((state) => state.auth.userInfo);
  const navigator = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const pathParts = pathname.split("/");
  const itemType = pathParts[3];
  const itemId = pathParts[4];
  const [watchedPercent, setWatchedPercent] = useState(0);

  useEffect(() => {
    console.log("watchedPercent", watchedPercent);
    console.log("--------", canGoNext(watchedPercent, lessonCurrent));
  }, [watchedPercent]);

  useEffect(() => {
    if (!courseId) return;

    const loadData = async () => {
      const { course, contents } = await fetchCourseData(user.id, courseId);
      setCourse(course);
      setContents(contents);
    };

    loadData();
  }, [courseId]);

  useEffect(() => {
    setSelectedItem({ type: itemType, id: itemId });
  }, [itemType, itemId]);

  const handleClickItem = useCallback(
    (item) => {
      const pathMap = {
        lecture: "lecture",
        code: "code",
        quiz: "quiz",
      };

      const path = pathMap[item.type];
      if (path) {
        setSelectedItem({ type: path, id: item.id });
        navigator(`/courses/${courseId}/${path}/${item.id}`);
      }
    },
    [courseId, navigator]
  );

  const getPreviousAndNextItem = (currentItem) => {
    let previousItem = null;
    let nextItem = null;
    let chapterCurrent = null;
    let lessonCurrent = null;

    for (let i = 0; i < contents.length; i++) {
      const chapter = contents[i];
      const items = chapter.items;

      const currentIndex = items.findIndex(
        (item) => item.id == currentItem.id && item.type == currentItem.type
      );

      const itemTaget = items.find(
        (item) => item.id == currentItem.id && item.type == currentItem.type
      );

      lessonCurrent = itemTaget;

      if (currentIndex !== -1) {
        if (currentIndex > 0) {
          previousItem = items[currentIndex - 1];
        } else {
          if (i === 0 && currentIndex === 0) {
            previousItem = null;
          } else {
            if (i > 0) {
              previousItem =
                contents[i - 1].items[contents[i - 1].items.length - 1];
            }
          }
        }

        if (currentIndex < items.length - 1) {
          nextItem = items[currentIndex + 1];
        } else {
          if (i === contents.length - 1 && currentIndex === items.length - 1) {
            nextItem = null;
          } else {
            if (i < contents.length - 1) {
              nextItem = contents[i + 1].items[0];
            }
          }
        }
        chapterCurrent = chapter;
        break;
      }
    }

    return { previousItem, nextItem, chapterCurrent, lessonCurrent };
  };

  const handleToggleLessonStatus = async (item) => {
    try {
      const response = await axios.patch(
        `${configs.API_BASE_URL}/lesson-progresses/${item.lesson_id}`,
        {
          status: !item.status,
        }
      );

      if (response.status === 200) {
        setContents((prevContents) =>
          prevContents.map((chapter) => ({
            ...chapter,
            items: chapter.items.map((i) =>
              i.id === item.id && i.type === item.type
                ? { ...i, status: !i.status }
                : i
            ),
          }))
        );
      }
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái bài học:", error);
    }
  };

  const totalLessons = contents.reduce(
    (sum, chapter) => sum + chapter.items.length,
    0
  );

  const completedLessons = contents.reduce(
    (sum, chapter) =>
      sum + chapter.items.filter((item) => item.status === true).length,
    0
  );

  const progress =
    totalLessons === 0 ? 0 : (completedLessons / totalLessons) * 100;

  const { previousItem, nextItem, chapterCurrent, lessonCurrent } =
    getPreviousAndNextItem(selectedItem);

  const handleNext = (nextItem, lessonCurrent) => {
    if (!lessonCurrent.status) handleToggleLessonStatus(lessonCurrent);
    if (!nextItem) return;
    navigator(`/courses/${courseId}/${nextItem.type}/${nextItem.id}`);
  };

  const canGoNext = (watchedPercent, lessonCurrent) => {
    if (lessonCurrent?.status) return true;
    if (!watchedPercent) return false;
    if (itemType == "lecture") return watchedPercent >= 60;
    if (itemType == "quiz") return watchedPercent === true;
    return true;
  };

  return (
    <LearningProgressContext.Provider
      style={{ minHeight: "100vh", backgroundColor: "white" }}
      value={{ watchedPercent, setWatchedPercent }}
    >
      <Layout>
        <CourseHeader
          course={course}
          navigator={navigator}
          progress={progress}
          totalLessons={totalLessons}
          completedLessons={completedLessons}
        />

        <Layout style={{ paddingTop: 64, paddingBottom: 64 }}>
          <Content
            style={{
              marginRight: showSider ? SIDEBAR_WIDTH : 0,
              transition: "margin-right 0.3s",
            }}
          >
            {children}
          </Content>

          {showSider && (
            <SidebarCourse
              chapter={chapterCurrent}
              contents={contents}
              selectedItem={selectedItem}
              handleClickItem={handleClickItem}
              handleToggleLessonStatus={handleToggleLessonStatus}
            />
          )}
        </Layout>

        <Footer className="custom-footer">
          <div>
            <Button
              style={{ marginRight: 10 }}
              icon={<ArrowLeftOutlined />}
              onClick={() =>
                navigator(
                  `/courses/${courseId}/${previousItem.type}/${previousItem.id}`
                )
              }
              disabled={!previousItem}
            >
              Bài trước
            </Button>

            {progress == 100 || !nextItem ? (
              <Button
                type="primary"
                style={{ backgroundColor: "#1B8381", borderColor: "#1B8381" }}
                onClick={() => {
                  handleNext(nextItem, lessonCurrent);
                  navigator(`/courses/${courseId}/completed`);
                }}
                disabled={!canGoNext(watchedPercent, lessonCurrent)}
              >
                Hoàn thành <ArrowRightOutlined />
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={() => handleNext(nextItem, lessonCurrent)}
                disabled={!canGoNext(watchedPercent, lessonCurrent)}
              >
                Bài tiếp theo <ArrowRightOutlined />
              </Button>
            )}
          </div>

          <Button type="primary" ghost onClick={() => setShowSider(!showSider)}>
            {showSider ? "Ẩn nội dung" : "Hiện nội dung"}
          </Button>
        </Footer>
      </Layout>
    </LearningProgressContext.Provider>
  );
};

export default CourseLayout;
