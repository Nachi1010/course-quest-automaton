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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

type FormData = {
  aiExperience: string;
  programmingSkill: string;
  educationLevel: string;
  specializations: string;
  preferredLearningMethod: string;
  professionalBackground: string;
  dataScience: string;
  careerStage: string;
};

// המיפוי של ערכי השדות באנגלית לטקסט בעברית
const hebrewTextMapping = {
  aiExperience: {
    beginner: "מתחיל - היכרות בסיסית עם המושגים",
    intermediate: "בינוני - התנסות בכלים ויישומים",
    advanced: "מתקדם - עבודה עם מודלים ויישומים מורכבים",
    expert: "מומחה - ניסיון בפיתוח ויישום פתרונות בתעשייה",
  },
  programmingSkill: {
    none: "ללא ניסיון תכנותי",
    beginner: "מתחיל - היכרות בסיסית עם שפת תכנות אחת או יותר",
    intermediate: "בינוני - יכולת לבנות יישומים פשוטים",
    advanced: "מתקדם - ניסיון רב בפיתוח ומספר שפות תכנות",
    expert: "מומחה - יכולת לפתח מערכות מורכבות וידע עמוק",
  },
  educationLevel: {
    "high-school": "תיכונית",
    vocational: "הכשרה מקצועית",
    bachelor: "תואר ראשון",
    master: "תואר שני",
    phd: "דוקטורט",
  },
  specializations: {
    nlp: "עיבוד שפה טבעית (NLP)",
    "computer-vision": "ראייה ממוחשבת (Computer Vision)",
    "generative-ai": "בינה מלאכותית יצירתית (Generative AI)",
    "machine-learning": "למידת מכונה (Machine Learning)",
    mlops: "תשתיות ופריסה של מערכות AI (MLOps)",
  },
  preferredLearningMethod: {
    "hands-on": "למידה מעשית (Hands-on projects)",
    theoretical: "למידה תיאורטית עם הבנת היסודות",
    "self-paced": "למידה עצמאית בקצב אישי",
    mentored: "למידה בליווי מנטור",
    group: "למידה קבוצתית ושיתופית",
  },
  professionalBackground: {
    software: "פיתוח תוכנה / הנדסת תוכנה",
    data: "מדע הנתונים / אנליטיקה",
    management: "ניהול / מנהל עסקים",
    design: "עיצוב / UX / UI",
    marketing: "שיווק / מכירות",
    student: "סטודנט / בלימודים",
    other: "אחר",
  },
  dataScience: {
    none: "ללא ניסיון בתחום",
    basic: "בסיסי - הבנה בסיסית של מושגים",
    intermediate: "בינוני - התנסות בכלי ויזואליזציה וניתוח",
    advanced: "מתקדם - בניית מודלים ועבודה עם Big Data",
    expert: "מומחה - יכולת לפתח אלגוריתמים מורכבים",
  },
  careerStage: {
    student: "סטודנט/ית או בהכשרה",
    junior: "ג'וניור - בתחילת הדרך המקצועית",
    mid: "מיד-לבל - עם ניסיון של 3-5 שנים",
    senior: "סניור - מומחה/ית עם ניסיון משמעותי",
    leadership: "תפקיד ניהולי או הובלה מקצועית",
  },
};

