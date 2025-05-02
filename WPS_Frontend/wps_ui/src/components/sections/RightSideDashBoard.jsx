import React from 'react';
import { Play, Pause, Settings, AlertCircle } from 'lucide-react';
import ResponseTimeGraph from './GrafanaGraph';

const RightSideDashBoard = () => {
  return (
    <div className="flex flex-col w-full bg-gray-800 text-gray-200">
      {/* Top header with website info */}
      <div className="flex flex-col items-start px-4 py-6">
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-green-500 mr-3"></div>
          <h1 className="text-white text-2xl font-medium">betterstack.com</h1>
        </div>
        <div className="text-gray-400 text-sm mt-1 ml-6">
          Up · Checked every 3 minutes
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center space-x-4 px-4 pb-4">
        <button className="flex items-center py-1.5 px-3 rounded bg-gray-950 hover:bg-gray-700 text-gray-300 text-sm">
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Send test alert
        </button>
        
        <button className="flex items-center py-1.5 px-3 rounded bg-gray-950 hover:bg-gray-700 text-gray-300 text-sm">
          <AlertCircle className="w-4 h-4 mr-2" />
          Incidents
        </button>
        
        <button className="flex items-center py-1.5 px-3 rounded bg-gray-950 hover:bg-gray-700 text-gray-300 text-sm">
          <Pause className="w-4 h-4 mr-2" />
          Pause
        </button>
        
        <button className="flex items-center py-1.5 px-3 rounded bg-gray-950 hover:bg-gray-700 text-gray-300 text-sm">
          <Settings className="w-4 h-4 mr-2" />
          Configure
        </button>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-3 gap-4 px-4 pb-6">
        <div className="bg-gray-900 rounded-md p-4">
          <div className="text-gray-500 text-sm mb-1">Currently up for</div>
          <div className="text-white text-xl font-medium">2 months 16 days 6 hours</div>
        </div>
        
        <div className="bg-gray-900 rounded-md p-4">
          <div className="text-gray-500 text-sm mb-1">Last checked at</div>
          <div className="text-white text-xl font-medium">1 minute ago</div>
        </div>
        
        <div className="bg-gray-900 rounded-md p-4">
          <div className="text-gray-500 text-sm mb-1">Incidents</div>
          <div className="text-white text-xl font-medium">0</div>
        </div>
      </div>

      {/* Response times header */}
      <div className="flex justify-between items-center px-4 pb-3">
        <div className="flex items-center">
          <span className="text-gray-400 font-medium">Response times</span>
        </div>
        
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm rounded bg-gray-900 text-gray-400 hover:bg-gray-800">
            Day
          </button>
          <button className="px-3 py-1 text-sm rounded bg-gray-900 text-gray-400 hover:bg-gray-800">
            Week
          </button>
          <button className="px-3 py-1 text-sm rounded bg-gray-900 text-gray-400 hover:bg-gray-800">
            Month
          </button>
        </div>
      </div>

      {/* Graph component would go here, but we're using your previously generated component */}
      <div style={{margin : '0vh 1vw'}}>
        {/* <ResponseTimeGraph /> */}
        <iframe src="https://codewithnavneet.grafana.net/d-solo/74e29e4a-16ed-4511-9e0c-766c295272ba/sampleuserdsbd?orgId=1&from=1746019942648&to=1746041542648&timezone=browser&theme=dark&panelId=1&__feature.dashboardSceneSolo" width="450" height="200" frameborder="0"></iframe>
      </div>
    </div>
  );
};

export default RightSideDashBoard;