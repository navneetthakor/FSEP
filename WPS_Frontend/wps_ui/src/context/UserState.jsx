import React, { useState, useEffect } from 'react'
import MonitorContext from './MonitorContext';

const MonitorState = (props)=>{

    const initialFetchItems = [];
    const [monitorLst, setMonitorLst] = useState(initialFetchItems);

    const updateMonitors = (response)=>{
        setMonitorLst(response);
    }

    const LoginHelper = async (userData) => {
      
    }

    const RegisterHelper = (userData) => {

    }

    useEffect(() => {
        // send fetch reqeust and set data to state
    });
    
    return (
        <MonitorContext.Provider value={{ monitorLst, updateMonitors, LoginHelper, RegisterHelper }}>
          {props.children}
        </MonitorContext.Provider>
      )
}

export default MonitorState;