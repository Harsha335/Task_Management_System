import React, { useEffect, useState } from 'react'
import axiosTokenInstance from '../../api_calls/api_token_instance'

import { Navbar } from '../Navbar';
import DashboardCard from '../../ui_components/DashboardCard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import PendingActionsTwoToneIcon from '@mui/icons-material/PendingActionsTwoTone';
import AlarmTwoToneIcon from '@mui/icons-material/AlarmTwoTone';
import LineChart from '../../ui_components/LineChart';


const Dashboard = () => {
  const [projectData, setProjectData] = useState<number[]>([]);
  const [taskData, setTaskData] = useState<number[]>([]);
  type ProjectStatusDataType = {projectCountForUser: number;
    completedProjectsCount: number;
    overdueProjectsCount: number;
    inProgressProjectsCount: number;
  }
  const [projectStatusData , setProjectStatusData] = useState<ProjectStatusDataType>({
        projectCountForUser : 0,
        completedProjectsCount : 0,
        overdueProjectsCount: 0,
        inProgressProjectsCount: 0
  });
  useEffect(() => {
    const getProjectStatus = async () => {
      try{
        const response = await axiosTokenInstance.get("/api/dashborad/projectStatus");
        // console.log(response.data)
        setProjectStatusData(response.data);
      }catch(err){
        console.log("Error at getProjectStatus: ", err);
      }
    }
    const getProjectAndTask = async () => {
      try{
        const res = await axiosTokenInstance('/api/dashborad/projectAndTask_track');
        setProjectData(res.data.completedProjects.map((record : {date: Date; count: Number;}) => record.count))
        setTaskData(res.data.completedTasks.map((record : {date: Date; count: Number;}) => record.count))
        console.log("getProjectAndTask ",res);
      }catch(err){
        console.log(err);
      }
    }
    getProjectStatus();
    getProjectAndTask();
  },[]);
   // Generate the past 7 dates
   const getLast7Days = (): string[] => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]); // Format as 'YYYY-MM-DD'
    }
    return dates;
  };

  const labels = getLast7Days();

  return (
    <div className='flex flex-row w-full'>
      <Navbar/>
      <div className='w-full p-3 flex flex-col gap-5'>
          <div className='flex flex-row flex-wrap justify-around gap-5'>
                <DashboardCard title={"Total Projects"} value={projectStatusData.projectCountForUser} color="indigo" Icon={AssignmentIcon}/>
                <DashboardCard title="In Progress Projects" value={projectStatusData.inProgressProjectsCount} color="teal" Icon={PendingActionsTwoToneIcon}/>
                <DashboardCard title="Completed Projects" value={projectStatusData.completedProjectsCount} color="blue" Icon={TaskAltIcon}/>
                {/* <DashboardCard title="On Time Completed Projects" value={3} color="green" Icon={TaskAltIcon}/> */}
                <DashboardCard title="Over due Projects" value={projectStatusData.overdueProjectsCount} color="red" Icon={AlarmTwoToneIcon}/>
          </div>
          <div className='flex-1 flex w-full flex-row gap-5 items-center justify-center bg-white rounded-lg p-4'>
            <span className='flex-1  flex flex-col gap-3'>
              <span className='text-2xl font-semibold'>Projects Completed</span>
              <LineChart data={projectData} labels={labels} title="" borderColor="#0000B3"/>
              </span>
            <span className='flex-1  flex flex-col gap-3'>
              <span className='text-2xl font-semibold'>Tasks Completed</span>
              <LineChart data={taskData} labels={labels} title="" borderColor="#004DE6"/>
              </span>
          </div>
      </div>
    </div>
  )
}

export default Dashboard;