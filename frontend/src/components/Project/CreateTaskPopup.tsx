import React, { useState } from 'react'
import ClearIcon from '@mui/icons-material/Clear';
import DescriptionIcon from '@mui/icons-material/Description';

import axiosTokenInstance from '../../api_calls/api_token_instance';

type PropsType = {
    projectId: number;
    phaseId: number;
    handleCreateTaskPopup: () => void;
}
const CreateTaskPopup : React.FC<PropsType> = ({projectId, phaseId, handleCreateTaskPopup}) => {

    const [taskData, setTaskData] = useState(
        {
            task_title: '',
            task_description: ''
        }
    );
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        const title: string = e.target.name;
        const value : string = e.target.value;
        setTaskData(taskData => ({...taskData, [title]: value}));
    }

    const handleClose = () => {
        handleCreateTaskPopup();
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        e.preventDefault();
        try{
            // console.log(taskData)
            await axiosTokenInstance.post(`/api/project/create/task?projectId=${projectId}&phaseId=${phaseId}`, taskData);
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
                            <input type="text" placeholder="Enter Task title" name="task_title" className="p-1 border-2 border-zinc-300 w-[80%]" required value={taskData.task_title} onChange={(e) => handleInputChange(e)}/>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="task_description" className="font-medium"><DescriptionIcon/> Description</label>
                            {/* <input type="text" placeholder="Enter project description" name='task_description' id="task_description" className="p-1 border-2 border-zinc-300" required value={taskData.task_description} onChange={(e) => handleInputChange(e)}/> */}
                            <textarea name="task_description" rows={4} cols={50} placeholder="Enter project description" id="task_description" className="p-1 border-2 border-zinc-300" value={taskData.task_description} onChange={(e) => handleInputChange(e)}></textarea>
                        </div>
                    </div>
                    <input type='submit' className="bg-primary-light rounded-md text-white p-1 cursor-pointer"  value='Create Task' onClick={(e) => handleSubmit(e)}/>
                </form>
            </div>
        </div>
    )
}

export default CreateTaskPopup;