
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect to questionnaire after 3 seconds
    const timer = setTimeout(() => {
      navigate('/questionnaire/1');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-brand-50 to-brand-100 p-4">
      <Card className="max-w-md w-full shadow-xl border-brand-300 animate-fade-in">
        <CardHeader className="text-center bg-brand-600 text-white py-6 rounded-t-lg">
          <h1 className="text-3xl font-bold">ברוכים הבאים</h1>
          <p className="text-xl mt-2">לשאלון קורס פיתוח AI</p>
        </CardHeader>
        <CardContent className="pt-6 pb-4 px-6">
          <p className="text-center text-lg">
            אנו שמחים שהצטרפת לקורס שלנו!
            <br />
            השאלון הקצר יעזור לנו להכיר אותך טוב יותר.
          </p>
          <div className="flex justify-center mt-6">
            <div className="inline-block">
              <div className="flex space-x-1 rtl:space-x-reverse">
                <div className="w-2 h-2 bg-brand-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-brand-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-brand-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
              <p className="text-sm text-brand-700 mt-2">מועבר לשאלון באופן אוטומטי...</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pb-6 px-6 flex justify-center">
          <Button 
            className="bg-brand-600 hover:bg-brand-700 text-white"
            onClick={() => navigate('/questionnaire/1')}
          >
            התחל מיד
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LandingPage;
