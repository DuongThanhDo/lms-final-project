import React, { useEffect, useState } from "react";
import { Typography, Collapse } from "antd";
import {
  PlayCircleOutlined,
  CodeOutlined,
  QuestionCircleOutlined,
  CheckCircleFilled,
  LockOutlined,
} from "@ant-design/icons";
import "../../assets/css/CourseLayout.css";
import { formatDuration } from "../../utils/functions/time";

const { Panel } = Collapse;

const SidebarCourse = ({
  chapter,
  contents,
  selectedItem,
  handleClickItem,
  durations,
  handleToggleLessonStatus,
}) => {
  const [activeKeys, setActiveKeys] = useState([]);

  useEffect(() => {
    if (chapter?.id && !activeKeys.includes(chapter.id)) {
      setActiveKeys((prevKeys) => [...prevKeys, chapter.id]);
    }
  }, [chapter]);

  const renderIconAndDuration = (item) => {
    const style = { fontSize: 12, color: "#888" };

    if (item.type === "lecture" && item.video?.file_url) {
      const durationText = formatDuration(item.duration);
      return (
        <p style={style}>
          <PlayCircleOutlined style={{ marginRight: 8 }} />
          {durationText}
        </p>
      );
    }

    if (item.type === "code") {
      return (
        <p style={style}>
          <CodeOutlined style={{ marginRight: 8 }} />
          Code
        </p>
      );
    }

    if (item.type === "quiz") {
      return (
        <p style={style}>
          <QuestionCircleOutlined style={{ marginRight: 8 }} />
          Quiz
        </p>
      );
    }

    return null;
  };

  const handleCollapseChange = (keys) => {
    setActiveKeys(keys);
  };

  const isLessonLocked = (chapter, chapterIndex, itemIndex) => {
    const previousItems = contents
      .slice(0, chapterIndex + 1)
      .flatMap((c, idx) => {
        if (idx === chapterIndex) {
          return c.items.slice(0, itemIndex);
        }
        return c.items;
      });

    return previousItems.some((item) => !item.status);
  };

  if (!contents || contents.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 64,
        right: 0,
        width: 320,
        height: "calc(100vh - 110px)",
        background: "#fff",
        padding: 16,
        overflowY: "auto",
        borderLeft: "1px solid #f0f0f0",
        zIndex: 1000,
      }}
    >
      <Typography.Title level={5}>Nội dung khóa học</Typography.Title>
      <Collapse
        expandIconPosition="end"
        style={{ width: "100%" }}
        defaultActiveKey={[chapter?.id]}
        activeKey={activeKeys}
        onChange={handleCollapseChange}
      >
        {contents.map((_chapter, indexC) => (
          <Panel
            className="custom-panel-header"
            header={
              <div>
                <div style={{ fontWeight: "bold" }}>
                  {indexC + 1}. {_chapter.title}
                </div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                  {_chapter.items.filter((i) => i.status === true).length}/
                  {_chapter.items.length} | {formatDuration(_chapter.duration)}
                </div>
              </div>
            }
            key={_chapter.id}
          >
            <div className="custom-panel-content">
              <ul>
                {_chapter.items.map((item, indexI) => {
                  const locked = isLessonLocked(_chapter, indexC, indexI);
                  return (
                    <li
                      onClick={() => {
                        if (!locked) handleClickItem(item);
                      }}
                      key={item.id}
                      className={
                        selectedItem.type == item.type &&
                        selectedItem.id == item.id
                          ? "selected-item"
                          : ""
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        opacity: locked ? 0.5 : 1,
                        cursor: locked ? "not-allowed" : "pointer",
                      }}
                    >
                      <div>
                        <p>
                          {indexI + 1}. {item.title}
                        </p>
                        {renderIconAndDuration(item)}
                      </div>
                      <div
                        // onClick={(e) => {
                        //   e.stopPropagation();
                        //   if (!locked && !item.status) {
                        //     handleToggleLessonStatus(item);
                        //   }
                        // }}
                      >
                        {item.status ? (
                          <CheckCircleFilled
                            style={{ color: "#52c41a", fontSize: 18 }}
                          />
                        ) : locked ? (
                          <LockOutlined
                            style={{ color: "#aaa", fontSize: 18 }}
                          />
                        ) : (
                          <CheckCircleFilled
                            style={{ color: "#aaa", fontSize: 18 }}
                          />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default SidebarCourse;
