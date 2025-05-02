// src/components/Dashboard.jsx
import React, { useContext, useEffect, useState } from 'react';
// import { Search, Plus, AlertCircle, Clock } from 'lucide-react';
import { AlertCircle, Clock, Play, Trash, Upload, Plus } from "lucide-react";
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useNavigate } from 'react-router-dom';
import MonitorContext from '@/context/MonitorContext';
import UserContext from '@/context/UserContext';
import PopupLoader from './Loader';

const MonitorsHome = () => {
  // for navigation 
  const navigate = useNavigate();

  // user's monitor context 
  const { monitorLst, updateMonitors } = useContext(MonitorContext);

  //for loader
  const [isLoading, setIsLoading] = useState(false);

  // user context
  const { user } = useContext(UserContext);


  useEffect(() => {
    const fetchMonitors = async () => {
      const result = await updateMonitors();
      if (!result) navigate('/');
      // else setLoading(false);
    };
    fetchMonitors();
  }, []);

  // used for navigation 
  return (
    <>
      {/* {!loading && */}
        <div className="flex-1 overflow-auto">
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Hey there, {user?.username && user.username} </h1>
            <div className="flex items-center space-x-4">
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate("/dashboard/createMonitor")}>
                <Plus className="h-4 w-4 mr-2" />
                Create monitor
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
                  monitorLst?.length > 0 ?

                    (monitorLst?.map((ele) =>{
                      return <MonitorItem
                        server_id={ele._id}
                        name={ele.server_name}
                        status={ele.status === 'R' ? "up" : "down"}
                        setIsLoading={setIsLoading}
                        isLoading={isLoading}
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
          <PopupLoader 
          isLoading={isLoading} 
          text="Processing your request..." 
         />
        </div>
      {/* } */}
    </>
  );
};

const MonitorItem = ({server_id ,name, status, time, incident = false,setIsLoading}) => {
  const isDown = status === "down";
  const navigate = useNavigate();
  
   // user's monitor context 
   const { updateMonitors } = useContext(MonitorContext);

  const handlePush = async() => {
    // set loader
    setIsLoading(true);
    // Implement push functionality
    let url = `${import.meta.env.VITE_BACKEND_URL}/Server/pushServer/${server_id}`;

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

          // update server list
          await updateMonitors();

          // of loader
          setIsLoading(false);
        }
  };

  const handleDelete = async() => {
    // set loader
    setIsLoading(true);

    // Implement push functionality
    let url = `${import.meta.env.VITE_BACKEND_URL}/Server/deleteServer/${server_id}`;

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

          // update server list
          await updateMonitors();

          // of loader
          setIsLoading(false);
        }
  };

  const handleStart = async() => {
    // set loader
    setIsLoading(true);

    // Implement push functionality
    let url = `${import.meta.env.VITE_BACKEND_URL}/Server/startServer/${server_id}`;

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

      // update server list
      await updateMonitors();

      // of loader
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full ${isDown ? 'bg-red-500' : 'bg-green-500'} mr-3`}></div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">{name}</h3>
          <p className={`text-sm ${isDown ? 'text-red-500' : 'text-green-500'}`}>
            {isDown ? 'Down' : 'Up'} · {time}
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
        
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">3m</span>
        </div>
        
        {/* Conditional buttons based on status */}
        <div className="flex space-x-2">
          {/* Show Push button when status is up */}
          {!isDown && (
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
          {isDown && (
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
          // onClick={() => navigate(`/dashboard/responseTimeGraph/${server_id}`)}
          onClick={() => navigate(`/dashboard/responseTimeGraph`)}
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

export default MonitorsHome;
