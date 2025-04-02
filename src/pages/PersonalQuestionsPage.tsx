
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
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';

const PersonalQuestionsPage: React.FC = () => {
  const { answers, updateAnswers } = useQuestionnaire();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    motivations: answers.motivations || '',
    workStyle: answers.workStyle || '',
    learningChallenges: answers.learningChallenges || '',
    timeCommitment: answers.timeCommitment || '',
    strengths: answers.strengths || [],
  });

  // Load data if exists
  useEffect(() => {
    if (answers && Object.keys(answers).length > 0) {
      setFormData({
        motivations: answers.motivations || '',
        workStyle: answers.workStyle || '',
        learningChallenges: answers.learningChallenges || '',
        timeCommitment: answers.timeCommitment || '',
        strengths: answers.strengths || [],
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

  const handleCheckboxChange = (value: string, checked: boolean) => {
    setFormData((prev) => {
      const currentStrengths = [...(prev.strengths || [])];
      if (checked && !currentStrengths.includes(value)) {
        return { ...prev, strengths: [...currentStrengths, value] };
      } else if (!checked && currentStrengths.includes(value)) {
        return { 
          ...prev, 
          strengths: currentStrengths.filter(item => item !== value) 
        };
      }
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.motivations) {
      toast({
        title: "שדה חסר",
        description: "אנא מלא/י את המוטיבציות שלך ללמידת AI",
        variant: "destructive",
      });
      return;
    }
    
    // Update answers in context
    await updateAnswers(2, formData);
  };

  return (
    <QuestionPageLayout
      pageNumber={2}
      title="שאלות אישיות"
      onSubmit={handleSubmit}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="motivations">מה מניע אותך ללמוד AI?</Label>
          <Textarea 
            id="motivations" 
            name="motivations"
            placeholder="תאר/י את המוטיבציות שלך..."
            value={formData.motivations}
            onChange={handleInputChange}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="workStyle">איך היית מגדיר/ה את סגנון העבודה שלך?</Label>
          <RadioGroup 
            value={formData.workStyle} 
            onValueChange={(value) => handleRadioChange('workStyle', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="independent" id="style-independent" />
              <Label htmlFor="style-independent">עצמאי/ת - מעדיף/ה לעבוד לבד</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="collaborative" id="style-collaborative" />
              <Label htmlFor="style-collaborative">שיתופי/ת - מעדיף/ה לעבוד בקבוצה</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="flexible" id="style-flexible" />
              <Label htmlFor="style-flexible">גמיש/ה - יכול/ה להסתגל לשני הסגנונות</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>מהם הכוחות והחוזקות שלך? (ניתן לבחור כמה אפשרויות)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            {[
              { id: 'analytical', label: 'חשיבה אנליטית' },
              { id: 'creative', label: 'יצירתיות' },
              { id: 'problem-solving', label: 'פתרון בעיות' },
              { id: 'attention-to-detail', label: 'תשומת לב לפרטים' },
              { id: 'persistence', label: 'התמדה' },
              { id: 'communication', label: 'תקשורת' },
            ].map(item => (
              <div key={item.id} className="flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox 
                  id={item.id} 
                  checked={formData.strengths?.includes(item.id)}
                  onCheckedChange={(checked) => handleCheckboxChange(item.id, checked === true)}
                />
                <Label htmlFor={item.id}>{item.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="learningChallenges">מהם האתגרים העיקריים שאתה צופה בלימוד AI?</Label>
          <Textarea 
            id="learningChallenges" 
            name="learningChallenges"
            placeholder="תאר/י את האתגרים שלך..."
            value={formData.learningChallenges}
            onChange={handleInputChange}
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeCommitment">כמה זמן בשבוע את/ה יכול/ה להקדיש לקורס?</Label>
          <Select 
            value={formData.timeCommitment} 
            onValueChange={(value) => handleSelectChange('timeCommitment', value)}
          >
            <SelectTrigger id="timeCommitment" className="w-full">
              <SelectValue placeholder="בחר/י מתוך האפשרויות" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-3">פחות מ-3 שעות</SelectItem>
              <SelectItem value="3-5">3-5 שעות</SelectItem>
              <SelectItem value="5-10">5-10 שעות</SelectItem>
              <SelectItem value="10+">יותר מ-10 שעות</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </QuestionPageLayout>
  );
};

export default PersonalQuestionsPage;
