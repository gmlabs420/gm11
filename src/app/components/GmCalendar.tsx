"use client";
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

export default function GmCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({
    "2024-06-06": ["Event 1", "Event 2", "Event 3"],
    "2024-06-15": ["Event 3"],
    "2024-06-20": ["Event 4"],
  });
  const [showInfo, setShowInfo] = useState(false);
  const [view, setView] = useState("month");
  const [today, setToday] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);

  useEffect(() => {
    setToday(new Date());
    const interval = setInterval(() => {
      setToday(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const changeMonth = (direction) => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + direction)));
  };

  const changeWeek = (direction) => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + direction * 7)));
  };

  const changeDay = (direction) => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + direction)));
  };

  const renderCalendarDays = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const lastDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDay();
    const days = [];
    const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

    for (let i = firstDayIndex; i > 0; i--) {
      days.push(<div key={`prev-${i}`} className="calendar-day calendar-day-previous">{prevMonthDays - i + 1}</div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = date.toISOString().split('T')[0];
      const hasEvents = events[dateString];
      days.push(
        <div
          key={day}
          className={`calendar-day ${hasEvents ? "has-events" : ""}`}
          onClick={() => handleDateClick(dateString)}
          onMouseEnter={() => setHoveredDay(date.getDay())}
          onMouseLeave={() => setHoveredDay(null)}
        >
          {day}
          {hasEvents && <div className="calendar-event-indicator">{hasEvents.length}</div>}
        </div>
      );
    }

    const remainingDays = 42 - (firstDayIndex + daysInMonth); // Ensure 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push(<div key={`next-${i}`} className="calendar-day calendar-day-next">{i}</div>);
    }

    return days;
  };

  const renderWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      const hasEvents = events[dateString];
      days.push(
        <div
          key={i}
          className={`calendar-day ${hasEvents ? "has-events" : ""}`}
          onClick={() => handleDateClick(dateString)}
        >
          {date.getDate()}
          {hasEvents && <div className="calendar-event-indicator">{hasEvents.length}</div>}
        </div>
      );
    }
    return days;
  };

  const renderDayView = () => {
    const dateString = currentDate.toISOString().split('T')[0];
    return (
      <div className="calendar-day-view calendar-popup-content">
        <div className="calendar-day-events">
          {events[dateString]?.map((event, index) => (
            <p key={index}>{event}</p>
          )) || <p>No events for this day</p>}
        </div>
      </div>
    );
  };

  const handleDateClick = (dateString) => {
    if (events[dateString]) {
      setSelectedDate(dateString);
    }
  };

  const closeInfo = () => {
    setShowInfo(false);
  };

  const renderHeaderDate = () => {
    if (view === "month") {
      return `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;
    } else if (view === "week") {
      const weekNumber = Math.ceil((currentDate.getDate() - currentDate.getDay() + 1) / 7);
      return `Week ${weekNumber} | ${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;
    } else if (view === "day") {
      return `${currentDate.toLocaleString('default', { weekday: 'long' })}, ${currentDate.toLocaleDateString()}`;
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const countTodayEvents = () => {
    const todayString = today ? today.toISOString().split('T')[0] : '';
    return events[todayString] ? events[todayString].length : 0;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-top-container">
        <div className="calendar-indicator-box">
          <span
            className="calendar-today-events-indicator"
            onClick={() => handleDateClick(today.toISOString().split('T')[0])}
          >
            {countTodayEvents()}
          </span>
        </div>
        <div className="calendar-header-box">
          <h1>EVENT</h1>
        </div>
        <div className="calendar-info-icon-box">
          <div className="calendar-info-icon" onClick={() => setShowInfo(true)}>
            <FontAwesomeIcon icon={faInfoCircle} />
          </div>
        </div>
      </div>
      <button className="calendar-today-button" onClick={goToToday}>
        Today {today ? today.toLocaleDateString() : ""} | {today ? today.toLocaleTimeString() : ""}
      </button>
      <div className="calendar-view-navigation">
        <button className="calendar-nav-button" onClick={() => {
          if (view === "month") changeMonth(-1);
          else if (view === "week") changeWeek(-1);
          else if (view === "day") changeDay(-1);
        }}>Prev</button>
        <div className="calendar-view-buttons">
          <button className={view === "day" ? "active" : ""} onClick={() => setView("day")}>Day</button>
          <button className={view === "week" ? "active" : ""} onClick={() => setView("week")}>Week</button>
          <button className={view === "month" ? "active" : ""} onClick={() => setView("month")}>Month</button>
        </div>
        <button className="calendar-nav-button" onClick={() => {
          if (view === "month") changeMonth(1);
          else if (view === "week") changeWeek(1);
          else if (view === "day") changeDay(1);
        }}>Next</button>
      </div>
      <h2>{renderHeaderDate()}</h2>
      <div className="calendar-content">
        {view === "month" && (
          <div className="calendar-days">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
              <div key={day} className={`calendar-day-header ${hoveredDay === index ? "hovered" : ""}`}>{day}</div>
            ))}
            {renderCalendarDays()}
          </div>
        )}
        {view === "week" && (
          <div className="calendar-week">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="calendar-day-header">{day}</div>
            ))}
            {renderWeekDays()}
          </div>
        )}
        {view === "day" && renderDayView()}
      </div>
      {selectedDate && (
        <div className="calendar-popup show">
          <div className="calendar-popup-content">
            <FontAwesomeIcon icon={faCircleXmark} className="calendar-popup-close" onClick={() => setSelectedDate(null)} />
            <h2>Events for {new Date(selectedDate).toDateString()}</h2>
            {events[selectedDate]?.map((event, index) => (
              <p key={index}>{event}</p>
            )) || <p>There are currently no events for this date.</p>}
          </div>
        </div>
      )}
      {showInfo && (
        <div className="calendar-info-screen show">
          <div className="calendar-info-content">
            <FontAwesomeIcon icon={faCircleXmark} className="calendar-info-close" onClick={closeInfo} />
            <h2>Information</h2>
            <p>This is the information screen for the calendar module.</p>
          </div>
        </div>
      )}
    </div>
  );
}
