import React, { useEffect, useState } from 'react'
import axiosTokenInstance from '../../api_calls/api_token_instance'

import { Navbar } from '../Navbar';
import CreateProjectPopup from './CreateProjectPopup';
// import ReactTable from '../../ui_components/ReactTable.jsx'

const Project = () => {
  // const [projectsData, setProjectsData] = useState([]);
  // const [loading, setLoading] = useState<boolean>(true);

  // const columns = useMemo(() => [
  //   {
  //     Header: " ",
  //     columns: [
  //       {
  //         Header: "Project Title",
  //         accessor: "project_title",
  //       },
  //       {
  //         Header: "Project Members",
  //         accessor: "",
  //       },
  //       {
  //         Header: "Project Deadline",
  //         accessor: "project_deadline",
  //       },
  //       {
  //         Header: "Status",
  //         accessor: "is_completed",
  //       },
  //     ]
  //   }
  // ], []);


  // useEffect(() => {
  //   const getProjectsData = async () => {
  //     try{
  //       // console.log(process.env.REACT_APP_SERVER_URL)
  //       // const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/admin/employees`);
  //       // setProjectsData(response.data.employees.rows)
  //     }catch(err){
  //       console.log(err);
  //     }
  //     setLoading(false);
  //   }
  //   getProjectsData();
  // },[]);

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
            {/* {!loading && <ReactTable columns={columns} data={projectsData} defaultPageSize = {12}/>} */}
          </div>
          <button className='p-2 bg-primary-light text-white rounded-lg absolute top-10 right-10' onClick={handleCreateProject}>Create project</button>
      </div>
        {openPopup && <CreateProjectPopup handleCreateProject={handleCreateProject}/>}
    </div>
  )
}

export default Project;