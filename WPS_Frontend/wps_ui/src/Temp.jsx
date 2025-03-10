import React from 'react'
import Sidebar from './components/sections/Sidebar'
import Dashboard from './components/sections/Dashboard'

export default function temp() {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <Sidebar />
            <Dashboard />
    </div>
  )
}
