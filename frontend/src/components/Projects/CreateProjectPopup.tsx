import React, { useEffect, useState } from 'react'
import ClearIcon from '@mui/icons-material/Clear';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axiosTokenInstance from '../../api_calls/api_token_instance';
import { toast, ToastContainer } from 'react-toastify';

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
    const [error, setError] = useState<string>('');
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const title: string = e.target.id;
        const value : string = e.target.value;
        setProjectData(projects => ({...projects, [title]: value}))
    }
    const handleEmailAdd = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();  
        const emailPattern : RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        console.log(memberEmail,emailPattern.test(memberEmail))
        if(memberEmail.trim().length !== 0 && emailPattern.test(memberEmail)) {
            setProjectData((prevData) => ({
                ...prevData,
                project_members: [...(prevData?.project_members || []), memberEmail]
            }));
            setMemberEmail('');
        }else{
            setError("Invalid email");
        }
    }
    useEffect(()=>{
        if(error){
            setError('');
        }
    },[memberEmail]);

    const handleClose = () => {
        handleCreateProject();
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        e.preventDefault();
        try{
            await axiosTokenInstance.post('/api/project/create', projectData);
            toast.success('Created Project successfully !!');
        }catch(err){
            console.log("Error at handle create project submit : ",err);
            toast.error('Error while creating project !!');
        }
        handleClose();
    }
    return (
        <div className='bg-slate-200 bg-transparent absolute top-0 left-0 w-full h-full flex items-center justify-center '>
            <ToastContainer/>
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
                            <div className='flex flex-col items-center justify-center'>
                                {error && <span className='text-error-light'>{error}</span>}
                                <div className='flex flex-row'>
                                    <input type="email" placeholder="Invite email" id="project_members" className="p-1 border-2 border-zinc-300" required value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)}/>
                                    <button onClick={(e) => handleEmailAdd(e)} className=' bg-sky-600 text-white px-2 py-1 border-2 border-zinc-300'>Add</button>
                                </div>
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