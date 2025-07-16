import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/header/Header';
import Sidebar from '../components/layout/sidebar/Sidebar';

const MainLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen text-gray-800">
      <Header setShowSidebar={setShowSidebar} />
      <div className="flex">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <div className="w-full transition-all duration-300 ease-in-out">
          <main className="p-4 sm:p-6 mt-[65px]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;