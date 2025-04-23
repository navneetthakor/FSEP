import React, { useState } from 'react'
import MonitorContext from './MonitorContext';

const MonitorState = (props)=>{

    const initialFetchItems = [];
    const [monitorLst, setMonitorLst] = useState(initialFetchItems);

    const updateMonitors = async ()=>{
      // preparing url 
        // eslint-disable-next-line no-undef
        let url = `${import.meta.env.VITE_BACKEND_URL}/Server/getAllServer`;

        const response = await fetch(url, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "usertoken" : localStorage.getItem('usertoken')
          },
        })
  
        const jsonResp = await response.json()
        console.log("register response");
  
        if (!jsonResp.IsError) {
          // update server list
          setMonitorLst(jsonResp.Data);

          // login successful
          return true;
        }
  
        // login unsuccessful
        return false;
    }

    
    return (
        <MonitorContext.Provider value={{ monitorLst, updateMonitors}}>
          {props.children}
        </MonitorContext.Provider>
      )
}

export default MonitorState;