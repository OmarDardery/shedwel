import React, { useState, useEffect, useRef } from 'react'; // Import useRef and useEffect
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import moment from 'moment';

function Schedule(props) {
  const calendarRef = useRef(null); // Create a ref for the FullCalendar component
  const [routineData, setRoutineData] = useState([]); // ✅ State for routine data

  // ✅ Update routineData when props.routineData changes
  useEffect(() => {
    if (props.routineData) {
      setRoutineData(props.routineData.events);
    }
  }, [props.routineData.events]); // Runs when props.routineData updates
  // Sample routine data (replace with your actual data)
  
  const getEventsForWeek = (weekStart) => {
    const events = [];
    routineData.forEach((routine) => {
      const dayIndex = moment().day(routine.day).weekday();
      const eventStart = moment(weekStart)
        .add(dayIndex, 'days')
        .set({
          hour: parseInt(routine.startTime.split(':')[0]),
          minute: parseInt(routine.startTime.split(':')[1]),
        });
      const eventEnd = moment(weekStart)
        .add(dayIndex, 'days')
        .set({
          hour: parseInt(routine.endTime.split(':')[0]),
          minute: parseInt(routine.endTime.split(':')[1]),
        });
      events.push({
        title: routine.title,
        start: eventStart.toDate(),
        end: eventEnd.toDate(),
      });
    });
    return events;
  };

  const currentWeekStart = moment().startOf('week');
  const weeklyEvents = getEventsForWeek(currentWeekStart);
  
  const dayStart = props.routineData.dayStart;
  const dayEnd = props.routineData.dayEnd;

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.updateSize(); // Force FullCalendar to recalculate its size
    }
  }, [weeklyEvents]); // Update size when events change

  return (
    <div className="Schedule" style={{ width: '80%', margin: 'auto', minWidth: 'fit-content', maxWidth: '800px' }}>
      <FullCalendar
        ref={calendarRef} // Add the ref
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="timeGridWeek"
        events={weeklyEvents}
        allDaySlot={false}
        slotMinTime={dayStart}
        slotMaxTime={dayEnd}
        headerToolbar={false}
        dayHeaderFormat={{ weekday: 'short' }} // Format day headers to show only the day name
      />
    </div>
  );
}

export default Schedule;