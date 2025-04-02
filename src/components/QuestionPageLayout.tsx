
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuestionnaire } from '@/context/QuestionnaireContext';

type QuestionPageLayoutProps = {
  pageNumber: number;
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(e);
    
    if (isLastPage) {
      try {
        console.log('This is the last page, submitting questionnaire...');
        // The submission is already handled in the ContactInfoPage component
      } catch (error) {
        console.error('Error submitting questionnaire:', error);
      }
    } else {
      nextPage();
    }
  };

  return (
    <div className="container max-w-2xl py-8 animate-fade-in">
      <Card className="shadow-lg border-brand-300">
        <CardHeader className="bg-brand-100 border-b border-brand-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-brand-900">{title}</h2>
            <div className="text-sm text-brand-700">
              עמוד {pageNumber} מתוך {totalPages}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div 
              className="bg-brand-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${(pageNumber / totalPages) * 100}%` }}
            ></div>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6">
            {children}
          </CardContent>
          <CardFooter className="flex justify-between border-t border-brand-200 p-4">
            {pageNumber > 1 ? (
              <Button 
                variant="outline" 
                type="button" 
                onClick={prevPage}
                className="border-brand-300 text-brand-700 hover:bg-brand-50"
              >
                הקודם
              </Button>
            ) : (
              <div></div>
            )}
            <Button 
              type="submit" 
              className="bg-brand-600 hover:bg-brand-700 text-white"
            >
              {isLastPage ? 'שליחה' : 'הבא'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default QuestionPageLayout;
