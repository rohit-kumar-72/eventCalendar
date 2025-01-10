import React, { useEffect, useState } from 'react'
import { BellRing, Check, Plus, Trash } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

function TaskList({ selectedDay, month, year }) {
    const [allTask, setAllTask] = useState({});
    const [taskInput, setTaskInput] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [description, setDescription] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    // Load tasks from local storage on component mount
    useEffect(() => {
        localStorage.getItem("taskData") &&
            setAllTask(JSON.parse(localStorage.getItem("taskData")));
    }, []);

    // Save tasks to local storage whenever allTask changes
    useEffect(() => {
        if (Object.keys(allTask).length > 0) {
            localStorage.setItem("taskData", JSON.stringify(allTask));
        }
    }, [allTask]);

    // Generate unique ID based on selected date
    const getDateId = () =>
        `${selectedDay?.day}-${selectedDay?.month}-${selectedDay?.year}`;

    function addOrEditTask() {
        if (!taskInput.trim() || !selectedDay?.day || !startTime || !endTime) return; // Validate input & date

        const id = getDateId();
        const taskData = { taskInput, startTime, endTime, description };

        // Check for time conflict
        if (hasTimeConflict(id, startTime, endTime, isEditing ? editIndex : null)) {
            alert("A task already exists in the selected time range. Please choose a different time.");
            return;
        }

        if (isEditing) {
            setAllTask((prev) => {
                const updatedTasks = { ...prev };
                updatedTasks[id][editIndex] = taskData; // Edit task at the given index
                localStorage.setItem("taskData", JSON.stringify(updatedTasks));
                return updatedTasks;
            });
            setIsEditing(false);
            setEditIndex(null);
        } else {
            setAllTask((prev) => {
                const updatedTasks = { ...prev };
                updatedTasks[id] = updatedTasks[id] ? [...updatedTasks[id], taskData] : [taskData];
                localStorage.setItem("taskData", JSON.stringify(updatedTasks));
                return updatedTasks;
            });
        }

        // Clear input fields after adding/editing task
        setTaskInput("");
        setStartTime("");
        setEndTime("");
        setDescription("");
    }

    // Function to check if a new task conflicts with existing tasks
    function hasTimeConflict(dayId, newStart, newEnd, ignoreIndex = null) {
        if (!allTask[dayId]) return false; // No tasks for the day, so no conflict

        return allTask[dayId].some((task, index) => {
            if (index === ignoreIndex) return false; // Ignore current task if editing
            return (
                (newStart >= task.startTime && newStart < task.endTime) || // New start time overlaps
                (newEnd > task.startTime && newEnd <= task.endTime) || // New end time overlaps
                (newStart <= task.startTime && newEnd >= task.endTime) // New task fully overlaps existing task
            );
        });
    }


    function deleteTask(taskIndex) {
        const id = getDateId();
        if (!allTask[id]) return;

        setAllTask((prev) => {
            const updatedTasks = { ...prev };

            // Create a new array excluding the task at the given index
            updatedTasks[id] = updatedTasks[id].filter((_, index) => index !== taskIndex);

            // Check if the task list is empty after deletion
            if (updatedTasks[id].length === 0) {
                delete updatedTasks[id]; // Remove the date if no tasks are left
            }

            // Update localStorage immediately after task deletion
            localStorage.setItem("taskData", JSON.stringify(updatedTasks));

            return updatedTasks;
        });

    }

    // Set task for editing
    function editTask(taskIndex) {
        const task = allTask[getDateId()][taskIndex];
        setTaskInput(task.taskInput);
        setStartTime(task.startTime);
        setEndTime(task.endTime);
        setDescription(task.description);
        setIsEditing(true);
        setEditIndex(taskIndex);
    }

    function exportTasksForMonth() {
        // Filter tasks for the selected month and year
        const tasksForMonth = Object.entries(allTask).reduce((acc, [key, tasks]) => {
            const [day, taskMonth, taskYear] = key.split('-').map(Number);
            if (taskMonth === month && taskYear === year) {
                acc[key] = tasks;
            }
            return acc;
        }, {});

        // Create a blob and trigger a download
        const blob = new Blob([JSON.stringify(tasksForMonth, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `tasks-${month + 1}-${year}.json`; // Filename
        link.click();
    }

    return (
        <div className='w-full space-y-4'>
            <Card className={cn("w-full lg:w-[380px]")}>
                <CardHeader>
                    <CardTitle>
                        <div className="flex justify-between items-center">
                            <p>Task List</p>
                            <Button
                                className="bg-blue-500 hover:bg-blue-400"
                                onClick={addOrEditTask}
                            >
                                {isEditing ? "Edit" : "Create"} <Plus />
                            </Button>
                        </div>
                        <input
                            type="text"
                            value={taskInput}
                            onChange={(e) => setTaskInput(e.target.value)}
                            placeholder="Enter event name"
                            className="mt-2 w-full border rounded px-2 py-1 text-sm font-normal"
                        />
                        <div className="flex mt-2 space-x-2">
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-1/2 border rounded px-2 py-1 text-sm font-normal"
                            />
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-1/2 border rounded px-2 py-1 text-sm font-normal"
                            />
                        </div>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Optional description"
                            className="mt-2 w-full border rounded px-2 py-1 text-sm font-normal"
                        />
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div>
                        {selectedDay?.day && allTask[getDateId()] ? (
                            allTask[getDateId()].map((task, index) => (
                                <div
                                    key={index}
                                    className="mb-4 flex justify-between items-center pb-4 last:mb-0 last:pb-0"
                                >
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{task.taskInput}</p>
                                        <p className="text-xs text-muted-foreground">Start: {task.startTime} - End: {task.endTime}</p>
                                        {task.description && <p className="text-xs text-muted-foreground">{task.description}</p>}
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => editTask(index)}
                                            className="bg-yellow-500 hover:bg-yellow-400 text-white"
                                        >
                                            Edit
                                        </Button>
                                        <Trash
                                            className="cursor-pointer text-red-500"
                                            onClick={() => deleteTask(index)}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No tasks for this day.
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
            <Button
                className="bg-green-500 hover:bg-green-400 "
                onClick={exportTasksForMonth}
            >
                Export Tasks
            </Button>
        </div>
    );
}

export default TaskList;
