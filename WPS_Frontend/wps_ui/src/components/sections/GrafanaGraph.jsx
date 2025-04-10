import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, RefreshCcw, ChevronDown } from 'lucide-react';

// Static data for response time visualization
const generateStaticData = () => {
  const data = [];
  const baseTime = new Date();
  baseTime.setHours(baseTime.getHours() - 24); // Start 24 hours ago
  
  for (let i = 0; i < 288; i++) { // Data points every 5 minutes for 24 hours
    const time = new Date(baseTime);
    time.setMinutes(time.getMinutes() + (i * 5));
    
    // Generate realistic response time pattern with some randomness
    let responseTime;
    const hour = time.getHours();
    
    // Simulate higher load during work hours
    if (hour >= 9 && hour <= 17) {
      responseTime = 200 + Math.sin(i / 10) * 80 + Math.random() * 50;
    } else {
      responseTime = 120 + Math.sin(i / 15) * 40 + Math.random() * 20;
    }
    
    // Add occasional spikes
    if (Math.random() < 0.02) {
      responseTime += 150 + Math.random() * 200;
    }
    
    data.push({
      time: time.toISOString(),
      value: Math.max(50, Math.round(responseTime)), // Ensure minimum response time
      formattedTime: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      formattedDate: time.toLocaleDateString([], { month: 'short', day: 'numeric' })
    });
  }
  
  return data;
};

const GrafanaGraph = () => {
  const [data] = useState(generateStaticData());
  const [timeRange, setTimeRange] = useState('24h');
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  
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
  
  const timeRangeOptions = [
    { label: 'Last 15 minutes', value: '15m' },
    { label: 'Last 1 hour', value: '1h' },
    { label: 'Last 6 hours', value: '6h' },
    { label: 'Last 12 hours', value: '12h' },
    { label: 'Last 24 hours', value: '24h' },
    { label: 'Last 3 days', value: '3d' },
    { label: 'Last 7 days', value: '7d' }
  ];
  
  return (
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
                    Last {option.value}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Refresh button */}
          <button className="text-gray-400 hover:text-gray-200 p-1 rounded-md hover:bg-gray-800">
            <RefreshCcw size={16} />
          </button>
        </div>
      </div>
      
      {/* Graph */}
      <div className="p-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
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
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default GrafanaGraph;