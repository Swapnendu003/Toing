import axios from 'axios';

const BASE_URL = 'https://www.toingg.com/api/v3';
const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN';  // Replace with your actual token

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export const makeCall = (name: string, phoneNumber: string, campID: string) =>
  api.post('/make_call', { name, phoneNumber, campID });

export const getCallStatus = (callId: string) =>
  api.get(`/call_status?callId=${callId}`);

export const getTranscription = (callId: string) =>
  api.get(`/get_transcription?callId=${callId}`);

export const getPostCallAnalysis = (callId: string) =>
  api.get(`/get_post_call_analysis?callId=${callId}`);
