import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { configsCert } from "../../../assets/js/configsCert";
import { configs } from "../../../configs";
import DOMPurify from "dompurify";
import html2canvas from "html2canvas";
import bgChungChi from "../../../assets/images/bg_chungchi.jpg";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const Certificate = () => {
  const { courseId, studentId } = useParams();
  const [course, setCourse] = useState(null);
  const [student, setStudent] = useState(null);
  const [finalBuilt, setFinalBuilt] = useState("");
  const divRef = useRef(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [resCourse, resStudent] = await Promise.all([
        axios.get(`${configs.API_BASE_URL}/courses/${courseId}`),
        axios.get(`${configs.API_BASE_URL}/user-profiles/${studentId}`),
      ]);
      setCourse(resCourse.data);
      setStudent(resStudent.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const injectCertificateScript = (formBuilt) => {
    if (!formBuilt || !course?.name || !student?.name) return "";

    let html = formBuilt.html;
    html = html.replace("Tên học viên", student.name);
    html = html.replace("Tên khóa học", course.name);
    html = html.replace("Tên khóa học", course.name);
    html = html.replace(`<body id="ig2u">`, "");

    return html.replace("</body>", `<style>${formBuilt.css}</style>`);
  };

  const handleCreateCertificate = async (studentId, courseId, finalBuilt) => {
    try {
      const response = await axios.post(
        `${configs.API_BASE_URL}/student-cert`,
        {
          studentId: Number(studentId),
          courseId: Number(courseId),
          formBuilt: { htmlBuilt: finalBuilt },
        }
      );
    } catch (error) {
      console.error("Error creating certificate:", error);
    }
  };

  useEffect(() => {
    if (courseId && studentId) {
      fetchData();
    }
  }, [courseId, studentId]);

  useEffect(() => {
    if (course?.certificate?.formBuilt && student?.name && course?.name) {
      const injected = injectCertificateScript(course.certificate.formBuilt);
      setFinalBuilt(injected);
    }
  }, [course, student]);

  useEffect(() => {
    if (finalBuilt && studentId && courseId) {
      handleCreateCertificate(studentId, courseId, finalBuilt);
    }
  }, [finalBuilt, studentId, courseId]);

  const HtmlView = ({ rawHtml }) => {
    const safeHtml = DOMPurify.sanitize(rawHtml, { ADD_TAGS: ["script"] });

    return <div dangerouslySetInnerHTML={{ __html: safeHtml }} />;
  };

  const handleCapture = () => {
    if (!divRef.current) return;

    html2canvas(divRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = imgData;
      link.download = "certificate.png";
      link.click();
    });
  };

  return (
    <div>
      {finalBuilt ? (
        <div>
          <div className="d-flex align-items-center mb-3 mt-4">
            <Button
              type="link"
              style={{ color: "#999" }}
              icon={<ArrowLeftOutlined />}
              onClick={() => {
                navigate(-1);
              }}
              className="p-0 me-3"
            >
              Quay lại
            </Button>
            <h2 className="mb-0 fw-semibold" style={{ fontSize: '2.5rem' }}>Nhận chứng chỉ</h2>
          </div>

          <p style={{ maxWidth: 800,
              marginBottom: 32, }}>
            Trung tâm chúng tôi ghi nhận sự nỗ lực của bạn! Bằng cách nhận chứng
            chỉ này, bạn chính thức hoàn thành khóa học{" "}
            <strong>{course?.name}</strong>.
          </p>
          <div
            style={{
              width: 600,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div ref={divRef} style={{ width: "100%" }}>
              <HtmlView rawHtml={finalBuilt} />
            </div>
            <Button
              type="primary"
              onClick={handleCapture}
              style={{ backgroundColor: "#1B8381", borderColor: "#1B8381" }}
            >
              Tải về
            </Button>
          </div>
        </div>
      ) : (
        <p>Đang tạo chứng chỉ...</p>
      )}
    </div>
  );
};

export default Certificate;
