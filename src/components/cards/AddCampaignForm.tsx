'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CampaignFormStep from './CampaignFormStep';
import { FormData, FormStep } from '@/lib/types/formdata';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AddCampaignFormProps {
  onClose: () => void;
}

const AddCampaignForm: React.FC<AddCampaignFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    voice: '',
    language: '',
    script: '',
    purpose: '',
    knowledgeBase: '',
    calendar: '10Am to 10Pm IST',
    firstLine: '',
    tone: '',
    postCallAnalysis: false,
    postCallAnalysisSchema: {},
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [voices, setVoices] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await axios.get('https://www.toingg.com/api/v3/get_supported_voices', {
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer tg_f81bc3c5-2f58-491d-b140-84e57d3ac689-SGGIAfisY6HGvH68m8h8Aw'
          },
        });
        const voiceNames = response.data.result.voice.map((voice: { name: string }) => voice.name);
        setVoices(voiceNames);
      } catch (error) {
        console.error('Error fetching voices:', error);
      }
    };

    const fetchLanguages = async () => {
      try {
        const response = await axios.get('https://www.toingg.com/api/v3/get_supported_languages', {
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer tg_f81bc3c5-2f58-491d-b140-84e57d3ac689-SGGIAfisY6HGvH68m8h8Aw',
          },
        });
        const languageNames = response.data.result.languages;
        setLanguages(languageNames);
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };

    fetchVoices();
    fetchLanguages();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value } as Pick<FormData, keyof FormData>);
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    if (formData.script.length < 200) {
      toast.error('The script must have at least 200 characters.');
      return;
    }

    if (!formData.title || !formData.voice || !formData.language || !formData.script) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      console.log('Submitting form data:', JSON.stringify(formData, null, 2)); // Debugging log
      const response = await axios.post('https://www.toingg.com/api/v3/create_campaign/', formData, {
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer tg_f81bc3c5-2f58-491d-b140-84e57d3ac689-SGGIAfisY6HGvH68m8h8Aw',
          'Content-Type': 'application/json',
        },
      });

      if (response.data.status) {
                                                             
        const campaignId = response.data.result.campaignId;
        const newCampaign = { ...formData, campaignId };
        const existingCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
        existingCampaigns.push(newCampaign);
        localStorage.setItem('campaigns', JSON.stringify(existingCampaigns));

        toast.success('Your campaign has been submitted successfully');
        console.log('Response data:', response.data);
        onClose();
      } else {
        toast.error('Failed to create the campaign.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error submitting campaign:', error.response ? error.response.data : error.message);
        toast.error('There was an error submitting your campaign. Please try again.');
      } else {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  const steps: FormStep[] = [
    { question: 'Add the name of your Campaign', inputType: 'text', inputName: 'title' },
    { question: 'Select the Voice', inputType: 'select', inputName: 'voice', options: voices },
    { question: 'Select the Language', inputType: 'select', inputName: 'language', options: languages },
    { question: 'Add the Script (min 200 characters)', inputType: 'textarea', inputName: 'script' },
    { question: 'Add the Purpose', inputType: 'text', inputName: 'purpose' },
    { question: 'Add the Knowledge Base', inputType: 'text', inputName: 'knowledgeBase' },
    { question: 'Add the Calendar', inputType: 'text', inputName: 'calendar' },
    { question: 'Add the First Line', inputType: 'text', inputName: 'firstLine' },
    { question: 'Add the Tone', inputType: 'text', inputName: 'tone' },
  ];

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-gray-800 text-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-3/4 max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
        >
          X
        </button>
        {currentStep < steps.length ? (
          <CampaignFormStep
            question={currentStepData.question}
            inputType={currentStepData.inputType}
            inputName={currentStepData.inputName}
            inputValue={formData[currentStepData.inputName] as string} 
            onInputChange={handleInputChange}
            onNext={handleNextStep}
            options={currentStepData.options}
          />
        ) : (
          <button
            onClick={handleSubmit}
            className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Submit
          </button>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default AddCampaignForm;
