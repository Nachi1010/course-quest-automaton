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

  // Removed auto-save effect - now we'll save explicitly with each page submission

  const updateAnswers = async (pageNum: number, pageAnswers: Record<string, any>) => {
    const newAnswers = { ...answers, ...pageAnswers };
    setAnswers(newAnswers);
    
    // Save this page's data to Supabase
    if (userId) {
      try {
        await saveQuestionnaireData({
          page: pageNum,
          answers: pageAnswers, // Only save this page's answers
          is_submitted: false,
          user_id: userId
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
          user_id: userId
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
          user_id: userId
        };
        
        // Add page-specific data
        if (page === 4) {
          // Contact info page
          pageData.contact_info = contactInfo;
        } else {
          // Get relevant answers for this page
          const pageAnswers: Record<string, any> = {};
          
          // Filter answers based on the page
          if (page === 1) {
            // Professional questions
            const professionalKeys = [
              'yearsExperience', 'programmingLanguages', 'aiExperience',
              'preferredLearningMethod', 'projectGoals', 'educationLevel',
              'softwareDevelopmentRoles', 'companySize', 'industryExperience',
              'dataScience', 'frameworks', 'cloudPlatforms', 'aiModelsUsed'
            ];
            
            professionalKeys.forEach(key => {
              if (answers[key] !== undefined) pageAnswers[key] = answers[key];
            });
          } else if (page === 2) {
            // Personal questions
            const personalKeys = [
              'motivations', 'workStyle', 'learningChallenges', 'timeCommitment',
              'strengths', 'learningEnvironment', 'learningGoals', 'previousAiCourses',
              'careerAspirations', 'learningObstacles', 'communicationPreference',
              'feedbackPreference'
            ];
            
            personalKeys.forEach(key => {
              if (answers[key] !== undefined) pageAnswers[key] = answers[key];
            });
          } else if (page === 3) {
            // Value add questions
            const valueAddKeys = [
              'industryInterests', 'aiEthics', 'futurePlans', 'aiImpact',
              'dataPrivacy', 'aiRegulation', 'futureAiTrends', 'aiChallenges',
              'aiToolsUsage', 'aiEducationMethod'
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
