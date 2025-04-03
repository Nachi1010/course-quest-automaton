import React, { useState, useEffect } from 'react';
import { useQuestionnaire } from '@/context/QuestionnaireContext';
import QuestionPageLayout from '@/components/QuestionPageLayout';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

type FormData = {
  investmentPriority: string;
  learningChallenges: string;
  growthAreas: string;
  careerVision: string;
  valueAssessment: string;
  teamPreference: string;
  ethicalConcerns: string;
  futureOutlook: string;
};

// המיפוי של ערכי השדות באנגלית לטקסט בעברית
const hebrewTextMapping = {
  investmentPriority: {
    roi: "החזר השקעה ברור וערך כלכלי",
    knowledge: "רכישת ידע ומיומנויות עמוקות",
    network: "בניית רשת קשרים מקצועית",
    prestige: "יוקרה ומוניטין מקצועי",
    flexibility: "משרה וקריירה מובטחת",
  },
  learningChallenges: {
    technical: "מורכבות טכנית ומתמטית",
    conceptual: "הבנת מושגים ועקרונות מופשטים",
    practical: "יישום מעשי של הידע התיאורטי",
    time: "מציאת זמן להתמקד ולהתמיד בלמידה",
    feedback: "קבלת משוב ומדידת התקדמות אישית",
  },
  growthAreas: {
    "technical-skills": "מיומנויות טכניות ויכולות פיתוח",
    "strategic-thinking": "חשיבה אסטרטגית וראייה מערכתית",
    leadership: "מנהיגות והובלת פרויקטי AI",
    creativity: "יצירתיות וחדשנות בפתרונות טכנולוגיים",
    communication: "יכולת להסביר ולתקשר רעיונות מורכבים",
  },
  careerVision: {
    expert: "מומחה/ית AI מבוקש/ת בתחום מסוים",
    entrepreneur: "יזם/ית עם מיזם טכנולוגי מבוסס AI",
    leader: "מוביל/ה טכנולוגי/ת בארגון גדול",
    consultant: "יועץ/ת עצמאי/ת בפרויקטי AI",
    researcher: "חוקר/ת בתחום מתקדם של בינה מלאכותית",
  },
  valueAssessment: {
    innovation: "חדשנות - פריצת דרך ויצירת דברים חדשים",
    excellence: "מצוינות - שאיפה לאיכות ולתוצאות מעולות",
    impact: "השפעה - יצירת שינוי משמעותי בסביבה",
    autonomy: "עצמאות - חופש פעולה והחלטה",
    security: "ביטחון - יציבות כלכלית ותעסוקתית",
  },
  teamPreference: {
    specialized: "צוות של מומחים בתחום ספציפי",
    diverse: "צוות מגוון עם מגוון דיסציפלינות",
    small: "צוות קטן ואינטימי עם קשר קרוב",
    structured: "צוות עם מבנה והיררכיה ברורים",
    independent: "עבודה עצמאית עם שיתופי פעולה לפי הצורך",
  },
  ethicalConcerns: {
    privacy: "פרטיות ואבטחת מידע אישי",
    bias: "הטיות ואפליה במערכות AI",
    transparency: "שקיפות והסברתיות של החלטות AI",
    displacement: "החלפת עובדים והשפעה על שוק העבודה",
    control: "שליטה והסכנה מAI אוטונומי מדי",
  },
  futureOutlook: {
    "very-positive": "מאוד חיובי - ישראל תהיה מובילה עולמית בתחום",
    positive: "חיובי - התחום יתפתח בקצב מהיר אך עם אתגרים",
    mixed: "מעורב - התפתחות בתחומים מסוימים, האטה באחרים",
    concerned: "מודאג/ת - אנחנו עלולים לפספס את המירוץ הטכנולוגי",
    uncertain: "לא בטוח/ה - קשה לחזות את העתיד בתחום דינמי כל כך",
  },
};

