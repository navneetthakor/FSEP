import React, { useEffect, useState } from 'react';
import { Pause, Play, Trash } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from './Loader';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';

const APIFlowStatus = () => {

  // for navigation
  const navigate = useNavigate();

  //to get id from url
  let { server_id } = useParams();

  // to show loader 
  const [loader, setIsLoading] = useState(true);

  // data regarding monitor
  const [apiFlow, setApiFlow] = useState({});

  // for opening up popups 
  const [isError, setIsError] = useState(false);
  const [isRespopnse, setIsResponse] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [response, setResponse] = useState({});

  const closeDialog = () =>{
    setIsDialogOpen(false);
    setIsError(false);
    setIsResponse(false);
  }

  // Frequncy Converter
  const FreqConverter = {
    HAFH: '30 minutes',
    OH: '1 Hour'
  }

  // send request to backend and get data set it over here
  const getApiFlow = async () => {
    // preparing url 
    let url = `${import.meta.env.VITE_BACKEND_URL}/apiFlow/getInfo/${server_id}`;

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
      setApiFlow(jsonResp.Data)
    }
    else {
      alert("APIFlow not exists");
    }
    setIsLoading(false);

  }

  const handlePush = async () => {
    // set loader
    setIsLoading(true);
    // Implement push functionality
    let url = `${import.meta.env.VITE_BACKEND_URL}/apiFlow/push/${server_id}`;

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
      await getApiFlow();

    }
  };

  const handleDelete = async () => {
    // set loader
    setIsLoading(true);

    // Implement push functionality
    let url = `${import.meta.env.VITE_BACKEND_URL}/apiFlow/delete/${server_id}`;

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
    let url = `${import.meta.env.VITE_BACKEND_URL}/apiFlow/start/${server_id}`;

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
      await getApiFlow();
    }
  };

  useEffect(() => getApiFlow, []);

  return (
    <>
      {loader ?
        <Loader isLoading={loader} /> :
        <div className="flex flex-col w-full bg-gray-800 text-gray-200">
          {/* Top header with website info */}
          <div className="flex flex-col items-start px-4 py-6">
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full ${apiFlow.status == 'R' ? 'bg-green-500' : apiFlow.status == 'P' ? 'bg-yellow-500' : 'bg-red-500'} mr-3`}></div>
              <h1 className="text-white text-2xl font-medium">{apiFlow.api_flow_name}</h1>
            </div>
            <div className="text-gray-400 text-sm mt-1 ml-6">
              {apiFlow.status == "R" ? "Up" : "Down"} · Checked every {FreqConverter[apiFlow.check_frequency]}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-4 px-4 pb-4 mx-6">
            {/* Conditional buttons based on status */}
            <div className="flex space-x-2">
              {/* Show Push button when status is up */}
              {apiFlow.status === 'R' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center text-blue-500 border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900"
                  onClick={handlePush}
                >
                  {/* <Upload className="w-4 h-4 mr-1" /> */}
                  <Pause className="w-4 h-4 mr-1" />
                  Push
                </Button>
              )}

              {/* Show Start button when status is down */}
              {apiFlow.status !== 'R' && (
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
          <div className="flex justify-between items-center px-4 pb-3 my-3">
            <div className="flex items-center">
              <span className="text-gray-400 font-medium">Status of Nodes</span>
            </div>
          </div>

          {/* Graph component would go here, but we're using your previously generated component */}
          <div style={{ margin: '0vh 1vw' }}>
            {
              apiFlow.nodes?.map((item) => (
                <ApiItem
                  item={item}
                  setIsError={setIsError}
                  setIsResponse={setIsResponse}
                  setResponse={setResponse}
                  setIsDialogOpen={setIsDialogOpen}
                />
              ))
            }
          </div>

          <Dialog open={isDialogOpen} onOpenChange={() => closeDialog()}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Response Dialog</DialogTitle>
              </DialogHeader>
              {/* response Dialog  */}
              {isRespopnse && response && response.status &&
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>
                      Response <span className={response.status < 400 ? "text-green-500" : "text-red-500"}>
                        {response.status} {response.statusText}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="response">
                      <TabsList>
                        <TabsTrigger value="response" className='mx-3 bg-gray-100 text-black p-1 rounded'>Body</TabsTrigger>
                        <TabsTrigger value="headers" className='bg-gray-100 text-black p-1 rounded'>Headers</TabsTrigger>
                      </TabsList>
                      <TabsContent value="response" className="mt-2 h-[30vh] w-[30vw] border-5 overflow-y-auto">
                        <p className=" p-4 rounded-md overflow-x-auto text-sm font-mono">
                          {response.body && JSON.stringify(response.body)}
                        </p>
                      </TabsContent>
                      <TabsContent value="headers" className="mt-2 h-[30vh] overflow-y-auto">
                        <div className=" p-4 rounded-md">
                          {response.headers && Object.entries(response.headers).map(([key, value]) => (
                            <div key={key} className="mb-1">
                              <span className="font-medium">{key}:</span> {value}
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              }

              {/* Error dialog */}
              {
                isError &&

                <Card className="border-red-300 w-[30vw]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-red-500">Error</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{response}</p>
                  </CardContent>
                </Card>
              }
            </DialogContent>
          </Dialog>
        </div>
      }
    </>
  );
};

const ApiItem = ({ item, setIsError, setIsResponse, setResponse, setIsDialogOpen }) => {

  const { name, status, type, response, properties } = item;

  const handleClick = () => {
    if (status == 'D') {
      setIsError(true);
    }
    else if (status == 'R') {
      setIsResponse(true)
    }
    setResponse(response);
    setIsDialogOpen(true);
  }

  return (
    <div className="mx-10 my-2 bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex items-center justify-between w-[40vw]">
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full ${status == 'R' ? 'bg-green-500' : status == 'P' ? 'bg-yellow-500' : 'bg-red-500'} mr-3`}></div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">{name}</h3>
          <p className={`text-sm ${status == 'R' ? 'text-green-500' : status == 'P' ? 'text-yellow-500' : 'text-red-500'}`}>
            {status == 'R' ? 'UP ' : status == 'P' ? 'Pushed ' : 'Down '}
            {/* <div className={`h-1 w-1 rounded-full ${status == 'R' ? 'bg-green-500' : status == 'P' ? 'bg-yellow-500' : 'bg-red-500'} mr-3 inline-block`}></div> */}
            : {type == 'REQUEST' ? ' Request Node' : ' Condition Node'}
          </p>
        </div>
      </div>

      {
        status != 'N' &&

        <div className="flex items-center space-x-4">
          <button
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            onClick={handleClick}
          >
            •••
          </button>
        </div>
      }
    </div>
  );
};


export default APIFlowStatus;