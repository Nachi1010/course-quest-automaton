import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useQuestionnaire } from '@/context/QuestionnaireContext';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setIpAddress } = useQuestionnaire();

  // Fetch the user's IP address
  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        // Using ipify API to get the user's IP address
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        
        if (data.ip) {
          console.log('User IP address:', data.ip);
          setIpAddress(data.ip);
        }
      } catch (error) {
        console.error('Error fetching IP address:', error);
      }
    };

    fetchIpAddress();
  }, [setIpAddress]);

  useEffect(() => {
    // Auto-redirect to questionnaire after 5 seconds
    const timer = setTimeout(() => {
      navigate('/questionnaire/1');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" 
         style={{
           backgroundImage: `url('/D.jpeg')`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>
      {/* Top header with logo and background image */}
      <div className="absolute top-0 left-0 right-0 h-48 w-full"
           style={{
             backgroundImage: `url('/חח.jpg')`,
             backgroundSize: 'cover',
             backgroundPosition: 'center'
           }}>
        {/* Logo and Tagline */}
        <div className="absolute top-4 left-4 flex flex-col items-center">
          <img src="/2.png" alt="Logo" className="h-20 w-auto" />
          <p className="text-sm mt-2" style={{color: '#b8860b', fontWeight: 'bold'}}>
            The AI is closer now
          </p>
        </div>
        
        {/* Centered Title */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-3xl font-bold text-white bg-gray-800 bg-opacity-70 px-8 py-3 rounded-lg shadow-lg" 
              style={{borderBottom: '3px solid #4a90e2'}}>
            ברוכים הבאים
          </h1>
        </div>
      </div>

      <Card className="max-w-md w-full shadow-2xl border-2 border-gray-300 bg-white bg-opacity-95 mt-16 z-10">
        <CardHeader className="text-center bg-gradient-to-r from-gray-700 to-gray-900 text-white py-6 rounded-t-lg">
          <p className="text-xl">ההכשרה לפיתוח AI המתקדמת בישראל</p>
        </CardHeader>
        <CardContent className="pt-6 pb-4 px-8">
          <p className="text-center text-lg text-gray-800">
            תודה שבחרת להצטרף אלינו למסע המרתק לעולם הבינה המלאכותית
            <br />
            השאלון הקצר שלפניך יעזור לנו לוודא את הקורס באופן אישי את התאמת התכנית לצרכים שלך
          </p>
          <div className="mt-8 p-4 bg-gray-100 rounded-md border border-gray-300 shadow-inner">
            <p className="text-base text-gray-700 font-medium text-center">
              תכנית המציעה חווית למידה ייחודית המשלבת ידע תיאורטי ויישום מעשי בתחומי ה-AI  המתקדמים ביותר עם משרה מובטחת בסיום
            </p>
          </div>
          <div className="flex justify-center mt-8">
            <div className="inline-block">
              <div className="flex space-x-1 rtl:space-x-reverse">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">מועבר לשאלון באופן אוטומטי...</p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pb-6 px-6 flex justify-center bg-gray-100 rounded-b-lg border-t border-gray-300">
          <Button 
            className="bg-gradient-to-r from-gray-700 to-blue-700 hover:from-gray-800 hover:to-blue-800 text-white px-6 py-2"
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