const ValueAddQuestionsPage: React.FC = () => {
  const { answers, updateAnswers } = useQuestionnaire();
  const { toast } = useToast();
  const [showValidationMessage, setShowValidationMessage] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    investmentPriority: '',
    learningChallenges: '',
    growthAreas: '',
    careerVision: '',
    valueAssessment: '',
    teamPreference: '',
    ethicalConcerns: '',
    futureOutlook: '',
  });

  useEffect(() => {
    // Load saved data if available
    if (answers && Object.keys(answers).length > 0) {
      setFormData({
        investmentPriority: answers.investmentPriority || '',
        learningChallenges: answers.learningChallenges || '',
        growthAreas: answers.growthAreas || '',
        careerVision: answers.careerVision || '',
        valueAssessment: answers.valueAssessment || '',
        teamPreference: answers.teamPreference || '',
        ethicalConcerns: answers.ethicalConcerns || '',
        futureOutlook: answers.futureOutlook || '',
      });
    }
  }, [answers]);

  const handleRadioChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation message if user changes something
    if (showValidationMessage) {
      setShowValidationMessage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // המרת ערכים באנגלית לטקסט בעברית לפני שמירה בדאטהבייס
    const hebrewFormData: Record<string, string> = {};
    
    // עבור כל שדה בטופס, המר את הערך לטקסט בעברית אם קיים
    (Object.keys(formData) as Array<keyof FormData>).forEach(field => {
      const value = formData[field];
      if (value && hebrewTextMapping[field] && hebrewTextMapping[field][value as keyof typeof hebrewTextMapping[typeof field]]) {
        // שמור את הטקסט בעברית
        hebrewFormData[field] = hebrewTextMapping[field][value as keyof typeof hebrewTextMapping[typeof field]];
      } else {
        // אם אין מיפוי, שמור את הערך המקורי
        hebrewFormData[field] = value;
      }
    });
    
    // תמיד שומר את הנתונים ללא קשר לתקפות
    await updateAnswers(3, hebrewFormData);
    
    // Show warning if any field is missing, but don't block navigation
    const hasEmptyFields = Object.values(formData).some(value => !value);
    
    if (hasEmptyFields) {
      setShowValidationMessage(true);
      toast({
        title: "שדות חסרים",
        description: "לא מילאת את כל השאלות. מומלץ להשלים את כל השדות.",
        variant: "destructive",
      });
    }
    
    // Always allow navigation to next page
    return true;
  };

  return (
    <QuestionPageLayout
      pageNumber={3}
      title="ערכים, חזון ועתיד"
      onSubmit={handleSubmit}
    >
      {showValidationMessage && (
        <Alert className="mb-6 bg-red-50 border-red-200 text-red-800">
          <InfoIcon className="h-5 w-5 ml-2" />
          <AlertDescription>
            לא מילאת את כל השאלות. מומלץ להשלים את כל השדות.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            <Label htmlFor="investmentPriority" className="text-xl font-bold text-gray-900 block mb-3">מה הכי חשוב לך בהשקעה הלימודית שלך?</Label>
            <RadioGroup 
              value={formData.investmentPriority} 
              onValueChange={(value) => handleRadioChange('investmentPriority', value)}
              className="space-y-3 mt-2"
              dir="rtl"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="roi" id="invest-roi" />
                <Label htmlFor="invest-roi" className="text-gray-700 text-right w-full">החזר השקעה ברור וערך כלכלי</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="knowledge" id="invest-knowledge" />
                <Label htmlFor="invest-knowledge" className="text-gray-700 text-right w-full">רכישת ידע ומיומנויות עמוקות</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="network" id="invest-network" />
                <Label htmlFor="invest-network" className="text-gray-700 text-right w-full">בניית רשת קשרים מקצועית</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="prestige" id="invest-prestige" />
                <Label htmlFor="invest-prestige" className="text-gray-700 text-right w-full">יוקרה ומוניטין מקצועי</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="flexibility" id="invest-flexibility" />
                <Label htmlFor="invest-flexibility" className="text-gray-700 text-right w-full">גמישות ואיזון בין לימודים לחיים</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            <Label htmlFor="learningChallenges" className="text-xl font-bold text-gray-900 block mb-3">מה האתגר המשמעותי ביותר שאתה/את צופה בלימוד AI?</Label>
            <RadioGroup 
              value={formData.learningChallenges} 
              onValueChange={(value) => handleRadioChange('learningChallenges', value)}
              className="space-y-3 mt-2"
              dir="rtl"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="technical" id="challenge-technical" />
                <Label htmlFor="challenge-technical" className="text-gray-700 text-right w-full">מורכבות טכנית ומתמטית</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="conceptual" id="challenge-conceptual" />
                <Label htmlFor="challenge-conceptual" className="text-gray-700 text-right w-full">הבנת מושגים ועקרונות מופשטים</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="practical" id="challenge-practical" />
                <Label htmlFor="challenge-practical" className="text-gray-700 text-right w-full">יישום מעשי של הידע התיאורטי</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="time" id="challenge-time" />
                <Label htmlFor="challenge-time" className="text-gray-700 text-right w-full">מציאת זמן להתמקד ולהתמיד בלמידה</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="feedback" id="challenge-feedback" />
                <Label htmlFor="challenge-feedback" className="text-gray-700 text-right w-full">קבלת משוב ומדידת התקדמות אישית</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            <Label htmlFor="growthAreas" className="text-xl font-bold text-gray-900 block mb-3">באיזה תחום היית רוצה לראות את הצמיחה המשמעותית ביותר?</Label>
            <RadioGroup 
              value={formData.growthAreas} 
              onValueChange={(value) => handleRadioChange('growthAreas', value)}
              className="space-y-3 mt-2"
              dir="rtl"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="technical-skills" id="growth-technical" />
                <Label htmlFor="growth-technical" className="text-gray-700 text-right w-full">מיומנויות טכניות ויכולות פיתוח</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="strategic-thinking" id="growth-strategic" />
                <Label htmlFor="growth-strategic" className="text-gray-700 text-right w-full">חשיבה אסטרטגית וראייה מערכתית</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="leadership" id="growth-leadership" />
                <Label htmlFor="growth-leadership" className="text-gray-700 text-right w-full">מנהיגות והובלת פרויקטי AI</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="creativity" id="growth-creativity" />
                <Label htmlFor="growth-creativity" className="text-gray-700 text-right w-full">יצירתיות וחדשנות בפתרונות טכנולוגיים</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="communication" id="growth-communication" />
                <Label htmlFor="growth-communication" className="text-gray-700 text-right w-full">יכולת להסביר ולתקשר רעיונות מורכבים</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            <Label htmlFor="careerVision" className="text-xl font-bold text-gray-900 block mb-3">איך אתה/את רואה את עצמך בעוד 5 שנים?</Label>
            <RadioGroup 
              value={formData.careerVision} 
              onValueChange={(value) => handleRadioChange('careerVision', value)}
              className="space-y-3 mt-2"
              dir="rtl"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="expert" id="vision-expert" />
                <Label htmlFor="vision-expert" className="text-gray-700 text-right w-full">מומחה/ית AI מבוקש/ת בתחום מסוים</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="entrepreneur" id="vision-entrepreneur" />
                <Label htmlFor="vision-entrepreneur" className="text-gray-700 text-right w-full">יזם/ית עם מיזם טכנולוגי מבוסס AI</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="leader" id="vision-leader" />
                <Label htmlFor="vision-leader" className="text-gray-700 text-right w-full">מוביל/ה טכנולוגי/ת בארגון גדול</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="consultant" id="vision-consultant" />
                <Label htmlFor="vision-consultant" className="text-gray-700 text-right w-full">יועץ/ת עצמאי/ת בפרויקטי AI</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="researcher" id="vision-researcher" />
                <Label htmlFor="vision-researcher" className="text-gray-700 text-right w-full">חוקר/ת בתחום מתקדם של בינה מלאכותית</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            <Label htmlFor="valueAssessment" className="text-xl font-bold text-gray-900 block mb-3">איזה ערך מנחה אותך ביותר בקריירה?</Label>
            <RadioGroup 
              value={formData.valueAssessment} 
              onValueChange={(value) => handleRadioChange('valueAssessment', value)}
              className="space-y-3 mt-2"
              dir="rtl"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="innovation" id="value-innovation" />
                <Label htmlFor="value-innovation" className="text-gray-700 text-right w-full">חדשנות - פריצת דרך ויצירת דברים חדשים</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="excellence" id="value-excellence" />
                <Label htmlFor="value-excellence" className="text-gray-700 text-right w-full">מצוינות - שאיפה לאיכות ולתוצאות מעולות</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="impact" id="value-impact" />
                <Label htmlFor="value-impact" className="text-gray-700 text-right w-full">השפעה - יצירת שינוי משמעותי בסביבה</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="autonomy" id="value-autonomy" />
                <Label htmlFor="value-autonomy" className="text-gray-700 text-right w-full">עצמאות - חופש פעולה והחלטה</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="security" id="value-security" />
                <Label htmlFor="value-security" className="text-gray-700 text-right w-full">ביטחון - יציבות כלכלית ותעסוקתית</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            <Label htmlFor="teamPreference" className="text-xl font-bold text-gray-900 block mb-3">איזה סוג צוות אתה/את מעדיף/ה לעבוד איתו?</Label>
            <RadioGroup 
              value={formData.teamPreference} 
              onValueChange={(value) => handleRadioChange('teamPreference', value)}
              className="space-y-3 mt-2"
              dir="rtl"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="specialized" id="team-specialized" />
                <Label htmlFor="team-specialized" className="text-gray-700 text-right w-full">צוות של מומחים בתחום ספציפי</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="diverse" id="team-diverse" />
                <Label htmlFor="team-diverse" className="text-gray-700 text-right w-full">צוות מגוון עם מגוון דיסציפלינות</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="small" id="team-small" />
                <Label htmlFor="team-small" className="text-gray-700 text-right w-full">צוות קטן ואינטימי עם קשר קרוב</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="structured" id="team-structured" />
                <Label htmlFor="team-structured" className="text-gray-700 text-right w-full">צוות עם מבנה והיררכיה ברורים</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="independent" id="team-independent" />
                <Label htmlFor="team-independent" className="text-gray-700 text-right w-full">עבודה עצמאית עם שיתופי פעולה לפי הצורך</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            <Label htmlFor="ethicalConcerns" className="text-xl font-bold text-gray-900 block mb-3">איזה נושא אתי בתחום ה-AI הכי מטריד אותך?</Label>
            <RadioGroup 
              value={formData.ethicalConcerns} 
              onValueChange={(value) => handleRadioChange('ethicalConcerns', value)}
              className="space-y-3 mt-2"
              dir="rtl"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="privacy" id="ethics-privacy" />
                <Label htmlFor="ethics-privacy" className="text-gray-700 text-right w-full">פרטיות ואבטחת מידע אישי</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="bias" id="ethics-bias" />
                <Label htmlFor="ethics-bias" className="text-gray-700 text-right w-full">הטיות ואפליה במערכות AI</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="transparency" id="ethics-transparency" />
                <Label htmlFor="ethics-transparency" className="text-gray-700 text-right w-full">שקיפות והסברתיות של החלטות AI</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="displacement" id="ethics-displacement" />
                <Label htmlFor="ethics-displacement" className="text-gray-700 text-right w-full">החלפת עובדים והשפעה על שוק העבודה</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="control" id="ethics-control" />
                <Label htmlFor="ethics-control" className="text-gray-700 text-right w-full">שליטה והסכנה מAI אוטונומי מדי</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            <Label htmlFor="futureOutlook" className="text-xl font-bold text-gray-900 block mb-3">איך אתה/את רואה את עתיד ה-AI בישראל?</Label>
            <RadioGroup 
              value={formData.futureOutlook} 
              onValueChange={(value) => handleRadioChange('futureOutlook', value)}
              className="space-y-3 mt-2"
              dir="rtl"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="very-positive" id="future-very-positive" />
                <Label htmlFor="future-very-positive" className="text-gray-700 text-right w-full">מאוד חיובי - ישראל תהיה מובילה עולמית בתחום</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="positive" id="future-positive" />
                <Label htmlFor="future-positive" className="text-gray-700 text-right w-full">חיובי - התחום יתפתח בקצב מהיר אך עם אתגרים</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="mixed" id="future-mixed" />
                <Label htmlFor="future-mixed" className="text-gray-700 text-right w-full">מעורב - התפתחות בתחומים מסוימים, האטה באחרים</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="concerned" id="future-concerned" />
                <Label htmlFor="future-concerned" className="text-gray-700 text-right w-full">מודאג/ת - אנחנו עלולים לפספס את המירוץ הטכנולוגי</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="uncertain" id="future-uncertain" />
                <Label htmlFor="future-uncertain" className="text-gray-700 text-right w-full">לא בטוח/ה - קשה לחזות את העתיד בתחום דינמי כל כך</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </QuestionPageLayout>
  );
};

export default ValueAddQuestionsPage;
