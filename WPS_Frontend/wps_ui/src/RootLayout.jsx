import React from 'react'
import { Outlet } from 'react-router-dom'

// Main component which leads to layout when part of url changes 
export default function RootLayout() {
  return (
    <>
        <Outlet />
    </>
  )
}
