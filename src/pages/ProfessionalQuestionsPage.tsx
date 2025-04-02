
import React, { useState, useEffect } from 'react';
import { useQuestionnaire } from '@/context/QuestionnaireContext';
import QuestionPageLayout from '@/components/QuestionPageLayout';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const ProfessionalQuestionsPage: React.FC = () => {
  const { answers, updateAnswers } = useQuestionnaire();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    yearsExperience: answers.yearsExperience || '',
    programmingLanguages: answers.programmingLanguages || '',
    aiExperience: answers.aiExperience || '',
    preferredLearningMethod: answers.preferredLearningMethod || '',
    projectGoals: answers.projectGoals || '',
  });

  // Load data if exists
  useEffect(() => {
    if (answers && Object.keys(answers).length > 0) {
      setFormData({
        yearsExperience: answers.yearsExperience || '',
        programmingLanguages: answers.programmingLanguages || '',
        aiExperience: answers.aiExperience || '',
        preferredLearningMethod: answers.preferredLearningMethod || '',
        projectGoals: answers.projectGoals || '',
      });
    }
  }, [answers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.yearsExperience) {
      toast({
        title: "שדה חסר",
        description: "אנא ציין את שנות הניסיון שלך",
        variant: "destructive",
      });
      return;
    }
    
    // Update answers in context
    await updateAnswers(1, formData);
  };

  return (
    <QuestionPageLayout
      pageNumber={1}
      title="שאלות מקצועיות"
      onSubmit={handleSubmit}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="yearsExperience">כמה שנות ניסיון יש לך בפיתוח תוכנה?</Label>
          <Select 
            value={formData.yearsExperience} 
            onValueChange={(value) => handleSelectChange('yearsExperience', value)}
          >
            <SelectTrigger id="yearsExperience" className="w-full">
              <SelectValue placeholder="בחר/י מתוך האפשרויות" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-1">פחות משנה</SelectItem>
              <SelectItem value="1-3">1-3 שנים</SelectItem>
              <SelectItem value="3-5">3-5 שנים</SelectItem>
              <SelectItem value="5-10">5-10 שנים</SelectItem>
              <SelectItem value="10+">10+ שנים</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="programmingLanguages">באילו שפות תכנות את/ה משתמש/ת?</Label>
          <Textarea 
            id="programmingLanguages" 
            name="programmingLanguages"
            placeholder="Python, JavaScript, Java, etc."
            value={formData.programmingLanguages}
            onChange={handleInputChange}
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="aiExperience">מה הניסיון שלך עם AI?</Label>
          <RadioGroup 
            value={formData.aiExperience} 
            onValueChange={(value) => handleRadioChange('aiExperience', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="none" id="ai-none" />
              <Label htmlFor="ai-none">אין ניסיון</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="beginner" id="ai-beginner" />
              <Label htmlFor="ai-beginner">מתחיל/ה - השתמשתי בכלי AI בסיסיים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="intermediate" id="ai-intermediate" />
              <Label htmlFor="ai-intermediate">בינוני - עבדתי עם מודלים קיימים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="advanced" id="ai-advanced" />
              <Label htmlFor="ai-advanced">מתקדם - פיתחתי או אימנתי מודלים</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredLearningMethod">מהי שיטת הלמידה המועדפת עליך?</Label>
          <RadioGroup 
            value={formData.preferredLearningMethod} 
            onValueChange={(value) => handleRadioChange('preferredLearningMethod', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="video" id="learn-video" />
              <Label htmlFor="learn-video">סרטוני וידאו</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="reading" id="learn-reading" />
              <Label htmlFor="learn-reading">קריאת חומר</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="practice" id="learn-practice" />
              <Label htmlFor="learn-practice">תרגול מעשי</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="mixed" id="learn-mixed" />
              <Label htmlFor="learn-mixed">שילוב של האפשרויות</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectGoals">מהן המטרות שלך בקורס זה? איזה פרויקט היית רוצה לפתח?</Label>
          <Textarea 
            id="projectGoals" 
            name="projectGoals"
            placeholder="תאר/י את המטרות והפרויקטים שלך..."
            value={formData.projectGoals}
            onChange={handleInputChange}
            className="min-h-[120px]"
          />
        </div>
      </div>
    </QuestionPageLayout>
  );
};

export default ProfessionalQuestionsPage;
