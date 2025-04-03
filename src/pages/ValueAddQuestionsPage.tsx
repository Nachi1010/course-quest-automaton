import React, { useState, useEffect } from 'react';
import { useQuestionnaire } from '@/context/QuestionnaireContext';
import QuestionPageLayout from '@/components/QuestionPageLayout';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
          <RadioGroup 
            value={formData.industryInterests} 
            onValueChange={(value) => handleRadioChange('industryInterests', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="healthcare" id="industry-healthcare" />
              <Label htmlFor="industry-healthcare">בריאות ורפואה</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="finance" id="industry-finance" />
              <Label htmlFor="industry-finance">פיננסים ובנקאות</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="education" id="industry-education" />
              <Label htmlFor="industry-education">חינוך והדרכה</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="robotics" id="industry-robotics" />
              <Label htmlFor="industry-robotics">רובוטיקה ואוטומציה</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="nlp" id="industry-nlp" />
              <Label htmlFor="industry-nlp">עיבוד שפה טבעית וכלי תקשורת</Label>
            </div>
          </RadioGroup>
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
          <RadioGroup 
            value={formData.aiEthics} 
            onValueChange={(value) => handleRadioChange('aiEthics', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="essential" id="ethics-essential" />
              <Label htmlFor="ethics-essential">חיוני לפיתוח אחראי של AI</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="important" id="ethics-important" />
              <Label htmlFor="ethics-important">חשוב אך לא יעכב התקדמות</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="somewhat-important" id="ethics-somewhat-important" />
              <Label htmlFor="ethics-somewhat-important">חשוב במידה מסוימת</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="overblown" id="ethics-overblown" />
              <Label htmlFor="ethics-overblown">מוגזם</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="not-concerned" id="ethics-not-concerned" />
              <Label htmlFor="ethics-not-concerned">לא מודאג/ת מסוגיות אתיות</Label>
            </div>
          </RadioGroup>
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
          <RadioGroup 
            value={formData.aiRegulation} 
            onValueChange={(value) => handleRadioChange('aiRegulation', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="strong-global" id="regulation-strong-global" />
              <Label htmlFor="regulation-strong-global">נדרשת רגולציה חזקה ברמה הגלובלית</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="moderate" id="regulation-moderate" />
              <Label htmlFor="regulation-moderate">רגולציה מתונה בתחומים מסוימים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="self-regulation" id="regulation-self-regulation" />
              <Label htmlFor="regulation-self-regulation">עדיף שהתעשייה תסדיר את עצמה</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="minimal" id="regulation-minimal" />
              <Label htmlFor="regulation-minimal">רגולציה מינימלית נדרשת</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="none" id="regulation-none" />
              <Label htmlFor="regulation-none">אין צורך ברגולציה כלל</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="futurePlans">איך את/ה מתכנן/ת להשתמש בידע שתרכוש/י בעתיד?</Label>
          <RadioGroup 
            value={formData.futurePlans} 
            onValueChange={(value) => handleRadioChange('futurePlans', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="career-advancement" id="future-career-advancement" />
              <Label htmlFor="future-career-advancement">קידום קריירה בארגון הנוכחי</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="new-position" id="future-new-position" />
              <Label htmlFor="future-new-position">חיפוש תפקיד חדש בתחום ה-AI</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="business" id="future-business" />
              <Label htmlFor="future-business">יזמות ופיתוח מיזם עסקי</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="research" id="future-research" />
              <Label htmlFor="future-research">מחקר וחקר בתחום ה-AI</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="personal-enrichment" id="future-personal-enrichment" />
              <Label htmlFor="future-personal-enrichment">העשרה אישית ופיתוח כישורים</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="futureAiTrends">אילו מגמות AI עתידיות מעניינות אותך ביותר?</Label>
          <RadioGroup 
            value={formData.futureAiTrends} 
            onValueChange={(value) => handleRadioChange('futureAiTrends', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="generative-ai" id="trend-generative-ai" />
              <Label htmlFor="trend-generative-ai">AI גנרטיבי (תמונות, טקסט, וידאו)</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="agi" id="trend-agi" />
              <Label htmlFor="trend-agi">בינה מלאכותית כללית (AGI)</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="robotics" id="trend-robotics" />
              <Label htmlFor="trend-robotics">רובוטיקה ואוטומציה</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="explainable-ai" id="trend-explainable-ai" />
              <Label htmlFor="trend-explainable-ai">AI מוסבר ובר אמון</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="edge-ai" id="trend-edge-ai" />
              <Label htmlFor="trend-edge-ai">AI בקצה (Edge AI) והתקנים חכמים</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="aiChallenges">מהו האתגר המשמעותי ביותר של טכנולוגיות AI בעיניך?</Label>
          <RadioGroup 
            value={formData.aiChallenges} 
            onValueChange={(value) => handleRadioChange('aiChallenges', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="ethics" id="challenge-ethics" />
              <Label htmlFor="challenge-ethics">אתיקה, הוגנות ושקיפות</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="security" id="challenge-security" />
              <Label htmlFor="challenge-security">אבטחה ומניעת שימוש לרעה</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="job-displacement" id="challenge-job-displacement" />
              <Label htmlFor="challenge-job-displacement">אובדן משרות ופגיעה בתעסוקה</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="concentration" id="challenge-concentration" />
              <Label htmlFor="challenge-concentration">ריכוז כוח בידי תאגידים גדולים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="technical" id="challenge-technical" />
              <Label htmlFor="challenge-technical">מגבלות טכניות ואמינות המערכות</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="aiToolsUsage">באילו כלי AI את/ה משתמש/ת כיום?</Label>
          <RadioGroup 
            value={formData.aiToolsUsage} 
            onValueChange={(value) => handleRadioChange('aiToolsUsage', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="chatgpt" id="tool-chatgpt" />
              <Label htmlFor="tool-chatgpt">ChatGPT ומודלי שפה</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="image-generation" id="tool-image-generation" />
              <Label htmlFor="tool-image-generation">כלים ליצירת תמונות (DALL-E, Midjourney)</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="code-assistants" id="tool-code-assistants" />
              <Label htmlFor="tool-code-assistants">עוזרי קוד (GitHub Copilot, Cursor)</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="productivity" id="tool-productivity" />
              <Label htmlFor="tool-productivity">כלי פרודוקטיביות מבוססי AI</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="none" id="tool-none" />
              <Label htmlFor="tool-none">לא משתמש/ת בכלי AI באופן קבוע</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="aiEducationMethod">איך את/ה מעדיף/ה ללמוד על טכנולוגיית AI?</Label>
          <RadioGroup 
            value={formData.aiEducationMethod} 
            onValueChange={(value) => handleRadioChange('aiEducationMethod', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="structured-course" id="edu-structured-course" />
              <Label htmlFor="edu-structured-course">קורס מובנה עם תוכנית מסודרת</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="project-based" id="edu-project-based" />
              <Label htmlFor="edu-project-based">למידה מבוססת פרויקטים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="self-guided" id="edu-self-guided" />
              <Label htmlFor="edu-self-guided">למידה עצמית מחומרים מקוונים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="mentorship" id="edu-mentorship" />
              <Label htmlFor="edu-mentorship">חניכה אישית והדרכה מקצועית</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="community" id="edu-community" />
              <Label htmlFor="edu-community">למידה קהילתית ושיתוף ידע</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </QuestionPageLayout>
  );
};

export default ValueAddQuestionsPage;
