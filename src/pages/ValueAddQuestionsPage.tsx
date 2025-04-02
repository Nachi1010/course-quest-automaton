
import React, { useState, useEffect } from 'react';
import { useQuestionnaire } from '@/context/QuestionnaireContext';
import QuestionPageLayout from '@/components/QuestionPageLayout';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const ValueAddQuestionsPage: React.FC = () => {
  const { answers, updateAnswers } = useQuestionnaire();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    industryInterests: answers.industryInterests || '',
    aiEthics: answers.aiEthics || '',
    futurePlans: answers.futurePlans || '',
    aiImpact: answers.aiImpact || '',
    dataPrivacy: answers.dataPrivacy || '',
    aiRegulation: answers.aiRegulation || '',
    futureAiTrends: answers.futureAiTrends || '',
    aiChallenges: answers.aiChallenges || '',
    aiToolsUsage: answers.aiToolsUsage || '',
    aiEducationMethod: answers.aiEducationMethod || '',
  });

  // Load data if exists
  useEffect(() => {
    if (answers && Object.keys(answers).length > 0) {
      setFormData({
        industryInterests: answers.industryInterests || '',
        aiEthics: answers.aiEthics || '',
        futurePlans: answers.futurePlans || '',
        aiImpact: answers.aiImpact || '',
        dataPrivacy: answers.dataPrivacy || '',
        aiRegulation: answers.aiRegulation || '',
        futureAiTrends: answers.futureAiTrends || '',
        aiChallenges: answers.aiChallenges || '',
        aiToolsUsage: answers.aiToolsUsage || '',
        aiEducationMethod: answers.aiEducationMethod || '',
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
    await updateAnswers(3, formData);
  };

  return (
    <QuestionPageLayout
      pageNumber={3}
      title="שאלות ערך מוסף"
      onSubmit={handleSubmit}
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
          <Label htmlFor="aiImpact">איך לדעתך AI ישפיע על שוק העבודה בעשור הקרוב?</Label>
          <RadioGroup 
            value={formData.aiImpact} 
            onValueChange={(value) => handleRadioChange('aiImpact', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="very-positive" id="impact-very-positive" />
              <Label htmlFor="impact-very-positive">חיובי מאוד - יצירת משרות חדשות ושיפור תהליכים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="somewhat-positive" id="impact-somewhat-positive" />
              <Label htmlFor="impact-somewhat-positive">חיובי במידת מה - יותר הזדמנויות מאשר אתגרים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="neutral" id="impact-neutral" />
              <Label htmlFor="impact-neutral">ניטרלי - יאזן בין יצירת משרות לאובדן משרות</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="somewhat-negative" id="impact-somewhat-negative" />
              <Label htmlFor="impact-somewhat-negative">שלילי במידת מה - יותר אתגרים מאשר הזדמנויות</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="very-negative" id="impact-very-negative" />
              <Label htmlFor="impact-very-negative">שלילי מאוד - אובדן משמעותי של משרות</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="aiEthics">מה דעתך על הסוגיות האתיות בAI?</Label>
          <Select 
            value={formData.aiEthics} 
            onValueChange={(value) => handleSelectChange('aiEthics', value)}
          >
            <SelectTrigger id="aiEthics" className="w-full">
              <SelectValue placeholder="בחר/י את התשובה המתאימה ביותר" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="essential">חיוני לפיתוח אחראי של AI</SelectItem>
              <SelectItem value="important">חשוב אך לא יעכב התקדמות</SelectItem>
              <SelectItem value="somewhat-important">חשוב במידה מסוימת</SelectItem>
              <SelectItem value="overblown">מוגזם</SelectItem>
              <SelectItem value="not-concerned">לא מודאג/ת מסוגיות אתיות</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataPrivacy">מהי עמדתך בנוגע לפרטיות נתונים בפיתוח AI?</Label>
          <RadioGroup 
            value={formData.dataPrivacy} 
            onValueChange={(value) => handleRadioChange('dataPrivacy', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="top-priority" id="privacy-top-priority" />
              <Label htmlFor="privacy-top-priority">עדיפות עליונה - פרטיות צריכה להיות מעל הכל</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="balanced-approach" id="privacy-balanced-approach" />
              <Label htmlFor="privacy-balanced-approach">גישה מאוזנת בין פרטיות להתקדמות</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="case-by-case" id="privacy-case-by-case" />
              <Label htmlFor="privacy-case-by-case">תלוי מקרה - יש לשקול כל מצב לגופו</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="progress-first" id="privacy-progress-first" />
              <Label htmlFor="privacy-progress-first">התקדמות קודמת - מעט ויתורים על פרטיות מקובלים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="not-concerned" id="privacy-not-concerned" />
              <Label htmlFor="privacy-not-concerned">אינני מודאג/ת מסוגיות פרטיות</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="aiRegulation">מה דעתך על רגולציה של AI?</Label>
          <Select 
            value={formData.aiRegulation} 
            onValueChange={(value) => handleSelectChange('aiRegulation', value)}
          >
            <SelectTrigger id="aiRegulation" className="w-full">
              <SelectValue placeholder="בחר/י את התשובה המתאימה ביותר" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="strong-global">נדרשת רגולציה חזקה ברמה הגלובלית</SelectItem>
              <SelectItem value="moderate">רגולציה מתונה בתחומים מסוימים</SelectItem>
              <SelectItem value="self-regulation">עדיף שהתעשייה תסדיר את עצמה</SelectItem>
              <SelectItem value="minimal">רגולציה מינימלית נדרשת</SelectItem>
              <SelectItem value="none">אין צורך ברגולציה כלל</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="futurePlans">איך את/ה מתכנן/ת להשתמש בידע שתרכוש/י בקורס בעתיד?</Label>
          <Textarea 
            id="futurePlans" 
            name="futurePlans"
            placeholder="תאר/י את תוכניותיך לעתיד..."
            value={formData.futurePlans}
            onChange={handleInputChange}
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="futureAiTrends">אילו מגמות AI עתידיות מעניינות אותך ביותר?</Label>
          <Select 
            value={formData.futureAiTrends} 
            onValueChange={(value) => handleSelectChange('futureAiTrends', value)}
          >
            <SelectTrigger id="futureAiTrends" className="w-full">
              <SelectValue placeholder="בחר/י את התשובה המתאימה ביותר" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="agi">בינה מלאכותית כללית (AGI)</SelectItem>
              <SelectItem value="multimodal">מודלים מולטימודליים (טקסט, תמונה, קול)</SelectItem>
              <SelectItem value="specific-ai">בינה מלאכותית מותאמת לתחומים ספציפיים</SelectItem>
              <SelectItem value="robotics">רובוטיקה ואוטומציה</SelectItem>
              <SelectItem value="human-ai">שיתוף פעולה אדם-מכונה</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="aiChallenges">מהו לדעתך האתגר הגדול ביותר בתחום ה-AI כיום?</Label>
          <RadioGroup 
            value={formData.aiChallenges} 
            onValueChange={(value) => handleRadioChange('aiChallenges', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="bias" id="challenge-bias" />
              <Label htmlFor="challenge-bias">הטיות ואפליה במודלים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="transparency" id="challenge-transparency" />
              <Label htmlFor="challenge-transparency">שקיפות והסברתיות של מודלים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="safety" id="challenge-safety" />
              <Label htmlFor="challenge-safety">בטיחות ואיומים פוטנציאליים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="accessibility" id="challenge-accessibility" />
              <Label htmlFor="challenge-accessibility">נגישות לטכנולוגיה ופערים דיגיטליים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="regulation" id="challenge-regulation" />
              <Label htmlFor="challenge-regulation">רגולציה ומסגרות משפטיות</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="aiToolsUsage">באילו כלי AI את/ה משתמש/ת כיום?</Label>
          <Textarea 
            id="aiToolsUsage" 
            name="aiToolsUsage"
            placeholder="ChatGPT, Midjourney, Copilot, DALLE, וכו'..."
            value={formData.aiToolsUsage}
            onChange={handleInputChange}
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="aiEducationMethod">מהי לדעתך הדרך הטובה ביותר ללמד AI?</Label>
          <Select 
            value={formData.aiEducationMethod} 
            onValueChange={(value) => handleSelectChange('aiEducationMethod', value)}
          >
            <SelectTrigger id="aiEducationMethod" className="w-full">
              <SelectValue placeholder="בחר/י את התשובה המתאימה ביותר" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="theoretical-first">רקע תיאורטי לפני יישום מעשי</SelectItem>
              <SelectItem value="practical-first">למידה מעשית עם פרויקטים</SelectItem>
              <SelectItem value="mixed-approach">שילוב של תיאוריה ופרקטיקה</SelectItem>
              <SelectItem value="specialized-tracks">מסלולים מותאמים לפי תחומי עניין</SelectItem>
              <SelectItem value="industry-collaboration">שיתופי פעולה עם התעשייה</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </QuestionPageLayout>
  );
};

export default ValueAddQuestionsPage;
