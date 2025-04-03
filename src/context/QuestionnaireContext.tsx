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
  ipAddress: string | null;
  updateAnswers: (pageNum: number, pageAnswers: Record<string, any>) => void;
  updateContactInfo: (info: Record<string, any>) => void;
  nextPage: () => void;
  prevPage: () => void;
  submitQuestionnaire: () => Promise<void>;
  setUserId: (id: string | null) => void;
  setIpAddress: (ip: string | null) => void;
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
  const [ipAddress, setIpAddress] = useState<string | null>(null);
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
        if (parsedData.ipAddress) {
          setIpAddress(parsedData.ipAddress);
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
        userId,
        ipAddress
      }));
    }
  }, [answers, contactInfo, userId, ipAddress]);

  // Removed auto-save effect - now we'll save explicitly with each page submission

  const updateAnswers = async (pageNum: number, pageAnswers: Record<string, any>) => {
    // שמירת המידע בצד הלקוח עם שילוב של הנתונים החדשים עם הקיימים
    const newAnswers = { ...answers, ...pageAnswers };
    setAnswers(newAnswers);
    
    // שמירת המידע בצד השרת
    if (userId) {
      try {
        // שמירת כל הנתונים של המשתמש, כולל המידע החדש
        await saveQuestionnaireData({
          page: pageNum,
          answers: pageAnswers, // רק התשובות של הדף הנוכחי
          is_submitted: false,
          user_id: userId,
          ip_address: ipAddress
        });
        console.log(`Data for page ${pageNum} saved to Supabase`);
      } catch (error) {
        console.error(`Failed to save data for page ${pageNum}:`, error);
      }
    }
  };

  const updateContactInfo = (info: Record<string, any>) => {
    setContactInfo(info);
    
    // Save contact info to Supabase
    if (userId) {
      try {
        saveQuestionnaireData({
          page: 4, // Contact info is always page 4
          contact_info: info,
          is_submitted: false,
          user_id: userId,
          ip_address: ipAddress
        });
        console.log('Contact info saved to Supabase');
      } catch (error) {
        console.error('Failed to save contact info:', error);
      }
    }
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

      // Submit all pages with is_submitted=true
      for (let page = 1; page <= totalPages; page++) {
        let pageData: Partial<QuestionnaireEntry> = {
          page: page,
          is_submitted: true,
          user_id: userId,
          ip_address: ipAddress
        };
        
        // Add page-specific data
        if (page === 4) {
          // Contact info page - שמירת פרטי התקשרות
          pageData.contact_info = contactInfo;
        } else {
          // Get relevant answers for this page
          const pageAnswers: Record<string, any> = {};
          
          // Filter answers based on the page
          if (page === 1) {
            // Professional questions - שאלות מקצועיות
            const professionalKeys = [
              'aiExperience', 'programmingSkill', 'educationLevel',
              'specializations', 'preferredLearningMethod', 'professionalBackground',
              'dataScience', 'careerStage'
            ];
            
            professionalKeys.forEach(key => {
              if (answers[key] !== undefined) pageAnswers[key] = answers[key];
            });
          } else if (page === 2) {
            // Personal questions - שאלות אישיות
            const personalKeys = [
              'learningPurpose', 'personalityType', 'workPreference',
              'challengeHandling', 'decisionMaking', 'feedbackPreference',
              'motivationSource', 'stressManagement'
            ];
            
            personalKeys.forEach(key => {
              if (answers[key] !== undefined) pageAnswers[key] = answers[key];
            });
          } else if (page === 3) {
            // Value add questions - שאלות ערך מוסף
            const valueAddKeys = [
              'investmentPriority', 'learningChallenges', 'growthAreas',
              'careerVision', 'valueAssessment', 'teamPreference',
              'ethicalConcerns', 'futureOutlook'
            ];
            
            valueAddKeys.forEach(key => {
              if (answers[key] !== undefined) pageAnswers[key] = answers[key];
            });
          }
          
          pageData.answers = pageAnswers;
        }
        
        // Save this page's data
        await saveQuestionnaireData(pageData);
      }
      
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
    ipAddress,
    updateAnswers,
    updateContactInfo,
    nextPage,
    prevPage,
    submitQuestionnaire,
    setUserId,
    setIpAddress,
    totalPages
  };

  return (
    <QuestionnaireContext.Provider value={value}>
      {children}
    </QuestionnaireContext.Provider>
  );
};
