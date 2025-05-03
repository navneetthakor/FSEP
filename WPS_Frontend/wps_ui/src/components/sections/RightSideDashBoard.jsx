import React, { useEffect, useState } from 'react';
import { Pause, Trash } from 'lucide-react';
import ResponseTimeGraph from './GrafanaGraph2';
import { useParams } from 'react-router-dom';
import Loader from './Loader';

const RightSideDashBoard = () => {

  //to get id from url
  let { server_id } = useParams();

  // to show loader 
  const [loader, setLoader] = useState(true);

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
      setLoader(false);
      console.log('fine');
    }

  }

  useEffect(()=> getMonitor, []);

  return (
    <>
      {loader ?
        <Loader isLoading={loader} /> :
        <div className="flex flex-col w-full bg-gray-800 text-gray-200">
          {/* Top header with website info */}
          <div className="flex flex-col items-start px-4 py-6">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full ${monitor.status == 'R' ? bg-green-500 : bg-red-500} mr-3"></div>
              <h1 className="text-white text-2xl font-medium">{monitor.server_name}</h1>
            </div>
            <div className="text-gray-400 text-sm mt-1 ml-6">
              {monitor.status == "R" ? "Up" : "Down"} · Checked every {FreqConverter[monitor.check_frequency]}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-4 px-4 pb-4">

            <button className="flex items-center py-1.5 px-3 rounded bg-gray-950 hover:bg-gray-700 text-gray-300 text-sm">
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </button>

            <button className="flex items-center py-1.5 px-3 rounded bg-gray-950 hover:bg-gray-700 text-gray-300 text-sm">
              <Trash className="w-4 h-4 mr-1" />
              Delete
            </button>
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