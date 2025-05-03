import React, { useContext, useEffect } from 'react'
import Sidebar from '../components/sections/Sidebar'
import { useParams } from 'react-router-dom'
import CreateMonitorForm from '../components/sections/MonitoringForm';
import RequestFlowCanvas from '../components/sections/CanvasFlow';
import RightSideDashBoard from '@/components/sections/RightSideDashBoard';
import MonitorsHome from '../components/sections/MonitorsHome';
import UserContext from '@/context/UserContext';
import { useNavigate } from 'react-router-dom';
import APIFlowHome from '@/components/sections/APIFlowHome';

export default function DashboardLayout() {
  let {rightAria} = useParams();
  let {user, AuthLoginHelper} = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem('usertoken')){
      AuthLoginHelper();
    }
    else{
      navigate('/')
    }
  },[])
  return (
    <>
    {user &&
    <div className="flex bg-gray-100 h-screen dark:bg-gray-900 overflow-x-hidden">
            <Sidebar />

            {rightAria == "monitorsHome" && <MonitorsHome />}
            {rightAria == "createMonitor" && <CreateMonitorForm />}
            {rightAria == "createAPIFlow" && <RequestFlowCanvas />}
            {rightAria == "APIFlowHome" && <APIFlowHome />}
            {rightAria.startsWith('responseTimeGraph') && <RightSideDashBoard />}
    </div>}
      </>
  )
}
