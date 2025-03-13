"use client";
import React, { useState, useEffect } from "react";
import DashboardTemplates from "./DashboardTemplates";
import DashboardRecentForms from "./DashboardRecentForms";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const Dashboard = () => {
  const { user } = useUser();
  const [greeting, setGreeting] = useState("Welcome to FillUp");
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalForms: 0,
    activeForms: 0,
    totalResponses: 0,
    recentActivity: 0
  });

  useEffect(() => {
    // Set a personalized greeting if user is available
    if (user?.firstName) {
      setGreeting(`Welcome back, ${user.firstName}!`);
    }
    
    // In a real app, you would fetch these stats from your API
    // For now, we'll use dummy data
    setStats({
      totalForms: 12,
      activeForms: 8,
      totalResponses: 256,
      recentActivity: 24
    });
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Forms</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.totalForms}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/myforms" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View all forms →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Forms</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.activeForms}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-500">
              <span className="text-green-600 font-medium">{Math.round((stats.activeForms / stats.totalForms) * 100)}%</span> of your forms are active
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Responses</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.totalResponses}</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-500">
              Avg. <span className="text-purple-600 font-medium">{Math.round(stats.totalResponses / stats.totalForms)}</span> responses per form
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Recent Activity</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.recentActivity}</h3>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-500">
              In the last <span className="text-amber-600 font-medium">24 hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            href="/newform" 
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="bg-blue-100 p-2 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="font-medium text-gray-800">Create New Form</span>
          </Link>
          
          <Link 
            href="/ai" 
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
          >
            <div className="bg-purple-100 p-2 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="font-medium text-gray-800">AI Form Builder</span>
          </Link>
          
          <Link 
            href="/myforms" 
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
          >
            <div className="bg-green-100 p-2 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
            </div>
            <span className="font-medium text-gray-800">View My Forms</span>
          </Link>
          
          <Link 
            href="/security" 
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-colors"
          >
            <div className="bg-amber-100 p-2 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="font-medium text-gray-800">Settings</span>
          </Link>
        </div>
      </div>
      
      {/* Templates section - moved before recent forms */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center justify-between">
          <span>Form Templates</span>
          <a 
            href="#" 
            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            onClick={(e) => {
              e.preventDefault();
              setIsTemplatesModalOpen(true);
            }}
          >
            <span>View all templates</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </a>
      </h2>
        <div className="w-full">
          <DashboardTemplates isModalOpen={isTemplatesModalOpen} setIsModalOpen={setIsTemplatesModalOpen} />
        </div>
      </div>
      
      {/* Recent forms section - now after templates */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 id="recents" className="text-xl font-semibold text-gray-800 mb-6 flex items-center justify-between">
          <span>Recent Forms</span>
          <Link href="/myforms" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View all forms →
          </Link>
      </h2>
        <div className="w-full">
          <DashboardRecentForms />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
