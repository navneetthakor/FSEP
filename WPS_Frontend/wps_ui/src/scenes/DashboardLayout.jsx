import React from 'react'
import Sidebar from '../components/sections/Sidebar'
import Dashboard from '../components/sections/Dashboard'
import { useParams } from 'react-router-dom'
import CreateMonitorForm from '../components/sections/MonitoringForm';
import RequestFlowCanvas from '../components/sections/CanvasFlow';
import RightSideDashBoard from '@/components/sections/RightSideDashBoard';

export default function DashboardLayout() {
  let {rightAria} = useParams();

  return (
    <div className="flex bg-gray-100 h-screen dark:bg-gray-900 overflow-x-hidden">
            <Sidebar />

            {rightAria == "monitor" && <Dashboard />}
            {rightAria == "createMonitor" && <CreateMonitorForm />}
            {rightAria == "createRequestFlow" && <RequestFlowCanvas />}
            {rightAria == "responseTimeGraph" && <RightSideDashBoard />}
    </div>
  )
}
