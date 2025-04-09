import React, { useState, useEffect } from 'react'
import ApiFlowContext from './ApiFlowContext';

const ApiFlowState = (props)=>{

    const initialFetchItems = [];
    const [apiFlowLst, setApiFlowLstLst] = useState(initialFetchItems);

    const updateApiFlowLsts = (response)=>{
        setApiFlowLstLst(response);
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
