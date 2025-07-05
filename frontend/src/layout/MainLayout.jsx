import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/header/Header';
import Sidebar from '../components/layout/sidebar/Sidebar';

const MainLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  // Dati utente centralizzati
  const [currentUser] = useState({
    name: 'Maria Rossi',
    role: 'seller',
    avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
  });

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header
        user={currentUser}
        setShowSidebar={setShowSidebar}
      />

      <div className="flex">
        <Sidebar
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          userRole={currentUser.role}
        />

        {/* Contenitore del contenuto principale */}
        <div className="w-full transition-all duration-300 ease-in-out">

          <main className="p-4 sm:p-6 pt-20">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;