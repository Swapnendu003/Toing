import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Papa from 'papaparse';

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

  useEffect(() => {
    // Load campaigns from local storage
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

  const handleMakeCall = async () => {
    if (!callDetails.name || !callDetails.phoneNumber) {
      toast.error('Name and phone number are required to make a call.');
      return;
    }

    if (currentCampaign) {
      try {
        setIsCallInProgress(true);
        setShowCallForm(false); // Close the call form immediately
        toast.info('Call is starting...');

        // Log currentCampaign and the request body
        console.log('Current Campaign:', currentCampaign);
        const requestBody = {
          name: callDetails.name,
          phoneNumber: callDetails.phoneNumber,
          campID: currentCampaign.campaignId,
        };
        console.log('Request Body:', requestBody);

        
        const response = await axios.post('https://www.toingg.com/api/v3/make_call', requestBody, {
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer tg_f81bc3c5-2f58-491d-b140-84e57d3ac689-SGGIAfisY6HGvH68m8h8Aw',
            'Content-Type': 'application/json',
          },
        });

        toast.success('Call started successfully');
        console.log('Call response:', response.data);

      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.error('Error making call:', error.response.data);
          toast.error(`Error starting the call: ${error.response.data.message || 'Please try again.'}`);
        } else {
          console.error('Unexpected error:', error);
          toast.error('Unexpected error occurred. Please try again.');
        }
      } finally {
        setIsCallInProgress(false);
      }
    } else {
      toast.error('No campaign selected. Please select a campaign to start the call.');
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
      console.error('Error fetching call logs:', error);
      toast.error('Error fetching call logs. Please try again.');
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
                console.log('Making call for contact:', contact);

                const response = await axios.post('https://www.toingg.com/api/v3/make_call', requestBody, {
                  headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer tg_f81bc3c5-2f58-491d-b140-84e57d3ac689-SGGIAfisY6HGvH68m8h8Aw',
                    'Content-Type': 'application/json',
                  },
                });

                toast.success(`Call started for ${contact.Name}`);
                console.log('Call response for contact:', response.data);
              }
            } catch (error) {
              if (axios.isAxiosError(error) && error.response) {
                console.error('Error making call for contact:', contact, error.response.data);
                toast.error(`Error starting the call for ${contact.Name}: ${error.response.data.message || 'Please try again.'}`);
              } else {
                console.error('Unexpected error:', error);
                toast.error(`Unexpected error occurred for ${contact.Name}. Please try again.`);
              }
            }
          }
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          toast.error('Error parsing CSV file. Please try again.');
        },
      });
    }
  };

  console.log('Campaigns State:', campaigns);

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
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                      <span>View Details</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentCampaign(campaign);
                        setShowCallForm(true);
                        setShowCsvForm(true); 
                      }}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 flex items-center space-x-2"
                      disabled={isCallInProgress}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c-2.7 0-4.4 1.6-4.9 3.7-.2 1 .4 2.2 1.2 2.7 1.1.6 2.5.3 3.1-.7.7-1.3 2-2.3 3.5-2.3 2.3 0 4.1 1.8 4.1 4s-1.8 4.1-4.1 4.1-4.1-1.8-4.1-4.1m-6 0a10.5 10.5 0 0111.4-10.5m.6 8.5a10.6 10.6 0 01-.6-2.4 10.5 10.5 0 0110.6 10.6 10.5 10.5 0 01-10.6 10.6c-.8 0-1.5-.2-2.3-.6" />
                      </svg>
                      <span>Start Call</span>
                    </button>
                    <button
                      onClick={() => handleViewCallLogs(campaign.campaignId)}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16m-7 4h7m-7 4h7" />
                      </svg>
                      <span>View Call Logs</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


      {selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-3/4 max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Campaign Details</h2>
            <button onClick={handleCloseModal} className="absolute top-2 right-2 text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="space-y-2">
              <p><strong>Title:</strong> {selectedCampaign.title}</p>
              <p><strong>Voice:</strong> {selectedCampaign.voice}</p>
              <p><strong>Language:</strong> {selectedCampaign.language}</p>
              <p><strong>Script:</strong> {selectedCampaign.script}</p>
              <p><strong>Purpose:</strong> {selectedCampaign.purpose}</p>
              <p><strong>Knowledge Base:</strong> {selectedCampaign.knowledgeBase}</p>
              <p><strong>Calendar:</strong> {selectedCampaign.calendar}</p>
              <p><strong>First Line:</strong> {selectedCampaign.firstLine}</p>
              <p><strong>Tone:</strong> {selectedCampaign.tone}</p>
              <p><strong>Max Call Timeout:</strong> {selectedCampaign.maxCallTimeout}</p>
              <p><strong>Inactive Call Timeout:</strong> {selectedCampaign.inactiveCallTimeout}</p>
              <p><strong>Post Call Analysis:</strong> {selectedCampaign.postCallAnalysis ? 'Enabled' : 'Disabled'}</p>
              <p><strong>Post Call Analysis Schema:</strong> {JSON.stringify(selectedCampaign.postCallAnalysisSchema)}</p>
            </div>
          </div>
        </div>
      )}

      {showCallForm && currentCampaign && (
        <div className="mt-4 p-4 bg-gray-800 rounded">
          <h2 className="text-xl mb-2 font-bold">Call Details</h2>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={callDetails.name}
            onChange={handleInputChange}
            className="border border-gray-300 p-2 rounded mr-2"
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Enter phone number"
            value={callDetails.phoneNumber}
            onChange={handleInputChange}
            className="border border-gray-300 p-2 rounded"
          />
          <button
            onClick={handleMakeCall}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded ml-2"
            disabled={isCallInProgress}
          >
            Make Call
          </button>
        </div>
      )}

      {showCsvForm && currentCampaign && (
        <div className="mt-4 p-4 bg-gray-800 rounded">
          <h2 className="text-xl mb-2 font-bold">Upload CSV</h2>
          <input
            type="file"
            accept=".csv"
            onChange={handleCsvUpload}
            className="border border-gray-300 p-2 rounded"
          />
          <button
            onClick={handleParseCSV}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded ml-2"
            disabled={!csvFile}
          >
            Upload and Make Calls
          </button>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default CampaignTable;
