'use client'
import React from 'react';

export interface CampaignFormStepProps {
  question: string;
  inputType: 'text' | 'select' | 'textarea';
  inputName: string;
  inputValue: string | boolean | object;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onNext: () => void;
  options?: string[];
}

const CampaignFormStep: React.FC<CampaignFormStepProps> = ({
  question,
  inputType,
  inputName,
  inputValue,
  onInputChange,
  onNext,
  options,
}) => {
  const renderInput = () => {
    switch (inputType) {
      case 'text':
        return (
          <input
            type="text"
            name={inputName}
            value={typeof inputValue === 'string' ? inputValue : ''}
            onChange={onInputChange}
            className="border border-gray-300 p-2 rounded w-full text-black"
          />
        );
      case 'select':
        return (
          <select
            name={inputName}
            value={typeof inputValue === 'string' ? inputValue : ''}
            onChange={onInputChange}
            className="border border-gray-300 p-2 rounded w-full text-black"
          >
            {options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'textarea':
        return (
          <textarea
            name={inputName}
            value={typeof inputValue === 'string' ? inputValue : ''}
            onChange={onInputChange}
            className="border border-gray-300 p-2 rounded w-full text-black"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-gray- font-semibold mb-2">{question}</label>
      {renderInput()}
      <button
        type="button"
        onClick={onNext}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Next
      </button>
    </div>
  );
};

export default CampaignFormStep;
