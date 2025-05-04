import React, { useEffect, useState } from 'react';
import { Pause, Play, Trash } from 'lucide-react';
import ResponseTimeGraph from './GrafanaGraph2';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from './Loader';
import { Button } from '../ui/button';

const RightSideDashBoard = () => {

  // for navigation
  const navigate = useNavigate();

  //to get id from url
  let { server_id } = useParams();

  // to show loader 
  const [loader, setIsLoading] = useState(true);

  // data regarding monitor
  const [monitor, setMonitor] = useState({});

  // Frequncy Converter
  const FreqConverter = {
    TS: '3 seconds',
    FFS: '45 seconds',
    OM: '1 Minute',
    TWOM: '2 minutes',
    THRM: '3 minutes',
    FIVM: '5 minutes',
    TENM: '10 minutes',
    FIFM: '15 minutes',
    HAFH: '30 minutes',
    OH: '1 Hour'
  }

  // send request to backend and get data set it over here
  const getMonitor = async () => {
    // preparing url 
    let url = `${import.meta.env.VITE_BACKEND_URL}/Server/getServerInfo/${server_id}`;

    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "usertoken": localStorage.getItem('usertoken')
      },
    })

    const jsonResp = await response.json()
    console.log("register response");

    if (!jsonResp.IsError) {
      // set current Monitor
      setMonitor(jsonResp.Data)
      setIsLoading(false);
    }

  }

  const handlePush = async () => {
    // set loader
    setIsLoading(true);
    // Implement push functionality
    let url = `${import.meta.env.VITE_BACKEND_URL}/Server/pushServer/${server_id}`;

    const response = await fetch(url, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "usertoken": localStorage.getItem('usertoken')
      },
    })

    const jsonResp = await response.json()
    console.log("HandlePush");

    if (!jsonResp.IsError) {

      // update server list
      await getMonitor();

    }
  };

  const handleDelete = async () => {
    // set loader
    setIsLoading(true);

    // Implement push functionality
    let url = `${import.meta.env.VITE_BACKEND_URL}/Server/deleteServer/${server_id}`;

    const response = await fetch(url, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "usertoken": localStorage.getItem('usertoken')
      },
    })

    const jsonResp = await response.json()
    console.log("handleDelete");

    if (!jsonResp.IsError) {

      // update server list
      navigate('/dashboard/monitorsHome');
    }
  };

  const handleStart = async () => {
    // set loader
    setIsLoading(true);

    // Implement push functionality
    let url = `${import.meta.env.VITE_BACKEND_URL}/Server/startServer/${server_id}`;

    const response = await fetch(url, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "usertoken": localStorage.getItem('usertoken')
      },
    })

    const jsonResp = await response.json()
    console.log("handleStart");

    if (!jsonResp.IsError) {

      // update server list
      await getMonitor();
    }
  };

  useEffect(() => getMonitor, []);

  return (
    <>
      {loader ?
        <Loader isLoading={loader} /> :
        <div className="flex flex-col w-full bg-gray-800 text-gray-200">
          {/* Top header with website info */}
          <div className="flex flex-col items-start px-4 py-6">
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full ${monitor.status == 'R' ? 'bg-green-500' : monitor.status == 'P' ? 'bg-yellow-500' : 'bg-red-500'} mr-3`}></div>
              <h1 className="text-white text-2xl font-medium">{monitor.server_name}</h1>
            </div>
            <div className="text-gray-400 text-sm mt-1 ml-6">
              {monitor.status == "R" ? "Up" : "Down"} · Checked every {FreqConverter[monitor.check_frequency]}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-4 px-4 pb-4">
            {/* Conditional buttons based on status */}
            <div className="flex space-x-2">
              {/* Show Push button when status is up */}
              {monitor.status === 'R' && (
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
              {monitor.status !== 'R' && (
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

          </div>



          {/* Response times header */}
          <div className="flex justify-between items-center px-4 pb-3">
            <div className="flex items-center">
              <span className="text-gray-400 font-medium">Response times</span>
            </div>
          </div>

          {/* Graph component would go here, but we're using your previously generated component */}
          <div style={{ margin: '0vh 1vw' }}>
            <ResponseTimeGraph />
          </div>
        </div>

      }
    </>
  );
};

export default RightSideDashBoard;