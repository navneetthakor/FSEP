import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Clock, RefreshCcw, ChevronDown } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const GrafanaGraphs = ({ jobId = "default-job" }) => {
  const [timeRange, setTimeRange] = useState('24h');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    responseTimeData: [],
    statusCodesData: []
  });
  const [lastUpdated, setLastUpdated] = useState(new Date());

  //to get id from url
  let { server_id } = useParams();

  // for navigation 
  const navigate = useNavigate();

  // Time range options
  const timeOptions = [
    { label: 'Last 15 minutes', value: '15m' },
    { label: 'Last hour', value: '1h' },
    { label: 'Last 6 hours', value: '6h' },
    { label: 'Last 12 hours', value: '12h' },
    { label: 'Last 24 hours', value: '24h' },
    { label: 'Last 3 days', value: '3d' },
    { label: 'Last 7 days', value: '7d' }
  ];

  // Fetch data from backend
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // preparing url 
      let url = `${import.meta.env.VITE_BACKEND_URL}/grafana/serverGraph/${server_id}/${timeRange}`;

      let response = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "usertoken": localStorage.getItem('usertoken')
        },
      })

      response = await response.json()
      console.log(response);

      if (response.IsError) {
          alert("Server side error while fetching data for graph");
          navigate('/dashboard/monitorHome');
      }

      const rawData = response.Data;

      // Format the data
      const formattedData = {
        responseTimeData: formatTimeData(rawData?.resTimeData[0]?.values || []),
        statusCodesData: formatTimeData(rawData?.statusCodeData[0]?.values || [])
      };

      setData(formattedData);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Format timestamps for display
  const formatTimeData = (dataArray) => {
    return dataArray.map(item => {
      const date = new Date(item.timestamp);
      return {
        ...item,
        formattedTime: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        formattedDate: date.toLocaleDateString([], { month: 'short', day: 'numeric' })
      };
    });
  };

  // Load data when component mounts or timeRange changes
  useEffect(() => {
    fetchData();
  }, [timeRange, jobId]);

  // Handle refresh button click
  const handleRefresh = () => {
    fetchData();
  };

  // Get color based on response time
  const getResponseTimeColor = (value) => {
    if (value < 150) return "#6CCF8F"; // Green
    if (value < 300) return "#FFCB67"; // Yellow
    return "#F95F53"; // Red
  };

  // Custom tooltip for response time graph
  const ResponseTimeTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    return (
      <div className="bg-gray-800 p-2 border border-gray-700 rounded">
        <p className="text-xs text-gray-400">{data.formattedDate} {data.formattedTime}</p>
        <p className="font-medium" style={{ color: getResponseTimeColor(data.value) }}>
          {data.value} ms
        </p>
      </div>
    );
  };



  return (
    <div className="space-y-4">
      {/* Response Time Graph */}
      <div className="bg-gray-900 rounded border border-gray-800 shadow">
        {/* Header */}
        <div className="flex justify-between items-center p-2 border-b border-gray-800">
          <h2 className="text-gray-200 font-medium">API Response Time</h2>

          <div className="flex items-center space-x-2">
            {/* Time range selector */}
            <div className="relative">
              <button
                className="flex items-center text-sm text-gray-400 bg-gray-800 hover:bg-gray-700 rounded px-2 py-1"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Clock size={14} className="mr-1" />
                <span>Last {timeRange}</span>
                <ChevronDown size={14} className="ml-1" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-1 z-10 bg-gray-800 border border-gray-700 rounded shadow w-40">
                  {timeOptions.map(option => (
                    <button
                      key={option.value}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      onClick={() => {
                        setTimeRange(option.value);
                        setIsDropdownOpen(false);
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
              className="text-gray-400 hover:text-gray-200 p-1 rounded hover:bg-gray-800"
              onClick={handleRefresh}
            >
              <RefreshCcw size={16} />
            </button>
          </div>
        </div>

        {/* Graph Content */}
        <div className="p-3 h-64">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-400">
              Error: {error}
            </div>
          ) : data.responseTimeData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.responseTimeData}
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                  dataKey="formattedTime"
                  stroke="#666"
                  tick={{ fill: '#999', fontSize: 10 }}
                />
                <YAxis
                  stroke="#666"
                  tick={{ fill: '#999', fontSize: 10 }}
                />
                <Tooltip content={<ResponseTimeTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#5FE3C0"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />

                {/* Threshold lines */}
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
        <div className="border-t border-gray-800 px-3 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-3">
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
            Updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrafanaGraphs;