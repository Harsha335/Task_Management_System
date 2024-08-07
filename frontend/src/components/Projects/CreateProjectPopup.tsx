import React, { useState } from 'react'
import ClearIcon from '@mui/icons-material/Clear';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axiosTokenInstance from '../../api_calls/api_token_instance';

type PropsType = {
    handleCreateProject: () => void;
}
const CreateProjectPopup : React.FC<PropsType> = ({handleCreateProject}) => {
    type projectDataType = {
        project_title:string;
        project_description: string;
        project_deadline_date: Date | null;
        project_members: string[];
    }
    const [memberEmail, setMemberEmail] = useState<string>('');
    const [projectData, setProjectData] = useState<projectDataType>({
        project_title:'',
        project_description: '',
        project_deadline_date: new Date(),
        project_members: [],
    });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const title: string = e.target.id;
        const value : string = e.target.value;
        setProjectData(projects => ({...projects, [title]: value}))
    }
    const handleEmailAdd = () => {
        if(memberEmail.trim().length !== 0)
            projectData?.project_members?.push(memberEmail);
        setMemberEmail('');
    }

    const handleClose = () => {
        handleCreateProject();
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        e.preventDefault();
        try{
            await axiosTokenInstance.post('/api/project/create', projectData);
        }catch(err){
            console.log("Error at hadle create project submit : ",err);
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
                            <label htmlFor="project_title" className="font-medium">Project Title</label>
                            <input type="text" placeholder="Enter project title" id="project_title" className="p-1 border-2 border-zinc-300" required value={projectData?.project_title} onChange={(e) => handleInputChange(e)}/>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="project_description" className="font-medium">Project Description</label>
                            <input type="text" placeholder="Enter project description" id="project_description" className="p-1 border-2 border-zinc-300" required value={projectData?.project_description} onChange={(e) => handleInputChange(e)}/>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="project_deadline_date" className="font-medium">Project Deadline</label>
                            <DatePicker className="p-1 border-2 border-zinc-300" selected={projectData?.project_deadline_date} onChange={(date ) => setProjectData(projects => ({...projects, project_deadline_date: date}))} />
                            {/* <input type="text" placeholder="Enter project description" id="project_deadline_date" className="p-1 border-2 border-zinc-300" required value={projectData?.project_description} onChange={(e) => handleInputChange(e)}/> */}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="project_members" className="font-medium">Invite Project Members</label>
                            <ul className='flex flex-col'>
                                {
                                    projectData?.project_members?.map((member: string) => (
                                        <li className='pl-2'><ArrowRightIcon/> {member}</li>
                                    ))
                                }
                            </ul>
                            <div className='flex items-center justify-center'>
                                <input type="email" placeholder="Invite email" id="project_members" className="p-1 border-2 border-zinc-300" required value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)}/>
                                <button onClick={() => handleEmailAdd()} className=' bg-sky-600 text-white px-2 py-1 border-2 border-zinc-300'>Add</button>
                            </div>
                        </div>
                    </div>
                    <input type='submit' className="bg-primary-light rounded-md text-white p-1 cursor-pointer"  value='Create Project' onClick={(e) => handleSubmit(e)}/>
                </form>
            </div>
        </div>
    )
}

export default CreateProjectPopup