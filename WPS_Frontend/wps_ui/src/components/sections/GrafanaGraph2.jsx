import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Clock, RefreshCcw, ChevronDown, AlertTriangle } from 'lucide-react';

// Function to fetch data from the backend
const fetchPrometheusData = async (timeRange, jobId) => {
  try {
    // Get user token from localStorage
    const userToken = localStorage.getItem('userToken');
    
    if (!userToken) {
      throw new Error('User token not found');
    }
    
    const response = await fetch(`/api/prometheus-data/${jobId}?timeRange=${timeRange}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch Prometheus data:', error);
    throw error;
  }
};

// Format timestamp to readable time
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return {
    formattedTime: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    formattedDate: date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  };
};

// Process raw data from API to a format suitable for charts
const processData = (rawData) => {
  if (!rawData) return { responseTimeData: [], statusCodesData: [] };
  
  // Process response time data
  const responseTimeData = rawData.resTimeData ? rawData.resTimeData.map(item => ({
    ...item,
    ...formatTimestamp(item.timestamp)
  })) : [];
  
  // Process status codes data if available
  const statusCodesData = rawData.statusCodesData ? rawData.statusCodesData.map(item => ({
    ...item,
    ...formatTimestamp(item.timestamp)
  })) : [];
  
  return { responseTimeData, statusCodesData };
};

const GrafanaGraphs = ({ jobId = "default-job" }) => {
  const [timeRange, setTimeRange] = useState('24h');
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({ responseTimeData: [], statusCodesData: [] });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  const timeRangeOptions = [
    { label: 'Last 15 minutes', value: '15m' },
    { label: 'Last 1 hour', value: '1h' },
    { label: 'Last 6 hours', value: '6h' },
    { label: 'Last 12 hours', value: '12h' },
    { label: 'Last 24 hours', value: '24h' },
    { label: 'Last 3 days', value: '3d' },
    { label: 'Last 7 days', value: '7d' }
  ];
  
  // Function to load data
  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const rawData = await fetchPrometheusData(timeRange, jobId);
      const processedData = processData(rawData);
      setData(processedData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load data initially and when timeRange or jobId changes
  useEffect(() => {
    loadData();
  }, [timeRange, jobId]);
  
  const getThresholdColor = (value) => {
    if (value < 150) return "#6CCF8F"; // Green for good response times
    if (value < 300) return "#FFCB67"; // Yellow for warning
    return "#F95F53"; // Red for critical
  };
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const value = dataPoint.value;
      
      return (
        <div className="bg-gray-800 p-2 border border-gray-700 shadow-lg rounded-md">
          <p className="text-xs text-gray-400">{dataPoint.formattedDate} {dataPoint.formattedTime}</p>
          <p className="font-medium">
            <span style={{ color: getThresholdColor(value) }}>{value} ms</span>
          </p>
        </div>
      );
    }
    
    return null;
  };

  const StatusCodeTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      
      return (
        <div className="bg-gray-800 p-2 border border-gray-700 shadow-lg rounded-md">
          <p className="text-xs text-gray-400">{dataPoint.formattedDate} {dataPoint.formattedTime}</p>
          {payload.map((entry, index) => (
            <p key={index} className="font-medium">
              <span style={{ color: entry.color }}>
                {entry.name}: {entry.value}
              </span>
            </p>
          ))}
        </div>
      );
    }
    
    return null;
  };
  
  const handleRefresh = () => {
    loadData();
  };
  
  return (
    <div className="space-y-6">
      {/* Response Time Graph */}
      <div className="bg-gray-900 rounded-md border border-gray-800 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-2 border-b border-gray-800">
          <h2 className="text-gray-200 font-medium">API Response Time</h2>
          
          <div className="flex items-center space-x-2">
            {/* Time range selector */}
            <div className="relative">
              <button 
                className="flex items-center text-sm text-gray-400 bg-gray-800 hover:bg-gray-700 rounded px-2 py-1"
                onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
              >
                <Clock size={14} className="mr-1" />
                <span>Last {timeRange}</span>
                <ChevronDown size={14} className="ml-1" />
              </button>
              
              {isTimeDropdownOpen && (
                <div className="absolute right-0 mt-1 z-10 bg-gray-800 border border-gray-700 rounded-md shadow-lg w-40">
                  {timeRangeOptions.map(option => (
                    <button
                      key={option.value}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      onClick={() => {
                        setTimeRange(option.value);
                        setIsTimeDropdownOpen(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Refresh button */}
            <button 
              className="text-gray-400 hover:text-gray-200 p-1 rounded-md hover:bg-gray-800"
              onClick={handleRefresh}
            >
              <RefreshCcw size={16} />
            </button>
          </div>
        </div>
        
        {/* Graph Content */}
        <div className="p-4 h-64">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-400">
              <AlertTriangle size={16} className="mr-2" />
              <span>Error loading data: {error}</span>
            </div>
          ) : data.responseTimeData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.responseTimeData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                  dataKey="formattedTime" 
                  stroke="#666"
                  tick={{ fill: '#999', fontSize: 10 }}
                  tickCount={6}
                />
                <YAxis 
                  stroke="#666"
                  tick={{ fill: '#999', fontSize: 10 }}
                  tickCount={5}
                  domain={['auto', 'auto']}
                  label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft', fill: '#999', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#5FE3C0" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, stroke: '#5FE3C0', strokeWidth: 1, fill: '#5FE3C0' }}
                />
                
                {/* Thresholds */}
                <Line 
                  type="monotone" 
                  dataKey={() => 150} 
                  stroke="#6CCF8F" 
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey={() => 300} 
                  stroke="#F95F53" 
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-800 px-4 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
              <span className="text-xs text-gray-400">Good (&lt;150ms)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
              <span className="text-xs text-gray-400">Warning (&lt;300ms)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
              <span className="text-xs text-gray-400">Critical (&gt;300ms)</span>
            </div>
          </div>
          
          <div className="text-xs text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Status Codes Graph */}
      <div className="bg-gray-900 rounded-md border border-gray-800 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-2 border-b border-gray-800">
          <h2 className="text-gray-200 font-medium">HTTP Status Codes</h2>
          
          <div className="flex items-center space-x-2">
            {/* Refresh button */}
            <button 
              className="text-gray-400 hover:text-gray-200 p-1 rounded-md hover:bg-gray-800"
              onClick={handleRefresh}
            >
              <RefreshCcw size={16} />
            </button>
          </div>
        </div>
        
        {/* Graph Content */}
        <div className="p-4 h-64">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-400">
              <AlertTriangle size={16} className="mr-2" />
              <span>Error loading data: {error}</span>
            </div>
          ) : !data.statusCodesData || data.statusCodesData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              No status code data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.statusCodesData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                barGap={0}
                barCategoryGap="10%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                  dataKey="formattedTime" 
                  stroke="#666"
                  tick={{ fill: '#999', fontSize: 10 }}
                  tickCount={6}
                />
                <YAxis 
                  stroke="#666"
                  tick={{ fill: '#999', fontSize: 10 }}
                  tickCount={5}
                  label={{ value: 'Count', angle: -90, position: 'insideLeft', fill: '#999', fontSize: 12 }}
                />
                <Tooltip content={<StatusCodeTooltip />} />
                <Legend wrapperStyle={{ fontSize: '10px', color: '#999' }} />
                <Bar dataKey="2xx" name="2xx (Success)" stackId="a" fill="#6CCF8F" />
                <Bar dataKey="3xx" name="3xx (Redirect)" stackId="a" fill="#5FE3C0" />
                <Bar dataKey="4xx" name="4xx (Client Error)" stackId="a" fill="#FFCB67" />
                <Bar dataKey="5xx" name="5xx (Server Error)" stackId="a" fill="#F95F53" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-800 px-4 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
              <span className="text-xs text-gray-400">2xx (Success)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-teal-500 mr-1"></div>
              <span className="text-xs text-gray-400">3xx (Redirect)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
              <span className="text-xs text-gray-400">4xx (Client Error)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
              <span className="text-xs text-gray-400">5xx (Server Error)</span>
            </div>
          </div>
          
          <div className="text-xs text-gray-500">
            Job ID: {jobId}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrafanaGraphs;