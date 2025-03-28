import React from 'react'
import Sidebar from '../components/sections/Sidebar'
import Dashboard from '../components/sections/Dashboard'
import { useParams } from 'react-router-dom'
import CreateMonitorForm from '../components/sections/MonitoringForm';
import RequestFlowCanvas from '../components/sections/CanvasFlow';

export default function DashboardLayout() {
  let {rightAria} = useParams();

  return (
    <div className="flex bg-gray-100 dark:bg-gray-800 overflow-x-hidden">
            <Sidebar />

            {rightAria == "monitor" && <Dashboard />}
            {rightAria == "createMonitor" && <CreateMonitorForm />}
            {rightAria == "createRequestFlow" && <RequestFlowCanvas />}
    </div>
  )
}
