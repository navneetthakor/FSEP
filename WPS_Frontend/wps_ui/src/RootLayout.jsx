import React from 'react'
import { Outlet } from 'react-router-dom'
import MonitorState from './context/MonitorState'
import ApiFlowState from './context/ApiFlowState'
import UserState from './context/UserState'

// Main component which leads to layout when part of url changes 
export default function RootLayout() {
  return (
    <>
      <ApiFlowState>
    <MonitorState>
      <UserState>
        <Outlet />
      </UserState>
    </MonitorState>
      </ApiFlowState>
    </>
  )
}
