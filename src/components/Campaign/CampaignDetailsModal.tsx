'use client'
import React from 'react';

interface CampaignModalProps {
  campaign: any;
  onClose: () => void;
}

const CampaignModal: React.FC<CampaignModalProps> = ({ campaign, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-3/4 max-w-4xl relative text-black">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
        >
          X
        </button>
        <h2 className="text-2xl mb-4">{campaign.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Voice:</strong> {campaign.voice}</p>
          <p><strong>Language:</strong> {campaign.language}</p>
          <p><strong>Script:</strong> {campaign.script}</p>
          <p><strong>Purpose:</strong> {campaign.purpose}</p>
          <p><strong>Knowledge Base:</strong> {campaign.knowledgeBase}</p>
          <p><strong>Calendar:</strong> {campaign.calendar}</p>
          <p><strong>First Line:</strong> {campaign.firstLine}</p>
          <p><strong>Tone:</strong> {campaign.tone}</p>
          <p><strong>Post Call Analysis:</strong> {campaign.postCallAnalysis ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
};

export default CampaignModal;
