'use client';
import React, { useState } from 'react';
import AddCampaignForm from '@/components/cards/AddCampaignForm';
//import CallManager from '@/components/cards/CallManager';
import { HiPlusCircle } from 'react-icons/hi';

const HomePage = () => {
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [showCallManager, setShowCallManager] = useState(false); 

  const handleAddCampaignClick = () => {
    setShowCampaignForm(true);
    setShowCallManager(false); 
  };

  const handleCloseCampaignForm = () => {
    setShowCampaignForm(false);
  };


  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center z-50">
      <h1 className="text-4xl mb-8 font-bold">Campaign and Call Management</h1>
      <div className="flex space-x-8">
        <div
          className="bg-white bg-opacity-20 rounded-lg shadow-xl p-8 cursor-pointer hover:scale-105 transform transition duration-300 ease-in-out hover:bg-opacity-30 z-50"
          onClick={handleAddCampaignClick}
        >
          <div className="flex flex-col items-center">
            <HiPlusCircle className="text-6xl text-blue-300 mb-4" />
            <h2 className="text-2xl font-semibold text-blue-200">Add New Campaign</h2>
            <p className="mt-2 text-sm text-gray-300">Create and manage your campaigns here.</p>
          </div>
        </div>
      </div>
      {showCampaignForm && <AddCampaignForm onClose={handleCloseCampaignForm} />}
    
    </div>
  );
};

export default HomePage;
