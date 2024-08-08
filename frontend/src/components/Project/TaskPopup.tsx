import React, { useEffect, useState } from 'react'
import ClearIcon from '@mui/icons-material/Clear';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import DescriptionIcon from '@mui/icons-material/Description';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axiosTokenInstance from '../../api_calls/api_token_instance';

type User = {
    id: number;
    user_name: string;
    user_email: string;
  };
  
   type TaskItem = {
    id: number;
    task_id: number;
    item_title: string;
    is_completed: boolean;
  };
  
   type TaskMember = {
    task_id: number;
    user_id: number;
    user: User;
  };
  
  // Enum for task priority
  enum Priority {
    HIGH,
    MEDIUM,
    LOW
  }
  
   type Task = {
    id: number;
    task_title: string;
    task_description: string;
    priority: Priority;
    phase_id: number;
    project_id: number;
    task_deadline_date: Date;
    task_completed_date: Date;
    
    members: TaskMember[];
    items: TaskItem[];
  };

type PropsType = {
    projectId: number;
    phaseId: number;
    task: Task;
    handleTaskPopup: () => void;
}
const TaskPopup : React.FC<PropsType> = ({projectId, phaseId, handleTaskPopup, task}) => {

    // Enum for task priority
    enum Priority {
        HIGH,
        MEDIUM,
        LOW
    }
    type TaskItem = {
        id?: number;
        task_id?: number;
        item_title: string;
        is_completed: boolean;
    };
    type taskDataType = {
        task_title: string;
        task_description: string;
        task_members: string[];
        priority: Priority;
        task_deadline_date: Date;
        task_items: TaskItem[]
    }
    const [taskData, setTaskData] = useState<taskDataType>(
        {
            task_title: '',
            task_description: '',
            task_members: ['assadiharsha@gmail.com', 'harsha@gmail.com'],
            priority: 2,
            task_deadline_date: new Date(),
            task_items: []
        }
    );
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const title: string = e.target.name;
        const value : string = e.target.value;
        setTaskData(taskData => ({...taskData, [title]: value}));
    }
    const [taskItem, setTaskItem] = useState<string>('');
    const handleTaskItemAdd = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();  
        if(taskItem.trim().length !== 0 ) {
            setTaskData((prevData) => ({
                ...prevData,
                task_items: [...(prevData?.task_items || []), {item_title: taskItem, is_completed: false}]
            }));
            setTaskItem('');
        }
    }
    const handleJoinTask = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        // add userEmail to task
        // TODO: send join to this task to backend
    }
    const setTaskItemCompleted = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const isCompleted = e.target.checked; // Get the new checked value
        setTaskData(prevData => {
            const updatedItems = [...prevData.task_items];
            updatedItems[index] = { ...updatedItems[index], is_completed: isCompleted };
            return { ...prevData, task_items: updatedItems };
        });
    };

    const handleClose = () => {
        handleTaskPopup();
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        e.preventDefault();
        try{
            // await axiosTokenInstance.post('/api/project/task/create', projectData);
        }catch(err){
            console.log("Error at handle create new task : ",err);
        }
        handleClose();
    }
    return (
        <div className='bg-slate-200 bg-transparent absolute top-0 left-0 w-full h-full flex items-center justify-center '>
            <div className='w-96 bg-white p-5 rounded-lg relative'>
                <button className='rounded-full absolute top-3 right-3' onClick={() => handleClose()}><ClearIcon/></button>
                <form className="flex flex-col justify-between gap-12">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <input type="text" placeholder="Enter Task title" name="task_title" className="p-1 border-2 border-zinc-300 w-[90%]" required value={taskData.task_title} onChange={(e) => handleInputChange(e)}/>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="task_description" className="font-medium"><DescriptionIcon/> Description</label>
                            <input type="text" placeholder="Enter project description" name='task_description' id="task_description" className="p-1 border-2 border-zinc-300" required value={taskData.task_description} onChange={(e) => handleInputChange(e)}/>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className='flex flex-row justify-between'>
                                <label htmlFor="task_members" className="font-medium">Members</label>
                                <button className='px-2 py-1 bg-primary text-white w-auto rounded-lg' onClick={(e) => handleJoinTask(e)}>JOIN</button>
                            </div>
                            <ul id="task_members" className='flex flex-col'>
                                {
                                    taskData.task_members?.map((member: string) => (
                                        <li className='pl-2'><ArrowRightIcon/> {member}</li>
                                    ))
                                }
                            </ul>
                        </div>
                        <div className='flex flex-row gap-3'>
                                <div className=" flex-1 flex flex-col gap-2">
                                    <label htmlFor="priority" className="font-medium">Priority</label>
                                    <select name="priority" id="priority" className='cursor-pointer p-1 border-2 border-zinc-300'>
                                        <option value='HIGH'>High</option>
                                        <option value='MEDIUM'>Medium</option>
                                        <option value='LOW' selected>Low</option>
                                    </select>
                                </div>
                                <div className="flex-1 flex flex-col gap-2">
                                    <label htmlFor="task_deadline_date" className="font-medium">Task Deadline</label>
                                    <DatePicker className="p-1 border-2 border-zinc-300" selected={taskData.task_deadline_date} onChange={(date ) => date && setTaskData(taskData => ({...taskData, task_deadline_date: date}))} />
                                    {/* <input type="text" placeholder="Enter project description" id="task_deadline_date" className="p-1 border-2 border-zinc-300" required value={projectData?.task_description} onChange={(e) => handleInputChange(e)}/> */}
                                </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="task_items" className="font-medium"><TaskAltIcon/> Checklist</label>
                            <ul id="task_items" className='flex flex-col'>
                                {
                                    taskData.task_items?.map((item: TaskItem, index: number) => (
                                        <div key={index} className='flex flex-row gap-2'>
                                            <input type='checkbox' id={index.toString()} checked={item.is_completed} onChange={(e) => setTaskItemCompleted(e, index)} />
                                            <label htmlFor={index.toString()} className={`${item.is_completed ? 'line-through' : ''}`}> {item.item_title} </label>
                                        </div>
                                    ))
                                }
                            </ul>
                            <div className='flex flex-col items-center justify-center'>
                                <div className='flex flex-row'>
                                    <input type="type" placeholder="Enter Task Item "  className="p-1 border-2 border-zinc-300" required value={taskItem} onChange={(e) => setTaskItem(e.target.value)}/>
                                    <button onClick={(e) => handleTaskItemAdd(e)} className=' bg-sky-600 text-white px-2 py-1 border-2 border-zinc-300'>Add an Item</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <input type='submit' className="bg-primary-light rounded-md text-white p-1 cursor-pointer"  value='Create Task' onClick={(e) => handleSubmit(e)}/>
                </form>
            </div>
        </div>
    )
}

export default TaskPopup;