const ProfessionalQuestionsPage: React.FC = () => {
  const { answers, updateAnswers } = useQuestionnaire();
  const { toast } = useToast();
  const [showValidationMessage, setShowValidationMessage] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    aiExperience: '',
    programmingSkill: '',
    educationLevel: '',
    specializations: '',
    preferredLearningMethod: '',
    professionalBackground: '',
    dataScience: '',
    careerStage: '',
  });

  useEffect(() => {
    // Load saved data if available
    if (answers && Object.keys(answers).length > 0) {
      // עדכן רק את השדות שקיימים בתשובות השמורות
      const updatedFormData = { ...formData };
      let hasUpdates = false;

      // בדוק כל שדה אם יש לו ערך שמור
      Object.keys(formData).forEach((key) => {
        const fieldKey = key as keyof FormData;
        if (answers[fieldKey]) {
          updatedFormData[fieldKey] = answers[fieldKey];
          hasUpdates = true;
        }
      });

      // עדכן את הטופס רק אם נמצאו עדכונים
      if (hasUpdates) {
        setFormData(updatedFormData);
      }
    }
  }, [answers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation message if user changes something
    if (showValidationMessage) {
      setShowValidationMessage(false);
    }
  };

  const handleCheckboxChange = (name: string, value: string, checked: boolean) => {
    setFormData((prev) => {
      const currentValues = [...(prev[name] || [])];
      if (checked && !currentValues.includes(value)) {
        return { ...prev, [name]: [...currentValues, value] };
      } else if (!checked && currentValues.includes(value)) {
        return { 
          ...prev, 
          [name]: currentValues.filter(item => item !== value) 
        };
      }
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // המרת ערכים באנגלית לטקסט בעברית לפני שמירה בדאטהבייס
      const hebrewFormData: Record<string, string> = {};
      
      // עבור כל שדה בטופס, המר את הערך לטקסט בעברית אם קיים
      Object.keys(formData).forEach((key) => {
        const field = key as keyof FormData;
        const value = formData[field];
        
        if (value && hebrewTextMapping[field]) {
          const mapping = hebrewTextMapping[field] as Record<string, string>;
          if (mapping[value]) {
            // שמור את הטקסט בעברית
            hebrewFormData[field] = mapping[value];
          } else {
            // אם אין מיפוי, שמור את הערך המקורי
            hebrewFormData[field] = value;
          }
        } else {
          // אם אין ערך או אין מיפוי לשדה, שמור את הערך המקורי (אם קיים)
          if (value) {
            hebrewFormData[field] = value;
          }
        }
      });
      
      console.log("נתונים שנשלחים לשרת:", hebrewFormData);
      
      // שומר את התשובות בעברית
      await updateAnswers(1, hebrewFormData);
      
      // בדוק אם יש שדות ריקים - רק להצגת האזהרה, לא למניעת ניווט
      const hasEmptyFields = Object.values(formData).some(value => !value);
      
      if (hasEmptyFields) {
        setShowValidationMessage(true);
        toast({
          title: "שדות חסרים",
          description: "לא מילאת את כל השאלות. מומלץ להשלים את כל השדות.",
          variant: "destructive",
        });
      } else {
        setShowValidationMessage(false);
      }
      
      // תמיד מחזיר true כדי לאפשר ניווט לדף הבא
      return true;
    } catch (error) {
      console.error("שגיאה בשמירת הנתונים:", error);
      toast({
        title: "אירעה שגיאה",
        description: "לא הצלחנו לשמור את התשובות שלך. אנא נסה שוב.",
        variant: "destructive",
      });
      // למרות השגיאה, עדיין מאפשרים ניווט
      return true;
    }
  };

  return (
    <QuestionPageLayout
      pageNumber={1}
      title="הפרופיל המקצועי שלך"
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
            <Label htmlFor="aiExperience" className="text-xl font-bold text-gray-900 block mb-3">מה רמת הניסיון שלך עם בינה מלאכותית?</Label>
            <RadioGroup 
              value={formData.aiExperience} 
              onValueChange={(value) => handleRadioChange('aiExperience', value)}
              className="space-y-3 mt-2"
              dir="rtl"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="beginner" id="ai-beginner" />
                <Label htmlFor="ai-beginner" className="text-gray-700 text-right w-full">מתחיל - היכרות בסיסית עם המושגים</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="intermediate" id="ai-intermediate" />
                <Label htmlFor="ai-intermediate" className="text-gray-700 text-right w-full">בינוני - התנסות בכלים ויישומים</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="advanced" id="ai-advanced" />
                <Label htmlFor="ai-advanced" className="text-gray-700 text-right w-full">מתקדם - עבודה עם מודלים ויישומים מורכבים</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="expert" id="ai-expert" />
                <Label htmlFor="ai-expert" className="text-gray-700 text-right w-full">מומחה - ניסיון בפיתוח ויישום פתרונות בתעשייה</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            <Label htmlFor="programmingSkill" className="text-xl font-bold text-gray-900 block mb-3">כיצד תדרג את מיומנויות התכנות שלך?</Label>
            <RadioGroup 
              value={formData.programmingSkill} 
              onValueChange={(value) => handleRadioChange('programmingSkill', value)}
              className="space-y-3 mt-2"
              dir="rtl"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="none" id="prog-none" />
                <Label htmlFor="prog-none" className="text-gray-700 text-right w-full">ללא ניסיון תכנותי</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="beginner" id="prog-beginner" />
                <Label htmlFor="prog-beginner" className="text-gray-700 text-right w-full">מתחיל - היכרות בסיסית עם שפת תכנות אחת או יותר</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="intermediate" id="prog-intermediate" />
                <Label htmlFor="prog-intermediate" className="text-gray-700 text-right w-full">בינוני - יכולת לבנות יישומים פשוטים</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="advanced" id="prog-advanced" />
                <Label htmlFor="prog-advanced" className="text-gray-700 text-right w-full">מתקדם - ניסיון רב בפיתוח ומספר שפות תכנות</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="expert" id="prog-expert" />
                <Label htmlFor="prog-expert" className="text-gray-700 text-right w-full">מומחה - יכולת לפתח מערכות מורכבות וידע עמוק</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            <Label htmlFor="educationLevel" className="text-xl font-bold text-gray-900 block mb-3">מהי רמת ההשכלה הגבוהה ביותר שלך?</Label>
            <RadioGroup 
              value={formData.educationLevel} 
              onValueChange={(value) => handleRadioChange('educationLevel', value)}
              className="space-y-3 mt-2"
              dir="rtl"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="high-school" id="edu-high-school" />
                <Label htmlFor="edu-high-school" className="text-gray-700 text-right w-full">תיכונית</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="vocational" id="edu-vocational" />
                <Label htmlFor="edu-vocational" className="text-gray-700 text-right w-full">הכשרה מקצועית</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="bachelor" id="edu-bachelor" />
                <Label htmlFor="edu-bachelor" className="text-gray-700 text-right w-full">תואר ראשון</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="master" id="edu-master" />
                <Label htmlFor="edu-master" className="text-gray-700 text-right w-full">תואר שני</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="phd" id="edu-phd" />
                <Label htmlFor="edu-phd" className="text-gray-700 text-right w-full">דוקטורט</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            <Label htmlFor="specializations" className="text-xl font-bold text-gray-900 block mb-3">באילו תחומי התמחות של AI אתה/את מתעניין/ת?</Label>
            <RadioGroup 
              value={formData.specializations} 
              onValueChange={(value) => handleRadioChange('specializations', value)}
              className="space-y-3 mt-2"
              dir="rtl"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="nlp" id="spec-nlp" />
                <Label htmlFor="spec-nlp" className="text-gray-700 text-right w-full">עיבוד שפה טבעית (NLP)</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="computer-vision" id="spec-cv" />
                <Label htmlFor="spec-cv" className="text-gray-700 text-right w-full">ראייה ממוחשבת (Computer Vision)</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="generative-ai" id="spec-gen" />
                <Label htmlFor="spec-gen" className="text-gray-700 text-right w-full">בינה מלאכותית יצירתית (Generative AI)</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="machine-learning" id="spec-ml" />
                <Label htmlFor="spec-ml" className="text-gray-700 text-right w-full">למידת מכונה (Machine Learning)</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="mlops" id="spec-mlops" />
                <Label htmlFor="spec-mlops" className="text-gray-700 text-right w-full">תשתיות ופריסה של מערכות AI (MLOps)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            <Label htmlFor="preferredLearningMethod" className="text-xl font-bold text-gray-900 block mb-3">איזו שיטת למידה אתה/את מעדיף/ה?</Label>
            <RadioGroup 
              value={formData.preferredLearningMethod} 
              onValueChange={(value) => handleRadioChange('preferredLearningMethod', value)}
              className="space-y-3 mt-2"
              dir="rtl"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="hands-on" id="learn-hands-on" />
                <Label htmlFor="learn-hands-on" className="text-gray-700 text-right w-full">למידה מעשית (Hands-on projects)</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="theoretical" id="learn-theoretical" />
                <Label htmlFor="learn-theoretical" className="text-gray-700 text-right w-full">למידה תיאורטית עם הבנת היסודות</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="self-paced" id="learn-self-paced" />
                <Label htmlFor="learn-self-paced" className="text-gray-700 text-right w-full">למידה עצמאית בקצב אישי</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="mentored" id="learn-mentored" />
                <Label htmlFor="learn-mentored" className="text-gray-700 text-right w-full">למידה בליווי מנטור</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="group" id="learn-group" />
                <Label htmlFor="learn-group" className="text-gray-700 text-right w-full">למידה קבוצתית ושיתופית</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            <Label htmlFor="professionalBackground" className="text-xl font-bold text-gray-900 block mb-3">מה הרקע המקצועי העיקרי שלך?</Label>
            <RadioGroup 
              value={formData.professionalBackground} 
              onValueChange={(value) => handleRadioChange('professionalBackground', value)}
              className="space-y-3 mt-2"
              dir="rtl"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="software" id="bg-software" />
                <Label htmlFor="bg-software" className="text-gray-700 text-right w-full">פיתוח תוכנה / הנדסת תוכנה</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="data" id="bg-data" />
                <Label htmlFor="bg-data" className="text-gray-700 text-right w-full">מדע הנתונים / אנליטיקה</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="management" id="bg-management" />
                <Label htmlFor="bg-management" className="text-gray-700 text-right w-full">ניהול / מנהל עסקים</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="design" id="bg-design" />
                <Label htmlFor="bg-design" className="text-gray-700 text-right w-full">עיצוב / UX / UI</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="marketing" id="bg-marketing" />
                <Label htmlFor="bg-marketing" className="text-gray-700 text-right w-full">שיווק / מכירות</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="student" id="bg-student" />
                <Label htmlFor="bg-student" className="text-gray-700 text-right w-full">סטודנט / בלימודים</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="other" id="bg-other" />
                <Label htmlFor="bg-other" className="text-gray-700 text-right w-full">אחר</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            <Label htmlFor="dataScience" className="text-xl font-bold text-gray-900 block mb-3">מהי רמת הידע שלך במדע הנתונים?</Label>
            <RadioGroup 
              value={formData.dataScience} 
              onValueChange={(value) => handleRadioChange('dataScience', value)}
              className="space-y-3 mt-2"
              dir="rtl"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="none" id="ds-none" />
                <Label htmlFor="ds-none" className="text-gray-700 text-right w-full">ללא ידע</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="basic" id="ds-basic" />
                <Label htmlFor="ds-basic" className="text-gray-700 text-right w-full">בסיסי - הבנה בסיסית של מושגים</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="intermediate" id="ds-intermediate" />
                <Label htmlFor="ds-intermediate" className="text-gray-700 text-right w-full">בינוני - התנסות בכלי ויזואליזציה וניתוח</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="advanced" id="ds-advanced" />
                <Label htmlFor="ds-advanced" className="text-gray-700 text-right w-full">מתקדם - בניית מודלים ועבודה עם Big Data</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="expert" id="ds-expert" />
                <Label htmlFor="ds-expert" className="text-gray-700 text-right w-full">מומחה - יכולת לפתח אלגוריתמים מורכבים</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            <Label htmlFor="careerStage" className="text-xl font-bold text-gray-900 block mb-3">באיזה שלב בקריירה אתה/את כרגע?</Label>
            <RadioGroup 
              value={formData.careerStage} 
              onValueChange={(value) => handleRadioChange('careerStage', value)}
              className="space-y-3 mt-2"
              dir="rtl"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="student" id="career-student" />
                <Label htmlFor="career-student" className="text-gray-700 text-right w-full">סטודנט/ית או בהכשרה</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="junior" id="career-junior" />
                <Label htmlFor="career-junior" className="text-gray-700 text-right w-full">ג'וניור - בתחילת הדרך המקצועית</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="mid" id="career-mid" />
                <Label htmlFor="career-mid" className="text-gray-700 text-right w-full">מיד-לבל - עם ניסיון של 3-5 שנים</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="senior" id="career-senior" />
                <Label htmlFor="career-senior" className="text-gray-700 text-right w-full">סניור - מומחה/ית עם ניסיון משמעותי</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="leadership" id="career-leadership" />
                <Label htmlFor="career-leadership" className="text-gray-700 text-right w-full">תפקיד ניהולי או הובלה מקצועית</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </QuestionPageLayout>
  );
};

export default ProfessionalQuestionsPage;
