
import React, { useState, useEffect } from 'react';
import { useQuestionnaire } from '@/context/QuestionnaireContext';
import QuestionPageLayout from '@/components/QuestionPageLayout';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';

const ValueAddQuestionsPage: React.FC = () => {
  const { answers, updateAnswers } = useQuestionnaire();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    industryInterests: answers.industryInterests || '',
    aiEthics: answers.aiEthics || '',
    futurePlans: answers.futurePlans || '',
    contactEmail: answers.contactEmail || '',
    receiveUpdates: answers.receiveUpdates || false,
  });

  // Load data if exists
  useEffect(() => {
    if (answers && Object.keys(answers).length > 0) {
      setFormData({
        industryInterests: answers.industryInterests || '',
        aiEthics: answers.aiEthics || '',
        futurePlans: answers.futurePlans || '',
        contactEmail: answers.contactEmail || '',
        receiveUpdates: answers.receiveUpdates || false,
      });
    }
  }, [answers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, receiveUpdates: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.contactEmail && !emailRegex.test(formData.contactEmail)) {
      toast({
        title: "אימייל לא תקין",
        description: "אנא הזן כתובת אימייל תקינה",
        variant: "destructive",
      });
      return;
    }
    
    // Update answers in context
    await updateAnswers(3, formData);
  };

  return (
    <QuestionPageLayout
      pageNumber={3}
      title="שאלות ערך מוסף"
      onSubmit={handleSubmit}
      isLastPage={true}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="industryInterests">באילו תעשיות או תחומים של AI את/ה מתעניין/ת במיוחד?</Label>
          <Textarea 
            id="industryInterests" 
            name="industryInterests"
            placeholder="בריאות, פיננסים, חינוך, רובוטיקה, עיבוד שפה טבעית..."
            value={formData.industryInterests}
            onChange={handleInputChange}
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="aiEthics">מה דעתך על הסוגיות האתיות בAI?</Label>
          <Textarea 
            id="aiEthics" 
            name="aiEthics"
            placeholder="תאר/י את השקפתך על האתיקה בתחום ה-AI..."
            value={formData.aiEthics}
            onChange={handleInputChange}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="futurePlans">איך את/ה מתכנן/ת להשתמש בידע שתרכוש/י בקורס בעתיד?</Label>
          <Textarea 
            id="futurePlans" 
            name="futurePlans"
            placeholder="תאר/י את תוכניותיך לעתיד..."
            value={formData.futurePlans}
            onChange={handleInputChange}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail">דוא״ל ליצירת קשר (אופציונלי)</Label>
          <Input 
            id="contactEmail" 
            name="contactEmail"
            type="email"
            placeholder="your.email@example.com"
            value={formData.contactEmail}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Checkbox 
            id="receiveUpdates" 
            checked={formData.receiveUpdates}
            onCheckedChange={(checked) => handleCheckboxChange(checked === true)}
          />
          <Label htmlFor="receiveUpdates">
            אני מעוניין/ת לקבל עדכונים על קורסים נוספים ומידע בתחום
          </Label>
        </div>
      </div>
    </QuestionPageLayout>
  );
};

export default ValueAddQuestionsPage;
