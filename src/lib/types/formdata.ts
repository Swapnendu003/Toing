
export interface FormData {
    title: string;
    voice: string;
    language: string;
    script: string;
    purpose: string;
    knowledgeBase: string;
    calendar: string;
    firstLine: string;
    tone: string;
    postCallAnalysis: boolean;
    postCallAnalysisSchema: object;
  }
  
  export interface FormStep {
    question: string;
    inputType: 'text' | 'textarea' | 'select';
    inputName: keyof FormData;
    options?: string[];
  }
  