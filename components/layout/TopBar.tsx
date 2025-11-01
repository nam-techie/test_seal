import React, { useState } from 'react';
import { BellIcon, SearchIcon, UserIcon, CogIcon, LogoutIcon } from '../icons/Icons';

interface TopBarProps {
    onLogout: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="flex-shrink-0 bg-surface h-[64px] flex items-center justify-between px-6 border-b border-surface2">
      <div className="relative w-full max-w-xs">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="text-primary-muted" />
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-surface2 border border-surface2 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-accent-violet"
        />
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-surface2">
          <BellIcon className="text-primary-muted" />
        </button>
        <div className="relative">
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-10 h-10 rounded-full bg-surface2 flex items-center justify-center overflow-hidden">
            <img src={`https://i.pravatar.cc/40?u=testuser`} alt="User avatar" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-surface2 rounded-xl shadow-lg py-2 z-20">
              <a href="#/profile" className="flex items-center px-4 py-2 text-sm text-primary-muted hover:bg-surface hover:text-white">
                <UserIcon className="mr-3" /> Profile
              </a>
              <a href="#/settings" className="flex items-center px-4 py-2 text-sm text-primary-muted hover:bg-surface hover:text-white">
                <CogIcon className="mr-3" /> Settings
              </a>
              <button onClick={onLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-primary-muted hover:bg-surface hover:text-white">
                <LogoutIcon className="mr-3" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
