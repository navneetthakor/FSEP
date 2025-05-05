import React, { useState, useEffect } from 'react';
import ApiFlowContext from './ApiFlowContext';

const ApiFlowState = (props)=>{

    const initialFetchItems = [];
    const [apiFlowLst, setApiFlowLstLst] = useState(initialFetchItems);

    const updateApiFlowLsts = async ()=>{
      // preparing url 
        // eslint-disable-next-line no-undef
        let url = `${import.meta.env.VITE_BACKEND_URL}/apiFlow/getAll`;

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
          setApiFlowLstLst(jsonResp.Data);

          // login successful
          return true;
        }
  
        // login unsuccessful
        return false;
    }

    useEffect(() => {
        // send fetch reqeust and set data to state
    });
    
    return (
        <ApiFlowContext.Provider value={{ apiFlowLst, updateApiFlowLsts }}>
          {props.children}
        </ApiFlowContext.Provider>
      )
}

export default ApiFlowState;
