import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ThankYouPage: React.FC = () => {
  const navigate = useNavigate();

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
            תודה רבה!
          </h1>
        </div>
      </div>

      <Card className="max-w-md w-full shadow-2xl border-2 border-gray-300 bg-white bg-opacity-95 mt-16 z-10">
        <CardHeader className="text-center py-8 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-t-lg">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800 border-2 border-blue-300">
            <CheckCircle className="h-10 w-10 text-blue-400" />
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 pb-6 px-8">
          <p className="text-center text-lg text-gray-800 font-medium">
            תשובותיך נשלחו בהצלחה.
            <br />
            אנו מעריכים את הזמן שהקדשת למילוי השאלון.
          </p>
          
          <div className="mt-8 p-5 bg-gray-100 rounded-md border border-gray-300 shadow-inner">
            <p className="text-base text-gray-700 text-center">
              המידע שסיפקת יעזור לנו לבחון את התאמתך לצרכי הגיוס שלנו.
              <br />
              מחלקת ה-hr שלנו תפנה אליך בקרוב לתיאום מועד לראיון ראשוני
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="pb-6 px-6 flex justify-center bg-gray-100 rounded-b-lg border-t border-gray-300">
          <Button 
            className="bg-gradient-to-r from-gray-700 to-blue-700 hover:from-gray-800 hover:to-blue-800 text-white px-6 py-2"
            onClick={() => navigate('/')}
          >
            חזרה לדף הבית
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ThankYouPage;
