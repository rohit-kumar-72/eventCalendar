import { ArrowLeft, ArrowRight } from 'lucide-react'
import React, { useState, useEffect } from 'react'

function Calendar({
    generateMonthCalendar,
    setMonth,
    setYear,
    month,
    year,
    selectedDay,
    setSelectedDay
}) {

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const daysName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const currentMonth = new Date().getMonth();
    const currentDate = new Date().getDate();
    const currentYear = new Date().getFullYear();

    const [monthCalendar, setMonthCalendar] = useState([]);
    const [allTask, setAllTask] = useState({});

    // Load tasks from localStorage on component mount
    useEffect(() => {
        const storedTasks = localStorage.getItem("taskData");
        if (storedTasks) {
            setAllTask(JSON.parse(storedTasks)); // Update allTask state from localStorage
        }
    }, []);

    // Update calendar view when month or year changes
    useEffect(() => {
        const newCalendar = generateMonthCalendar(month, year);
        setMonthCalendar(newCalendar);
    }, [month, year, generateMonthCalendar]);

    const getDateId = (day) =>
        `${day}-${month}-${year}`;

    return (
        <div>
            <div className="flex justify-between items-center bg-blue-400 text-white w-full py-4  text-2xl lg:text-4xl font-semibold rounded-t-2xl px-4">
                <ArrowLeft
                    onClick={() => {
                        if (month === 0) {
                            setMonth(11);
                            setYear(year - 1);
                        } else {
                            setMonth(month - 1);
                        }
                    }}
                    className="cursor-pointer"
                />
                {monthNames[month]} {year}
                <ArrowRight
                    onClick={() => {
                        if (month === 11) {
                            setMonth(0);
                            setYear(year + 1);
                        } else {
                            setMonth(month + 1);
                        }
                    }}
                    className="cursor-pointer"
                />
            </div>
            <div className="flex py-4 bg-gray-200">
                {daysName.map((day, index) => (
                    <p key={index} className={`${index === 0 && "text-red-500"} text-center w-12  lg:w-20 lg:text-2xl font-semibold`}>
                        {day}
                    </p>
                ))}
            </div>
            <div className="border rounded-b-2xl overflow-hidden">
                {monthCalendar &&
                    monthCalendar.map((week, index) => (
                        <div className="flex" key={index}>
                            {week.map((day, index) => {
                                const dayId = getDateId(day);
                                return (
                                    <p
                                        onClick={() => {
                                            if (selectedDay?.day === day && selectedDay?.month === month && selectedDay?.year === year) {
                                                setSelectedDay({});
                                            } else if (day) {
                                                setSelectedDay({ day, month, year });
                                            }
                                        }}
                                        key={index}
                                        className={`py-2 lg:py-4 w-12 lg:w-20 border lg:text-2xl font-semibold text-center transition-all duration-100
                                                    ${index === 0 && "text-red-500"}
                                                    ${!day && 'bg-gray-100'} 
                                                    ${currentDate === day && currentMonth === month && currentYear === year && "border-blue-400 border-2"} 
                                                    ${selectedDay?.day === day && selectedDay?.month === month && selectedDay?.year === year && "bg-blue-400 text-white border-blue-400 transition-all duration-100"}
                                                `}
                                    >
                                        {/* Render dot if there are tasks for that day */}
                                        {allTask[dayId] && allTask[dayId].length > 0 && (
                                            <span className='w-2 h-2 rounded-full bg-blue-400 block mb-2 mx-auto'></span>
                                        )}
                                        {day}
                                    </p>
                                );
                            })}
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default Calendar;
