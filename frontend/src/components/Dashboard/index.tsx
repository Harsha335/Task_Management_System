import React, { useEffect } from 'react'
import axiosTokenInstance from '../../api_calls/api_token_instance'

import { Navbar } from '../Navbar';
import DashboardCard from '../../ui_components/DashboardCard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import PendingActionsTwoToneIcon from '@mui/icons-material/PendingActionsTwoTone';
import AlarmTwoToneIcon from '@mui/icons-material/AlarmTwoTone';
import LineChart from '../../ui_components/LineChart';

const Dashboard = () => {
  const data = [65, 59, 80, 81, 56, 55, 40];
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
                <DashboardCard title={"Total Projects"} value={20} color="indigo" Icon={AssignmentIcon}/>
                <DashboardCard title="In Progress Projects" value={12} color="teal" Icon={PendingActionsTwoToneIcon}/>
                <DashboardCard title="Completed Projects" value={8} color="blue" Icon={TaskAltIcon}/>
                {/* <DashboardCard title="On Time Completed Projects" value={3} color="green" Icon={TaskAltIcon}/> */}
                <DashboardCard title="Over due Projects" value={3} color="red" Icon={AlarmTwoToneIcon}/>
          </div>
          <div className='flex-1 flex w-full flex-row gap-5 items-center justify-center bg-white rounded-lg p-4'>
            <span className='flex-1  flex flex-col gap-3'>
              <span className='text-2xl font-semibold'>Projects Completed</span>
              <LineChart data={data} labels={labels} title="" borderColor="#0000B3"/>
              </span>
            <span className='flex-1  flex flex-col gap-3'>
              <span className='text-2xl font-semibold'>Tasks Completed</span>
              <LineChart data={data} labels={labels} title="" borderColor="#004DE6"/>
              </span>
          </div>
      </div>
    </div>
  )
}

export default Dashboard;