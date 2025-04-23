import React, { useContext, useEffect } from 'react'
import Sidebar from '../components/sections/Sidebar'
import { useParams } from 'react-router-dom'
import CreateMonitorForm from '../components/sections/MonitoringForm';
import RequestFlowCanvas from '../components/sections/CanvasFlow';
import RightSideDashBoard from '@/components/sections/RightSideDashBoard';
import Monitors from '../components/sections/Monitors';
import UserContext from '@/context/UserContext';
import { useNavigate } from 'react-router-dom';

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

            {rightAria == "monitor" && <Monitors />}
            {rightAria == "createMonitor" && <CreateMonitorForm />}
            {rightAria == "createRequestFlow" && <RequestFlowCanvas />}
            {rightAria == "responseTimeGraph" && <RightSideDashBoard />}
    </div>}
      </>
  )
}
