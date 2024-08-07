import { useEffect, useMemo, useState } from 'react'
import axiosTokenInstance from '../../api_calls/api_token_instance'

import { Navbar } from '../Navbar';
import CreateProjectPopup from './CreateProjectPopup';
// @ts-ignore
import ReactTable from '../../ui_components/ReactTable';
import { toZonedTime, format as formatZoned } from 'date-fns-tz';
import UserAvathar from '../../ui_components/UserAvathar.js';

const Project = () => {
  const [projectsData, setProjectsData] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);

  const columns = useMemo(() => [
    {
      Header: " ",
      columns: [
        {
          Header: "Project Title",
          accessor: "project_title",
        },
        {
          Header: "Project Members",
          accessor: "members",
          Cell: ({ value } : {value: any})  => (
            <div className='flex pl-3'>
              <UserAvathar users={value.map((member: any) => ({'name': member.user.user_name, 'email':member.user.user_email}))}/>
            </div>
          )
        },
        {
          Header: "Project Deadline",
          accessor: "project_deadline_date",
          Cell: ({ value } : {value : Date}) => {
            // Convert the UTC date to IST
            const istDate = toZonedTime(value, 'Asia/Kolkata');
            return formatZoned(istDate, 'yyyy-MM-dd', { timeZone: 'Asia/Kolkata' });
          }
        },
        {
          Header: "Status",
          accessor: "is_completed",
          Cell: ({ value }: {value : boolean}) => (value ? 'Completed' : 'Pending')          
        },
      ]
    }
  ], []);


  useEffect(() => {
    const getProjectsData = async () => {
      try{
        const response = await axiosTokenInstance.get('/api/project/');
        setProjectsData(response.data.projectDetails);
      }catch(err){
        console.log(err);
      }
      setLoading(false);
    }
    getProjectsData();
  },[]);

  const [openPopup, setOpenPopup] = useState<boolean>();
  const handleCreateProject = () => {
    setOpenPopup(isOpen => !isOpen);
  }
  return (
    <div className='flex flex-row w-full'>
      <Navbar/>
      <div className='w-full p-2 relative'>
          <span className='text-3xl font-bold'>Projects</span>
          <div className='w-full flex justify-center items-center p-4'>
            {!loading && <ReactTable columns={columns} data={projectsData} defaultPageSize = {12}/>}
          </div>
          <button className='p-2 bg-primary-light text-white rounded-lg absolute bottom-10 right-10' onClick={handleCreateProject}>Create project</button>
      </div>
        {openPopup && <CreateProjectPopup handleCreateProject={handleCreateProject}/>}
    </div>
  )
}

export default Project;