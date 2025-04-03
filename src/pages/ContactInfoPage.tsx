import React, { useState, useEffect } from 'react';
import { useQuestionnaire } from '@/context/QuestionnaireContext';
import QuestionPageLayout from '@/components/QuestionPageLayout';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  additionalInfo: string;
  hrInfo: string;
};

// המיפוי של שמות השדות באנגלית לתיאור בעברית
const hebrewFieldNames = {
  fullName: "שם מלא",
  email: "כתובת אימייל",
  phone: "מספר טלפון",
  additionalInfo: "מידע נוסף",
  hrInfo: "פרטי מחלקת משאבי אנוש",
};

const ContactInfoPage: React.FC = () => {
  const { answers, updateAnswers } = useQuestionnaire();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    additionalInfo: '',
    hrInfo: '',
  });
  const [showValidationMessage, setShowValidationMessage] = useState(false);
  const [errorFields, setErrorFields] = useState<string[]>([]);

  useEffect(() => {
    // Load saved data if available
    if (answers && Object.keys(answers).length > 0) {
      setFormData({
        fullName: answers.fullName || '',
        email: answers.email || '',
        phone: answers.phone || '',
        additionalInfo: answers.additionalInfo || '',
        hrInfo: answers.hrInfo || '',
      });
    }
  }, [answers]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation message when user starts typing
    if (showValidationMessage) {
      setShowValidationMessage(false);
      setErrorFields([]);
    }
  };

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // Basic Israeli phone number validation (allows formats like: 05X-XXXXXXX, 05XXXXXXXX, etc.)
    const re = /^0(5\d|[23489])\d{7,8}$/;
    return re.test(phone.replace(/-/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // המרת שמות השדות באנגלית לתיאור בעברית
    const hebrewFormData: Record<string, string> = {};
    
    // עבור כל שדה בטופס, שמור את הערך ואת שם השדה בעברית
    (Object.keys(formData) as Array<keyof FormData>).forEach(field => {
      const value = formData[field];
      // שמור את הערך המקורי עם שם שדה מתורגם
      hebrewFormData[hebrewFieldNames[field] || field] = value;
    });
    
    // Always save data regardless of validation
    await updateAnswers(4, hebrewFormData);
    
    const errors: string[] = [];
    
    if (!formData.fullName.trim()) {
      errors.push('fullName');
    }
    
    // Require at least one contact method (email or phone)
    const validEmail = formData.email ? validateEmail(formData.email) : false;
    const validPhone = formData.phone ? validatePhone(formData.phone) : false;
    
    if (!validEmail && !validPhone) {
      if (formData.email) errors.push('email');
      if (formData.phone) errors.push('phone');
      if (!formData.email && !formData.phone) errors.push('contact');
    }
    
    if (errors.length > 0) {
      setErrorFields(errors);
      setShowValidationMessage(true);
      return false; // Block navigation
    }
    
    return true; // Allow navigation to next page
  };

  return (
    <QuestionPageLayout
      pageNumber={4}
      title="פרטי התקשרות"
      onSubmit={handleSubmit}
      isLastPage={true}
    >
      {showValidationMessage && (
        <Alert className="mb-6 bg-red-50 border-red-200 text-red-800">
          <InfoIcon className="h-5 w-5 ml-2" />
          <AlertDescription>
            לא ניתן להמשיך לדף הסיכום. אנא מלא/י את השדות המסומנים: יש לספק שם מלא ולפחות פרט התקשרות אחד תקין (טלפון או אימייל).
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            <Label htmlFor="fullName" className={`text-xl font-bold text-gray-900 block mb-3 ${errorFields.includes('fullName') ? 'text-red-600' : ''}`}>
              שם מלא *
            </Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className={`text-right ${errorFields.includes('fullName') ? 'border-red-500' : ''}`}
              placeholder="הכנס/י את שמך המלא"
              dir="rtl"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            <Label htmlFor="email" className={`text-xl font-bold text-gray-900 block mb-3 ${errorFields.includes('email') || errorFields.includes('contact') ? 'text-red-600' : ''}`}>
              אימייל *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`text-right ${errorFields.includes('email') || errorFields.includes('contact') ? 'border-red-500' : ''}`}
              placeholder="your@email.com"
              dir="rtl"
            />
            {(errorFields.includes('email') && !errorFields.includes('contact')) && (
              <p className="text-red-600 text-sm mt-1">כתובת אימייל לא תקינה</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            <Label htmlFor="phone" className={`text-xl font-bold text-gray-900 block mb-3 ${errorFields.includes('phone') || errorFields.includes('contact') ? 'text-red-600' : ''}`}>
              טלפון *
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`text-right ${errorFields.includes('phone') || errorFields.includes('contact') ? 'border-red-500' : ''}`}
              placeholder="050-0000000"
              dir="rtl"
            />
            {(errorFields.includes('phone') && !errorFields.includes('contact')) && (
              <p className="text-red-600 text-sm mt-1">מספר טלפון לא תקין</p>
            )}
            {errorFields.includes('contact') && (
              <p className="text-red-600 text-sm mt-1">יש לספק לפחות פרטי התקשרות אחד תקין (טלפון או אימייל)</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            <Label htmlFor="additionalInfo" className="text-xl font-bold text-gray-900 block mb-3">
              מידע נוסף (אופציונלי)
            </Label>
            <Textarea
              id="additionalInfo"
              value={formData.additionalInfo}
              onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
              className="text-right min-h-[100px]"
              placeholder="הוסף/י כל מידע נוסף שיעזור לנו לבחון את התאמת התכנית עבורך"
              dir="rtl"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            <Label htmlFor="hrInfo" className="text-xl font-bold text-gray-900 block mb-3">
              פרטי מחלקת משאבי אנוש (אופציונלי)
            </Label>
            <Textarea
              id="hrInfo"
              value={formData.hrInfo}
              onChange={(e) => handleInputChange('hrInfo', e.target.value)}
              className="text-right min-h-[100px]"
              placeholder="כל דבר נוסף שכדאי שמחלקת ה-hr שלנו תדע"
              dir="rtl"
            />
          </div>
        </div>
      </div>
    </QuestionPageLayout>
  );
};

export default ContactInfoPage;
