import React, { useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuestionnaire } from '@/context/QuestionnaireContext';
import { useNavigate } from 'react-router-dom';

type QuestionPageLayoutProps = {
  pageNumber: number;
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => Promise<boolean> | boolean;
  isLastPage?: boolean;
};

const QuestionPageLayout: React.FC<QuestionPageLayoutProps> = ({
  pageNumber,
  title,
  children,
  onSubmit,
  isLastPage = false
}) => {
  const { prevPage, nextPage, submitQuestionnaire, totalPages } = useQuestionnaire();
  const navigate = useNavigate();

  useEffect(() => {
    // Reset scroll position to top when component mounts/updates
    window.scrollTo(0, 0);
  }, [pageNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = await onSubmit(e) !== false;
    
    if (isLastPage) {
      if (isValid) {
        try {
          console.log('This is the last page, submitting questionnaire...');
          await submitQuestionnaire();
          navigate('/thank-you');
        } catch (error) {
          console.error('Error submitting questionnaire:', error);
        }
      }
    } else if (isValid) {
      nextPage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col" 
         style={{
           backgroundImage: `url('/D.jpeg')`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed',
           backgroundRepeat: 'no-repeat'
         }}>
      {/* Top header with full overlay */}
      <div className="relative w-full"
           style={{
             height: '220px',
             background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.7) 70%, rgba(0, 0, 0, 0.6) 100%)',
             borderBottom: '3px solid rgba(0, 0, 0, 0.5)',
             boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
           }}>
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0"
             style={{
               backgroundImage: `url('/חח.jpg')`,
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               opacity: '0.4',
               mixBlendMode: 'overlay'
             }}>
        </div>
        
        {/* Logo and Tagline */}
        <div className="absolute top-6 left-6 flex flex-col items-center z-10">
          <img src="/2.png" alt="Logo" className="h-24 w-auto drop-shadow-lg" />
          <p className="text-sm mt-2 text-yellow-400 font-bold drop-shadow-md">
            The AI is closer now
          </p>
        </div>
        
        {/* Centered Title - Improved styling */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white px-12 py-5 rounded-md shadow-2xl" 
                style={{
                  background: 'linear-gradient(to right, rgba(0, 0, 0, 0.1), rgba(30, 41, 59, 0.6), rgba(0, 0, 0, 0.1))',
                  borderBottom: '3px solid #4a90e2',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                  maxWidth: '90%',
                  margin: '0 auto'
                }}>
              {title}
            </h1>
            <div className="mt-3 text-white text-lg font-medium">
              שלב {pageNumber} מתוך {totalPages}
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress bar section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 px-6 shadow-md">
        <div className="container max-w-2xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="w-full">
              <div className="w-full bg-gray-600 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${(pageNumber / totalPages) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container max-w-2xl py-6 mx-auto flex-grow">
        <form onSubmit={handleSubmit} className="space-y-6">
          {children}
          
          <div className="flex justify-between bg-gray-800 bg-opacity-75 p-4 rounded-lg shadow-lg mt-8">
            {pageNumber > 1 ? (
              <Button 
                variant="outline" 
                type="button" 
                onClick={prevPage}
                className="border-gray-400 bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                הקודם
              </Button>
            ) : (
              <div></div>
            )}
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-gray-700 to-blue-700 hover:from-gray-800 hover:to-blue-800 text-white"
            >
              {isLastPage ? 'שליחה' : 'הבא'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionPageLayout;
