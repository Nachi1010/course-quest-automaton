
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveQuestionnaireData, checkUserExists, QuestionnaireEntry } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

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
  totalPages: number;
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
  const totalPages = 4;

  // Generate or load user ID on initial load
  useEffect(() => {
    const savedData = localStorage.getItem('questionnaire_data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.answers) setAnswers(parsedData.answers);
        if (parsedData.contactInfo) setContactInfo(parsedData.contactInfo);
        if (parsedData.userId) {
          setUserId(parsedData.userId);
        } else {
          const newUserId = uuidv4();
          setUserId(newUserId);
        }
      } catch (error) {
        console.error('Error parsing saved questionnaire data:', error);
        const newUserId = uuidv4();
        setUserId(newUserId);
      }
    } else {
      const newUserId = uuidv4();
      setUserId(newUserId);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (userId) {
      localStorage.setItem('questionnaire_data', JSON.stringify({
        answers,
        contactInfo,
        userId
      }));
    }
  }, [answers, contactInfo, userId]);

  // Auto-save data to Supabase whenever answers or contactInfo change
  useEffect(() => {
    if (userId && (Object.keys(answers).length > 0 || Object.keys(contactInfo).length > 0)) {
      const saveData = async () => {
        try {
          await saveQuestionnaireData({
            page: currentPage,
            answers: answers,
            contact_info: contactInfo,
            is_submitted: isSubmitted,
            user_id: userId
          });
          console.log('Data auto-saved to Supabase');
        } catch (error) {
          console.error('Failed to auto-save data:', error);
        }
      };
      
      // Use a debounce-like approach with setTimeout
      const timer = setTimeout(saveData, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [answers, contactInfo, currentPage, userId, isSubmitted]);

  const updateAnswers = async (pageNum: number, pageAnswers: Record<string, any>) => {
    const newAnswers = { ...answers, ...pageAnswers };
    setAnswers(newAnswers);
    
    // We'll now rely on the auto-save effect to save the data to Supabase
  };

  const updateContactInfo = (info: Record<string, any>) => {
    setContactInfo(info);
    // Auto-save effect will save to Supabase
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
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
      if (!userId) {
        console.error('User ID is missing');
        toast({
          title: "אירעה שגיאה",
          description: "מזהה משתמש חסר, אנא טען מחדש את הדף",
          variant: "destructive",
        });
        return Promise.reject(new Error('User ID is missing'));
      }

      // Always submit with current data, regardless of completion
      await saveQuestionnaireData({
        page: currentPage,
        answers,
        contact_info: contactInfo,
        is_submitted: true,
        user_id: userId
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
    setUserId,
    totalPages
  };

  return (
    <QuestionnaireContext.Provider value={value}>
      {children}
    </QuestionnaireContext.Provider>
  );
};
