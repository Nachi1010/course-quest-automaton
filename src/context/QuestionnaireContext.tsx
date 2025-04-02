
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveQuestionnaireData, QuestionnaireEntry } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

type QuestionnaireContextType = {
  answers: Record<string, any>;
  contactInfo: Record<string, any>;
  currentPage: number;
  isSubmitted: boolean;
  userId: string | null;
  updateAnswers: (pageNum: number, pageAnswers: Record<string, any>) => void;
  updateContactInfo: (info: Record<string, any>) => void;
  nextPage: () => void;
  prevPage: () => void;
  submitQuestionnaire: () => Promise<void>;
  setUserId: (id: string | null) => void;
};

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

export const useQuestionnaire = () => {
  const context = useContext(QuestionnaireContext);
  if (!context) {
    throw new Error('useQuestionnaire must be used within a QuestionnaireProvider');
  }
  return context;
};

export const QuestionnaireProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [contactInfo, setContactInfo] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load saved data from localStorage on initial load
  useEffect(() => {
    const savedData = localStorage.getItem('questionnaire_data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.answers) setAnswers(parsedData.answers);
        if (parsedData.contactInfo) setContactInfo(parsedData.contactInfo);
        if (parsedData.userId) setUserId(parsedData.userId);
      } catch (error) {
        console.error('Error parsing saved questionnaire data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('questionnaire_data', JSON.stringify({
      answers,
      contactInfo,
      userId
    }));
  }, [answers, contactInfo, userId]);

  const updateAnswers = async (pageNum: number, pageAnswers: Record<string, any>) => {
    const newAnswers = { ...answers, ...pageAnswers };
    setAnswers(newAnswers);
    
    // Save to Supabase after each page update
    try {
      await saveQuestionnaireData({
        page: pageNum,
        answers: newAnswers,
        contact_info: contactInfo,
        is_submitted: isSubmitted,
        user_id: userId || undefined
      });
    } catch (error) {
      console.error('Failed to save answers:', error);
      toast({
        title: "שגיאה בשמירת התשובות",
        description: "אירעה שגיאה בשמירת התשובות שלך. אנא נסה שוב.",
        variant: "destructive",
      });
    }
  };

  const updateContactInfo = (info: Record<string, any>) => {
    setContactInfo(info);
  };

  const nextPage = () => {
    if (currentPage < 3) {
      setCurrentPage(currentPage + 1);
      navigate(`/questionnaire/${currentPage + 1}`);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      navigate(`/questionnaire/${currentPage - 1}`);
    }
  };

  const submitQuestionnaire = async () => {
    try {
      await saveQuestionnaireData({
        page: currentPage,
        answers,
        contact_info: contactInfo,
        is_submitted: true,
        user_id: userId || undefined
      });
      setIsSubmitted(true);
      navigate('/thank-you');
      
      toast({
        title: "השאלון הוגש בהצלחה!",
        description: "תודה על השתתפותך.",
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to submit questionnaire:', error);
      toast({
        title: "שגיאה בהגשת השאלון",
        description: "אירעה שגיאה בהגשת השאלון שלך. אנא נסה שוב.",
        variant: "destructive",
      });
      
      return Promise.reject(error);
    }
  };

  const value = {
    answers,
    contactInfo,
    currentPage,
    isSubmitted,
    userId,
    updateAnswers,
    updateContactInfo,
    nextPage,
    prevPage,
    submitQuestionnaire,
    setUserId
  };

  return (
    <QuestionnaireContext.Provider value={value}>
      {children}
    </QuestionnaireContext.Provider>
  );
};
