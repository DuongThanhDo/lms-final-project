import React, { useState, useEffect } from "react";
import grapesjs from "grapesjs";
import grapesjsPresetWebpage from "grapesjs-preset-webpage";
import grapesjsBlocksBasic from "grapesjs-blocks-basic";
import "grapesjs/dist/css/grapes.min.css";
import { Button, Input, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { configs } from "../../configs";

const FormsBuilder = () => {
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [editor, setEditor] = useState(null);
  const [inputName, setInputName] = useState("Tên chứng chỉ");

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const initializeEditor = () => {
      const editorInstance = grapesjs.init({
        container: "#gjs",
        plugins: [grapesjsBlocksBasic, grapesjsPresetWebpage],
      });

      editorInstance.BlockManager.add("input-text-1", {
        label: "Tên học viên",
        category: "Forms",
        attributes: {
          class: "fa fa-square",
          title: "Tên học viên",
        },
        content: "<span>Tên học viên</span>",
      });

      editorInstance.BlockManager.add("course-name", {
        label: "Tên khóa học",
        category: "Forms",
        attributes: {
          class: "fa fa-square",
          title: "Tên khóa học",
        },
        content: "<span>Tên khóa học</span>",
      });

      editorInstance.on("component:update", () => {
        setHtml(editorInstance.getHtml());
        setCss(editorInstance.getCss());
      });

      console.log("editorInstance", editorInstance);

      setEditor(editorInstance);
    };

    initializeEditor();

    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, []);

  const generateContentForm = async () => {
    try {
      const response = await axios.get(
        `${configs.API_BASE_URL}/certificates/${id}`
      );

      console.log(response.data?.formBuilt.html);
      console.log(response.data?.formBuilt.css);

      editor.setComponents(response.data?.formBuilt.html);
      editor.setStyle(response.data?.formBuilt.css);

      setInputName(response.data?.name);
      setHtml(response.data?.formBuilt.html);
      setCss(response.data?.formBuilt.css);
    } catch (error) {
      console.error("Failed to read file:", error);
    }
  };

  useEffect(() => {
    if (editor) {
      generateContentForm();
    }
  }, [editor]);

  const resetForm = () => {
    setCss("");
    setHtml("");
    editor.setComponents("");
    editor.setStyle("");
    setInputName("Tên chứng chỉ");
  };

  const handleSave = async () => {
    try {
      if (!id) {
        await axios.post(`${configs.API_BASE_URL}/certificates`, {
          name: inputName,
          formBuilt: { html, css },
        });
      } else {
        await axios.patch(`${configs.API_BASE_URL}/certificates/${id}`, {
          name: inputName,
          formBuilt: { html, css },
        });
      }
    } catch (error) {
    } finally {
      resetForm();
      navigate("/center");
    }
  };

  return (
    <div>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          padding: "10px 40px",
          justifyContent: "space-between",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Input
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          placeholder="Nhập tên chứng chỉ"
          style={{ width: 300, marginRight: 10 }}
        />
        <Button
          type="primary"
          onClick={handleSave}
          style={{ backgroundColor: "#1B8381", borderColor: "#1B8381" }}
        >
          Lưu chứng chỉ
        </Button>
      </div>
      <div id="gjs"></div>
    </div>
  );
};

export default FormsBuilder;
