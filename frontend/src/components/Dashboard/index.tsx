import axios from 'axios'
import React, { useEffect } from 'react'
import axiosTokenInstance from '../../api_calls/api_token_instance'

const Dashboard = () => {
  useEffect( () => {
    const getData = async () => {
      const response = await axiosTokenInstance.get('/api/user/');
      console.log(response);
    }
    getData();
  })
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard;