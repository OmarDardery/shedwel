import React, { useEffect, useRef } from 'react'; // Import useRef and useEffect
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import moment from 'moment';

function Schedule(props) {
  const calendarRef = useRef(null); // Create a ref for the FullCalendar component

  // Sample routine data (replace with your actual data)
  const routineData = [
    { day: 'Sat', startTime: '09:00', endTime: '11:00', title: 'CSE 122' },
    { day: 'Sat', startTime: '11:00', endTime: '13:00', title: 'CSE 123' },
    { day: 'Sun', startTime: '14:00', endTime: '16:00', title: 'PHM 113' },
    { day: 'Mon', startTime: '09:00', endTime: '11:00', title: 'ECE 103' },
    { day: 'Mon', startTime: '11:00', endTime: '13:00', title: 'CSE 122' },
    { day: 'Tue', startTime: '14:00', endTime: '16:00', title: 'ECE 104' },
    { day: 'Wed', startTime: '09:00', endTime: '11:00', title: 'PHM 114' },
    { day: 'Wed', startTime: '14:00', endTime: '16:00', title: 'CSE 123' },
    { day: 'Thu', startTime: '09:00', endTime: '11:00', title: 'PHM 114' },
    { day: 'Thu', startTime: '11:00', endTime: '13:00', title: 'ECE 103' },
    { day: 'Fri', startTime: '14:00', endTime: '16:00', title: 'PHM 113' },
  ];

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

  // Day start and end times (replace with your desired times)
  const dayStart = '06:00:00';
  const dayEnd = '23:00:00';

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.updateSize(); // Force FullCalendar to recalculate its size
    }
  }, [weeklyEvents]); // Update size when events change

  return (
    <div className="Schedule" style={{ width: '80%', margin: 'auto', maxWidth: '800px' }}>
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