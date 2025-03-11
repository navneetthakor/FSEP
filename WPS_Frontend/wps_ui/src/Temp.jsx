import React from 'react'
import Sidebar from './components/sections/Sidebar'
import Dashboard from './components/sections/Dashboard'
import { useParams } from 'react-router-dom'
import CreateMonitorForm from './components/sections/MonitoringForm';

export default function Temp() {
  let {rightAria} = useParams();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-x-hidden">
            <Sidebar />

            {rightAria == "monitor" && <Dashboard />}
            {rightAria == "createMonitor" && <CreateMonitorForm />}
            {/* {rightAria == "monitro" && <Dashboard />}
            {rightAria == "monitro" && <Dashboard />} */}
    </div>
  )
}
