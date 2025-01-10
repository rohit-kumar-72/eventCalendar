import Calendar from '@/components/Home/Calendar'
import TaskList from '@/components/Home/TaskList'
import React, { useState } from 'react'

function Home() {

    // 0->january
    const [month, setMonth] = useState(new Date().getMonth())
    const [year, setYear] = useState(new Date().getFullYear())
    const [selectedDay, setSelectedDay] = useState(null);

    function generateCalendar(month, year) {

        //0->sunday saturday->6
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        // console.log(month, year, firstDay)
        let calendar = [];
        let week = Array(firstDay).fill('');

        for (let day = 1; day <= daysInMonth; day++) {
            week.push(day);
            if (week.length === 7 || day === daysInMonth) {
                calendar.push(week);
                week = [];
            }
        }

        return calendar;
    }

    // console.log(generateCalendar(currentMonth, currentYear));

    return (
        <div className='mx-auto w-11/12 flex justify-center items-center py-10 min-h-screen'>
            <div className='flex gap-10 flex-col md:flex-row items-center'>
                <Calendar
                    generateMonthCalendar={generateCalendar}
                    setMonth={setMonth}
                    setYear={setYear}
                    month={month}
                    year={year}
                    selectedDay={selectedDay}
                    setSelectedDay={setSelectedDay}
                />
                <TaskList
                    selectedDay={selectedDay}
                    month={month}
                    year={year}
                />
            </div>
        </div>
    )
}

export default Home