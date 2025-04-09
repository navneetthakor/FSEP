// src/components/Sidebar.jsx
import React from 'react';
import { BarChart2, Clock, AlertCircle, FileText, Link2, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col bg-white border-gray-200 border-r h-screen position-fixed w-64 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex border-b border-gray-200 p-4 dark:border-gray-700 items-center">
        <div className="flex bg-blue-600 h-8 justify-center rounded-md text-white w-8 items-center mr-3">
          <span className="text-lg font-bold">W</span>
        </div>
        <h1 className="text-gray-800 text-xl dark:text-white font-bold">WebPulse Stack</h1>
      </div>
      
      <nav className="flex-1 px-2 py-4 space-y-1">
        <SidebarItem icon={<BarChart2 className="h-5 w-5" />} label="Monitors" active />
        <SidebarItem onClick={() => navigate('/dashboard/createRequestFlow')} icon={<Clock className="h-5 w-5" />} label="API Flows" />
        <SidebarItem icon={<AlertCircle className="h-5 w-5" />} label="Incidents" badge="2" />
        <SidebarItem icon={<Link2 className="h-5 w-5" />} label="Integrations" hasChildren />
        <SidebarItem icon={<BarChart2 className="h-5 w-5" />} label="Reporting" />
      </nav>
      
      <div className="border-gray-200 border-t p-4 dark:border-gray-700">
        <div className="flex items-center">
          <div className="flex bg-blue-600 h-8 justify-center rounded-full text-white w-8 items-center">
            <span className="text-sm font-bold">N</span>
          </div>
          <div className="ml-3">
            <p className="text-gray-700 text-sm dark:text-gray-300 font-medium">NAVNEETKUMAR</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, active = false, hasChildren = false, badge }) => {
  const link = label != "Monitors" ? "createRequestFlow" : "monitor";
  return (
    <Link
      to={`/dashboard/${link}`}
      className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
        active
          ? 'bg-gray-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400'
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="bg-gray-200 rounded-full text-gray-800 text-xs dark:bg-gray-700 dark:text-gray-300 ml-auto px-2 py-0.5">
          {badge}
        </span>
      )}
      {hasChildren && <span className="ml-auto">›</span>}
    </Link>
  );
};

export default Sidebar;
