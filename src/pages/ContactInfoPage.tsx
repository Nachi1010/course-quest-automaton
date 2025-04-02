
import React, { useState, useEffect } from 'react';
import { useQuestionnaire } from '@/context/QuestionnaireContext';
import QuestionPageLayout from '@/components/QuestionPageLayout';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { checkUserExists } from '@/lib/supabase';

const ContactInfoPage: React.FC = () => {
  const { contactInfo, updateContactInfo, submitQuestionnaire } = useQuestionnaire();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: contactInfo.email || '',
    phone: contactInfo.phone || '',
    fullName: contactInfo.fullName || '',
    bestContactTime: contactInfo.bestContactTime || '',
    additionalInfo: contactInfo.additionalInfo || '',
    agreeToTerms: contactInfo.agreeToTerms || false,
    wantsUpdates: contactInfo.wantsUpdates || false,
  });

  // Validation state
  const [errors, setErrors] = useState({
    email: '',
    phone: '',
  });

  // Load data if exists
  useEffect(() => {
    if (contactInfo && Object.keys(contactInfo).length > 0) {
      setFormData({
        email: contactInfo.email || '',
        phone: contactInfo.phone || '',
        fullName: contactInfo.fullName || '',
        bestContactTime: contactInfo.bestContactTime || '',
        additionalInfo: contactInfo.additionalInfo || '',
        agreeToTerms: contactInfo.agreeToTerms || false,
        wantsUpdates: contactInfo.wantsUpdates || false,
      });
    }
  }, [contactInfo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear errors when user corrects input
    if (name === 'email' || name === 'phone') {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const validateEmail = (email: string): boolean => {
    if (!email) return true; // Optional, but if provided must be valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // Optional, but if provided must be valid
    const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{9,10}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { email: '', phone: '' };

    // At least one contact method is required
    if (!formData.email && !formData.phone) {
      newErrors.email = 'יש לספק לפחות אמצעי תקשורת אחד (אימייל או טלפון)';
      newErrors.phone = 'יש לספק לפחות אמצעי תקשורת אחד (אימייל או טלפון)';
      isValid = false;
    } else {
      // Validate email if provided
      if (formData.email && !validateEmail(formData.email)) {
        newErrors.email = 'כתובת האימייל אינה תקינה';
        isValid = false;
      }
      
      // Validate phone if provided
      if (formData.phone && !validatePhone(formData.phone)) {
        newErrors.phone = 'מספר הטלפון אינו תקין';
        isValid = false;
      }
    }

    // Terms agreement is required
    if (!formData.agreeToTerms) {
      toast({
        title: "הסכמה לתנאים נדרשת",
        description: "יש לאשר את תנאי השימוש כדי להמשיך",
        variant: "destructive",
      });
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Check if user exists in registration_data
      if (formData.email || formData.phone) {
        const existingUserId = await checkUserExists(formData.email, formData.phone);
        console.log('Existing user check:', existingUserId);
      }
      
      // Update contact info in context
      updateContactInfo(formData);
      
      // Submit the questionnaire
      await submitQuestionnaire();
      
    } catch (error) {
      console.error('Error submitting contact information:', error);
      toast({
        title: "שגיאה בשליחת הנתונים",
        description: "אירעה שגיאה בעת שליחת הנתונים. אנא נסה שוב מאוחר יותר.",
        variant: "destructive",
      });
    }
  };

  return (
    <QuestionPageLayout
      pageNumber={4}
      title="פרטי התקשרות"
      onSubmit={handleSubmit}
      isLastPage={true}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">שם מלא</Label>
          <Input 
            id="fullName" 
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="ישראל ישראלי"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">כתובת דוא״ל</Label>
          <Input 
            id="email" 
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your.email@example.com"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">מספר טלפון</Label>
          <Input 
            id="phone" 
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="050-1234567"
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bestContactTime">זמן מועדף ליצירת קשר</Label>
          <Input 
            id="bestContactTime" 
            name="bestContactTime"
            value={formData.bestContactTime}
            onChange={handleInputChange}
            placeholder="בוקר / צהריים / ערב"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalInfo">מידע נוסף שברצונך לשתף</Label>
          <Textarea 
            id="additionalInfo" 
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleInputChange}
            placeholder="כל מידע נוסף שיכול לסייע לנו..."
            className="min-h-[100px]"
          />
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Checkbox 
            id="wantsUpdates" 
            checked={formData.wantsUpdates}
            onCheckedChange={(checked) => handleCheckboxChange('wantsUpdates', checked === true)}
          />
          <Label htmlFor="wantsUpdates" className="text-sm">
            אני מעוניין/ת לקבל עדכונים על קורסים והזדמנויות נוספות
          </Label>
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Checkbox 
            id="agreeToTerms" 
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) => handleCheckboxChange('agreeToTerms', checked === true)}
          />
          <Label htmlFor="agreeToTerms" className="text-sm">
            אני מסכים/ה לתנאי השימוש ומדיניות הפרטיות *
          </Label>
        </div>
      </div>
    </QuestionPageLayout>
  );
};

export default ContactInfoPage;
