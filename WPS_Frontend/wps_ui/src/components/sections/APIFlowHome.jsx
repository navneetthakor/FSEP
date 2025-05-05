// src/components/Dashboard.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AlertCircle, Clock, Play, Trash, Upload, Plus } from "lucide-react";
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import UserContext from '@/context/UserContext';
import ApiFlowContext from '@/context/ApiFlowContext';
import PopupLoader from './Loader';


const APIFlowHome = () => {
  // for navigation 
  const navigate = useNavigate();

  // user's monitor context 
  const {apiFlowLst, updateApiFlowLsts} = useContext(ApiFlowContext);

  // user context
  const { user } = useContext(UserContext);

    //for loader
    const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAPIFlows = async () => {
      setIsLoading(true)
      const result = await updateApiFlowLsts();
      if (!result) navigate('/');
      setIsLoading(false);
    };
    fetchAPIFlows();
  }, []);

  // used for navigation 
  return (
    <>
      {/* {!loading && */}
        <div className="flex-1 overflow-auto">
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Hey there, {user && (user?.username?.charAt(0).toUpperCase() + user?.username?.slice(1))} </h1>
            <div className="flex items-center space-x-4">
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate("/dashboard/createAPIFlow")}>
                <Plus className="h-4 w-4 mr-2" />
                Create APIFlow
              </Button>
            </div>
          </header>

          <main className="p-6">
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                <span>Monitors</span>
                <span className="ml-1 text-gray-400">›</span>
              </h2>

              <div className="space-y-4">
                {
                  apiFlowLst?.length > 0 ?

                    (apiFlowLst?.map((ele) =>{
                      console.log(ele);
                      return <MonitorItem
                        flow_id={ele._id}
                        name={ele.api_flow_name}
                        status={ele.status}
                        setIsLoading={setIsLoading}
                      />})) : <span className='m-1 text-blue-500'>You have no server/endpoint to monitor!!</span>
                }
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">Get the most out of Better Stack</h2>

              <div className="space-y-4">
                <OnboardingItem
                  title="Create your first monitor"
                  completed={true}
                  icon={<span className="text-white bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center">✓</span>}
                  onclick={() => navigate('/dashboard/createMonitor')}
                />
                <OnboardingItem
                  title="Connect Slack or Microsoft Teams"
                  description="Get alerted about new incidents, and acknowledge and resolve incidents directly from Slack."
                  completed={false}
                  icon={<span className="text-gray-400 border border-gray-300 dark:border-gray-600 rounded-full w-6 h-6 flex items-center justify-center">2</span>}
                  onclick={() => navigate('/integration/mstems')}
                />
              </div>
            </div>
          </main>

          {/* loader when isLoading === true  */}
          <PopupLoader 
          isLoading={isLoading} 
          text="Processing your request..." 
         />
        </div>
      {/* } */}
    </>
  );
};

const MonitorItem = ({flow_id ,name, status, time, incident = false,setIsLoading}) => {
  const navigate = useNavigate();
  
   // user's monitor context 
   const { updateApiFlowLsts } = useContext(ApiFlowContext);

  const handlePush = async() => {
    // set loader
    setIsLoading(true);
    // Implement push functionality
    let url = `${import.meta.env.VITE_BACKEND_URL}/apiFlow/push/${flow_id}`;

        const response = await fetch(url, {
          method: "PUT",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "usertoken" : localStorage.getItem('usertoken')
          },
        })
  
        const jsonResp = await response.json()
        console.log("HandlePush");
  
        if (!jsonResp.IsError) {

          // update flow list
          await updateApiFlowLsts();

          // of loader
          setIsLoading(false);
        }
  };

  const handleDelete = async() => {
    // set loader
    setIsLoading(true);

    // Implement push functionality
    let url = `${import.meta.env.VITE_BACKEND_URL}/apiFlow/delete/${flow_id}`;

        const response = await fetch(url, {
          method: "DELETE",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "usertoken" : localStorage.getItem('usertoken')
          },
        })
  
        const jsonResp = await response.json()
        console.log("handleDelete");
  
        if (!jsonResp.IsError) {

          // update flow list
          await updateApiFlowLsts();

          // of loader
          setIsLoading(false);
        }
  };

  const handleStart = async() => {
    // set loader
    setIsLoading(true);

    // Implement push functionality
    let url = `${import.meta.env.VITE_BACKEND_URL}/apiFlow/start/${flow_id}`;

    const response = await fetch(url, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "usertoken" : localStorage.getItem('usertoken')
      },
    })

    const jsonResp = await response.json()
    console.log("handleStart");

    if (!jsonResp.IsError) {

      // update flow list
      await updateApiFlowLsts();

      // of loader
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full ${status == 'R' ? 'bg-green-500' : status == 'P' ? 'bg-yellow-500' : 'bg-red-500'} mr-3`}></div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">{name}</h3>
          <p className={`text-sm ${status == 'R' ? 'text-green-500' : status == 'P' ? 'text-yellow-500' : 'text-red-500'}`}>
          {status == 'R' ? 'UP' : status == 'P' ? 'Pushed' : 'Down'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {incident && (
          <span className="flex items-center text-sm text-red-500">
            <AlertCircle className="w-4 h-4 mr-1" />
            Ongoing incident
          </span>
        )}
        
        {/* <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">3m</span>
        </div> */}
        
        {/* Conditional buttons based on status */}
        <div className="flex space-x-2">
          {/* Show Push button when status is up */}
          {status === 'R' && (
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center text-blue-500 border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900"
              onClick={handlePush}
            >
              {/* <Upload className="w-4 h-4 mr-1" /> */}
              <Play className="w-4 h-4 mr-1" />
              Push
            </Button>
          )}
          
          {/* Show Start button when status is down */}
          {status !== 'R' && (
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center text-green-500 border-green-500 hover:bg-green-50 dark:hover:bg-green-900"
              onClick={handleStart}
            >
              <Play className="w-4 h-4 mr-1" />
              Start
            </Button>
          )}
          
          {/* Always show Delete button */}
          <Button 
            size="sm" 
            variant="outline" 
            className="flex items-center text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-900"
            onClick={handleDelete}
          >
            <Trash className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
        
        <button 
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" 
          onClick={() => navigate(`/dashboard/APIFlowStatus/${flow_id}`)}
        >
          •••
        </button>
      </div>
    </div>
  );
};


const OnboardingItem = ({ title, description, completed, icon, onclick }) => {
  return (
    <div className="flex items-start p-4 bg-white dark:bg-gray-800 rounded-lg shadow" onClick={onclick}>
      <div className="mr-4 mt-1">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
          {title}
          {completed && <span className="ml-2 text-blue-600">›</span>}
        </h3>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
};

export default APIFlowHome;
