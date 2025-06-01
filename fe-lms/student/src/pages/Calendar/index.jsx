import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { Card, Button, Modal, Form, Input, DatePicker, Select, message } from "antd";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { vi } from "date-fns/locale";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { configs } from "../../configs";
import { useSelector } from "react-redux";

const { Option } = Select;

const locales = { vi: vi };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: vi }),
  getDay,
  locales,
});

const CalendarPage = () => {
  const user = useSelector((state) => state.auth.userInfo);
  const [events, setEvents] = useState([]);
  const [myCourse, setMyCourse] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState(null);
  const [couse, setCourse] = useState(null); 
  const [end, setEnd] = useState(null);
  const [openSlot, setOpenSlot] = useState(false);
  const [openEvent, setOpenEvent] = useState(false);
  const [clickedEvent, setClickedEvent] = useState({});
  const [currentView, setCurrentView] = useState(localStorage.getItem('currentView') || 'week');
  const [currentDate, setCurrentDate] = useState(localStorage.getItem('currentDate') ? new Date(localStorage.getItem('currentDate')) : new Date());

  useEffect(() => {
    fetchMyCourse();
  }, []);

  useEffect(() => {
    localStorage.setItem('currentView', currentView);
    localStorage.setItem('currentDate', currentDate);
    fetchUserSchedules(user.id);
  }, [currentView, currentDate]);

  const fetchUserSchedules = async (userId) => {
    try {
      const response = await axios.get(`${configs.API_BASE_URL}/course-schedules/user/${userId}`);
      const mappedEvents = response.data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        start: new Date(item.start_time),
        end: new Date(item.end_time),
        course_id: item.course?.id || null,
        room_id: item.room?.id || null,
      }));
      setEvents(mappedEvents);
    } catch (error) {
      console.error("Error fetching events:", error.response?.data || error.message);
    }
  };

  const fetchMyCourse = async () => {
    try {
      const response = await axios.get(`${configs.API_BASE_URL}/course-registrations/student/${user.id}`);
      setMyCourse(response.data);
    } catch (error) {
      console.error("Error fetching events:", error.response?.data || error.message);
    } 
  };

  const handleClose = () => {
    setOpenEvent(false);
    setOpenSlot(false);
    setTitle("");
    setDescription("");
    setStart(null);
    setCourse(null);
    setEnd(null);
  };

  const handleSlotSelected = (slotInfo) => {
    setTitle("");
    setDescription("");
    setStart(new Date(slotInfo.start));
    setEnd(new Date(slotInfo.end));
    setCourse(null);
    setOpenSlot(true);
  };

  const handleEventSelected = (event) => {
    console.log('event: ',event);
    
    setOpenEvent(true);
    setClickedEvent(event);
    setStart(new Date(event.start));
    setEnd(new Date(event.end));
    setTitle(event.title);
    setCourse(event.course_id);
    setDescription(event.description);
  };

  const handleStartTime = (time) => {
    setStart(time?.toDate());
  };

  const handleEndTime = (time) => {
    setEnd(time?.toDate());
  };

  const setNewAppointment = async () => {
    if (!title || !start || !end || isNaN(new Date(start)) || isNaN(new Date(end))) {
      console.error("Invalid data");
      message.error('thiếu dữ liệu yêu cầu')
      return;
    }

    const startISO = new Date(start).toISOString();
    const endISO = new Date(end).toISOString();

    const appointment = {
      title,
      description,
      start_time: startISO,
      end_time: endISO,
      user_id: user.id,
      course_id: couse,
    };

    try {
      const response = await axios.post(`${configs.API_BASE_URL}/course-schedules`, appointment);
      setEvents([...events, response.data]);
      fetchUserSchedules(user.id);
      handleClose();
    } catch (error) {
      console.error("Error creating appointment:", error.response?.data || error.message);
    } finally {
      message.success('Tạo mới lịch thành công!')
    }
  };

  const updateEvent = async () => {
    const updatedEvent = [...events];
    const index = events.findIndex((event) => event.id === clickedEvent.id);
    console.log('events: ', events);
    console.log('clickedEvent: ', clickedEvent);
    console.log('index: ', index);
    if (index !== -1) {
      updatedEvent[index] = {
        title,
        description,
        start: new Date(start),
        end: new Date(end),
        course_id: couse,
      };

      const startISO = new Date(start).toISOString();
      const endISO = new Date(end).toISOString();

      const updatedAppointment = {
        title,
        description,
        start_time: startISO,
        end_time: endISO,
        course_id: couse,
      };

      console.log('appointment: ', updatedAppointment);

      try {
        const response = await axios.put(`${configs.API_BASE_URL}/course-schedules/${clickedEvent.id}`, updatedAppointment);
        setEvents(updatedEvent);
        fetchUserSchedules(user.id);
        handleClose();
      } catch (error) {
        console.error("Error updating event:", error.response?.data || error.message);
      } finally {
        message.success('Chỉnh sửa lịch thành công!')
      }
    }
  };

  const deleteEvent = async () => {
    try {
      await axios.delete(`${configs.API_BASE_URL}/course-schedules/${clickedEvent.id}`);
      const updatedEvents = events.filter((event) => event !== clickedEvent);
      setEvents(updatedEvents);
      handleClose();
    } catch (error) {
      console.error("Error deleting event:", error.response?.data || error.message);
    } finally {
      message.success('Xóa lịch thành công!')
    }
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleNavigate = (date) => {
    setCurrentDate(date);
  };

  const eventActions = [
    <Button key="cancel" onClick={handleClose}>Hủy</Button>,
    <Button key="delete" danger onClick={deleteEvent}>Xóa</Button>,
    <Button key="confirm" type="primary" onClick={updateEvent}>Xác nhận</Button>,
  ];

  const appointmentActions = [
    <Button key="cancel" onClick={handleClose}>Hủy</Button>,
    <Button key="submit" type="primary" onClick={setNewAppointment}>Xác nhận</Button>,
  ];

  return (
    <div>
      <h3 style={{ marginTop: 12 }}>Lịch học</h3>
      <Calendar
        selectable
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        view={currentView}
        date={currentDate}
        views={["month", "week", "day", "agenda"]}
        onSelectSlot={handleSlotSelected}
        onSelectEvent={handleEventSelected}
        onView={handleViewChange}
        onNavigate={handleNavigate}
        messages={{
          next: "Tiếp",
          previous: "Trước",
          today: "Hôm nay",
          month: "Tháng",
          week: "Tuần",
          day: "Ngày",
          agenda: "Lịch trình",
          date: "Ngày",
          time: "Thời gian",
          event: "Sự kiện"
        }}
      />

      <Modal
        title={openEvent ? "Chỉnh sửa sự kiện" : "Tạo sự kiện mới"}
        open={openSlot || openEvent}
        onCancel={handleClose}
        footer={openEvent ? eventActions : appointmentActions}
      >
        <Form layout="vertical">
          <Form.Item label="Tên sự kiện">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </Form.Item>

          <Form.Item label="Khóa học">
            <Select
              value={couse}
              onChange={(value) => setCourse(value)}
              placeholder="Chọn khóa học"
            >
              {myCourse.map((course) => (
                <Option key={course.course?.id} value={course.course?.id}>
                  {course.course?.name || course.course?.title || `Course #${course.course?.id}`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Mô tả">
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </Form.Item>

          <Form.Item label="Bắt đầu">
            <DatePicker
              showTime
              style={{ width: "100%" }}
              value={start ? dayjs(start) : null}
              onChange={handleStartTime}
            />
          </Form.Item>

          <Form.Item label="Kết thúc">
            <DatePicker
              showTime
              style={{ width: "100%" }}
              value={end ? dayjs(end) : null}
              onChange={handleEndTime}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CalendarPage;
