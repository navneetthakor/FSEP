// src/components/Sidebar.jsx
import React from 'react';
import { BarChart2, Clock, AlertCircle, FileText, Link2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
        <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white mr-3">
          <span className="text-lg font-bold">W</span>
        </div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">WebPulse Stack</h1>
      </div>
      
      <nav className="flex-1 px-2 py-4 space-y-1">
        <SidebarItem icon={<BarChart2 className="w-5 h-5" />} label="Monitors" active />
        <SidebarItem icon={<Clock className="w-5 h-5" />} label="Heartbeats" />
        <SidebarItem icon={<Users className="w-5 h-5" />} label="Who's on-call?" />
        <SidebarItem icon={<AlertCircle className="w-5 h-5" />} label="Incidents" badge="2" />
        <SidebarItem icon={<FileText className="w-5 h-5" />} label="Status pages" />
        <SidebarItem icon={<FileText className="w-5 h-5" />} label="Escalation policies" />
        <SidebarItem icon={<Link2 className="w-5 h-5" />} label="Integrations" hasChildren />
        <SidebarItem icon={<BarChart2 className="w-5 h-5" />} label="Reporting" />
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
            <span className="text-sm font-bold">N</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">NAVNEETKUMAR</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, active = false, hasChildren = false, badge }) => {
  return (
    <a
      href="#"
      className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
        active
          ? 'bg-gray-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400'
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="ml-auto bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs">
          {badge}
        </span>
      )}
      {hasChildren && <span className="ml-auto">›</span>}
    </a>
  );
};

export default Sidebar;
