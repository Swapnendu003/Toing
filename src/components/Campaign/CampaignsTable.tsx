'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import SnackBar from '@/components/Common/ReusableSnackBar'; // Ensure correct path to SnackBar component

interface Campaign {
  campaignId: string;
  title: string;
  voice: string;
  language: string;
  script: string;
  purpose: string;
  knowledgeBase: string;
  calendar: string;
  firstLine: string;
  tone: string;
  maxCallTimeout: number;
  inactiveCallTimeout: number;
  postCallAnalysis: boolean;
  postCallAnalysisSchema: object;
}

interface Contact {
  Name: string;
  'Phone Number': string;
}

const CampaignTable: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isCallInProgress, setIsCallInProgress] = useState(false);
  const [showCallForm, setShowCallForm] = useState(false);
  const [showCsvForm, setShowCsvForm] = useState(false);
  const [callDetails, setCallDetails] = useState({ name: '', phoneNumber: '' });
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [snackBarProps, setSnackBarProps] = useState<{
    message: string;
    type: 'info' | 'success' | 'error' | 'warning';
    mode?: 'light' | 'dark';
    duration?: number;
    onClose?: () => void;
  } | null>(null);

  useEffect(() => {
    const storedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    setCampaigns(storedCampaigns);
  }, []);

  const handleViewCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
  };

  const handleCloseModal = () => {
    setSelectedCampaign(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCallDetails({ ...callDetails, [name]: value });
  };

  const showSnackBar = (message: string, type: 'info' | 'success' | 'error' | 'warning') => {
    setSnackBarProps({
      message,
      type,
      mode: 'dark',
      duration: 3000,
      onClose: () => setSnackBarProps(null),
    });
  };

  const handleMakeCall = async () => {
    if (!callDetails.name || !callDetails.phoneNumber) {
      showSnackBar('Name and phone number are required to make a call.', 'error');
      return;
    }

    if (currentCampaign) {
      try {
        setIsCallInProgress(true);
        setShowCallForm(false); 
        showSnackBar('Call is starting...', 'info');

        const requestBody = {
          name: callDetails.name,
          phoneNumber: callDetails.phoneNumber,
          campID: currentCampaign.campaignId,
        };

        const response = await axios.post('https://www.toingg.com/api/v3/make_call', requestBody, {
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer tg_f81bc3c5-2f58-491d-b140-84e57d3ac689-SGGIAfisY6HGvH68m8h8Aw',
            'Content-Type': 'application/json',
          },
        });

        showSnackBar('Call started successfully', 'success');
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          showSnackBar(`Error starting the call: ${error.response.data.message || 'Please try again.'}`, 'error');
        } else {
          showSnackBar('Unexpected error occurred. Please try again.', 'error');
        }
      } finally {
        setIsCallInProgress(false);
      }
    } else {
      showSnackBar('No campaign selected. Please select a campaign to start the call.', 'error');
    }
  };

  const handleViewCallLogs = async (campaignId: string) => {
    try {
      const response = await axios.get(`https://www.toingg.com/api/v3/call_status?callId=${campaignId}`, {
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer tg_f81bc3c5-2f58-491d-b140-84e57d3ac689-SGGIAfisY6HGvH68m8h8Aw',
        },
      });
      console.log('Call logs:', response.data);

    } catch (error) {
      showSnackBar('Error fetching call logs. Please try again.', 'info');
    }
  };

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCsvFile(file);
    }
  };

  const handleParseCSV = async () => {
    if (csvFile) {
      Papa.parse(csvFile, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const contacts: Contact[] = results.data as Contact[];

          for (const contact of contacts) {
            try {
              if (currentCampaign) {
                const requestBody = {
                  name: contact.Name,
                  phoneNumber: contact['Phone Number'],
                  campID: currentCampaign.campaignId,
                };

                const response = await axios.post('https://www.toingg.com/api/v3/make_call', requestBody, {
                  headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer tg_f81bc3c5-2f58-491d-b140-84e57d3ac689-SGGIAfisY6HGvH68m8h8Aw',
                    'Content-Type': 'application/json',
                  },
                });

                showSnackBar(`Call started for ${contact.Name}`, 'success');
              }
            } catch (error) {
              if (axios.isAxiosError(error) && error.response) {
                showSnackBar(`Error starting the call for ${contact.Name}: ${error.response.data.message || 'Please try again.'}`, 'error');
              } else {
                showSnackBar(`Unexpected error occurred for ${contact.Name}. Please try again.`, 'error');
              }
            }
          }
        },
        error: (error) => {
          showSnackBar('Error parsing CSV file. Please try again.', 'error');
        },
      });
    }
  };

  return (
    <div className="text-white z-50">
      <h1 className="text-4xl mb-8 font-bold">Campaigns</h1>
      <div className="overflow-x-auto">
        <table className="w-[50rem] text-white">
          <thead>
            <tr>
              <th className="p-4 border-b border-gray-700">Name</th>
              <th className="p-4 border-b border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={2} className="p-4 text-center">No campaigns available</td>
              </tr>
            ) : (
              campaigns.map(campaign => (
                <tr key={campaign.campaignId}>
                  <td className="p-4 border-b border-gray-700">{campaign.title}</td>
                  <td className="p-4 border-b border-gray-700 flex space-x-2" style={{ marginLeft: '10rem' }}>
                    <button
                      onClick={() => handleViewCampaign(campaign)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleViewCallLogs(campaign.campaignId)}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Call Logs
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedCampaign && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg text-black">
            <h2 className="text-2xl font-bold mb-4">{selectedCampaign.title}</h2>
            <p><strong>Voice:</strong> {selectedCampaign.voice}</p>
            <p><strong>Language:</strong> {selectedCampaign.language}</p>
            <p><strong>Script:</strong> {selectedCampaign.script}</p>
            <p><strong>Purpose:</strong> {selectedCampaign.purpose}</p>
            <p><strong>Knowledge Base:</strong> {selectedCampaign.knowledgeBase}</p>
            <p><strong>Calendar:</strong> {selectedCampaign.calendar}</p>
            <p><strong>First Line:</strong> {selectedCampaign.firstLine}</p>
            <p><strong>Tone:</strong> {selectedCampaign.tone}</p>
            <p><strong>Max Call Timeout:</strong> {selectedCampaign.maxCallTimeout} seconds</p>
            <p><strong>Inactive Call Timeout:</strong> {selectedCampaign.inactiveCallTimeout} seconds</p>
            <p><strong>Post Call Analysis:</strong> {selectedCampaign.postCallAnalysis ? 'Enabled' : 'Disabled'}</p>
            {selectedCampaign.postCallAnalysis && (
              <p><strong>Post Call Analysis Schema:</strong> {JSON.stringify(selectedCampaign.postCallAnalysisSchema)}</p>
            )}
            <button onClick={handleCloseModal} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4">
              Close
            </button>
          </div>
        </div>
      )}

      {showCallForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg text-black">
            <h2 className="text-2xl font-bold mb-4">Make a Call</h2>
            <input
              type="text"
              name="name"
              value={callDetails.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="phoneNumber"
              value={callDetails.phoneNumber}
              onChange={handleInputChange}
              placeholder="Phone Number"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <button
              onClick={handleMakeCall}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Make Call
            </button>
            <button
              onClick={() => setShowCallForm(false)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showCsvForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg text-black">
            <h2 className="text-2xl font-bold mb-4">Upload CSV</h2>
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="mb-4"
            />
            <button
              onClick={handleParseCSV}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Upload and Parse CSV
            </button>
            <button
              onClick={() => setShowCsvForm(false)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {snackBarProps && (
        <SnackBar
          message={snackBarProps.message}
          type={snackBarProps.type}
          mode={snackBarProps.mode}
          duration={snackBarProps.duration}
          onClose={snackBarProps.onClose}
        />
      )}
    </div>
  );
};

export default CampaignTable;
