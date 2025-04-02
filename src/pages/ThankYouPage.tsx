
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ThankYouPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-brand-50 to-brand-100 p-4">
      <Card className="max-w-md w-full shadow-xl border-brand-300 animate-fade-in">
        <CardHeader className="text-center py-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100">
            <CheckCircle className="h-10 w-10 text-brand-600" />
          </div>
          <h1 className="text-3xl font-bold text-brand-900">תודה רבה!</h1>
        </CardHeader>
        
        <CardContent className="pt-0 pb-6 px-6">
          <p className="text-center text-lg">
            תשובותיך נשלחו בהצלחה.
            <br />
            אנו מעריכים את הזמן שהקדשת למילוי השאלון.
          </p>
          
          <div className="mt-6 p-4 bg-brand-50 rounded-md border border-brand-100">
            <p className="text-sm text-center text-brand-700">
              המידע שסיפקת יעזור לנו להתאים את הקורס לצרכים שלך ושל משתתפים אחרים.
              <br />
              נעדכן אותך בקרוב עם מידע נוסף.
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="pb-6 px-6 flex justify-center">
          <Button 
            className="bg-brand-600 hover:bg-brand-700 text-white"
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
