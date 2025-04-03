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
  learningPurpose: string;
  personalityType: string;
  workPreference: string;
  challengeHandling: string;
  decisionMaking: string;
  feedbackPreference: string;
  motivationSource: string;
  stressManagement: string;
};

// המיפוי של ערכי השדות באנגלית לטקסט בעברית
const hebrewTextMapping = {
  learningPurpose: {
    career: "פיתוח קריירה ומציאת עבודה בתחום",
    entrepreneurship: "הקמת מיזם או פיתוח מוצר עצמאי",
    upskill: "שדרוג מיומנויות לתפקיד הנוכחי",
    interest: "סקרנות אישית והרחבת אופקים",
    research: "מחקר אקדמי או פיתוח ידע מתקדם",
  },
  personalityType: {
    analytical: "אנליטי/ת - שיטתי/ת, מעמיק/ה בפרטים ומונע/ת מנתונים",
    creative: "יצירתי/ת - חדשני/ת, פתוח/ה לרעיונות ואוהב/ת לחשוב מחוץ לקופסה",
    organized: "מאורגן/ת - מתכנן/ת היטב, מתמקד/ת במשימות ואוהב/ת סדר",
    social: "חברתי/ת - נהנה/ית לעבוד עם אנשים ולשתף פעולה",
    pragmatic: "פרגמטי/ת - מעשי/ת, ממוקד/ת בתוצאות ובפתרונות",
  },
  workPreference: {
    independent: "עצמאי/ת - עם חופש לבחור את הדרך שלי",
    collaborative: "בשיתוף פעולה - בצוות עם רעיונות משותפים",
    structured: "במסגרת מובנית - עם הנחיות ברורות",
    exploratory: "באופן חקרני - לגלות בעצמי ולפתח רעיונות",
    mentor: "בליווי מנטור - עם הדרכה אישית ומשוב",
  },
  challengeHandling: {
    systematic: "בגישה שיטתית - פירוק הבעיה לחלקים קטנים",
    intuitive: "באינטואיציה - הסתמכות על תחושות וניסיון",
    collaborative: "בעזרת אחרים - התייעצות ושיתוף פעולה",
    research: "בחקירה - למידה מעמיקה לפני פעולה",
    experimental: "בניסוי וטעייה - התנסות מעשית ולמידה תוך כדי",
  },
  decisionMaking: {
    logical: "בגישה לוגית - ניתוח עובדות ונתונים",
    emotional: "בהתבסס על רגש - מה מרגיש נכון",
    experienced: "בהסתמך על ניסיון קודם - מה עבד בעבר",
    weighing: "בשקילת יתרונות וחסרונות - השוואת אפשרויות",
    quick: "במהירות - אינטואיטיבי ומתקדם",
  },
  feedbackPreference: {
    direct: "ישיר וברור - גם אם זה ביקורתי",
    constructive: "בונה - עם דגש על איך להשתפר",
    positive: "חיובי - המדגיש את החוזקות שלי",
    detailed: "מפורט - עם דוגמאות ספציפיות",
    minimal: "מינימלי - רק כשבאמת צריך",
  },
  motivationSource: {
    curiosity: "סקרנות - הרצון לדעת ולהבין",
    achievement: "הישגים - תחושת הצלחה והתקדמות",
    impact: "השפעה - היכולת ליצור שינוי משמעותי",
    recognition: "הכרה - הערכה מאחרים על הידע שלי",
    mastery: "מומחיות - שליטה מלאה בתחום",
  },
  stressManagement: {
    planning: "בתכנון מדוקדק - ארגון וניהול זמן",
    breaks: "בהפסקות קצרות - התרעננות ואיפוס",
    support: "בתמיכה חברתית - שיחה עם אחרים",
    refocus: "במיקוד מחדש - התמקדות במה שחשוב באמת",
    physical: "בפעילות פיזית - ספורט או תנועה",
  },
};

const PersonalQuestionsPage: React.FC = () => {
  const { answers, updateAnswers } = useQuestionnaire();
  const { toast } = useToast();
  const [showValidationMessage, setShowValidationMessage] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    learningPurpose: '',
    personalityType: '',
    workPreference: '',
    challengeHandling: '',
    decisionMaking: '',
    feedbackPreference: '',
    motivationSource: '',
    stressManagement: '',
  });

  useEffect(() => {
    // Load saved data if available
    if (answers && Object.keys(answers).length > 0) {
      setFormData({
        learningPurpose: answers.learningPurpose || '',
        personalityType: answers.personalityType || '',
        workPreference: answers.workPreference || '',
        challengeHandling: answers.challengeHandling || '',
        decisionMaking: answers.decisionMaking || '',
        feedbackPreference: answers.feedbackPreference || '',
        motivationSource: answers.motivationSource || '',
        stressManagement: answers.stressManagement || '',
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
    await updateAnswers(2, hebrewFormData);
    
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
      pageNumber={2}
      title="הפרופיל האישי שלך"
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
            <Label htmlFor="learningPurpose" className="text-xl font-bold text-gray-900 block mb-3">מה המטרה העיקרית שלך בלימוד בינה מלאכותית?</Label>
            <RadioGroup 
              value={formData.learningPurpose} 
              onValueChange={(value) => handleRadioChange('learningPurpose', value)}
              className="space-y-3 mt-2"
              dir="rtl"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="career" id="purpose-career" />
                <Label htmlFor="purpose-career" className="text-gray-700 text-right w-full">פיתוח קריירה ומציאת עבודה בתחום</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="entrepreneurship" id="purpose-entrepreneurship" />
                <Label htmlFor="purpose-entrepreneurship" className="text-gray-700 text-right w-full">הקמת מיזם או פיתוח מוצר עצמאי</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="upskill" id="purpose-upskill" />
                <Label htmlFor="purpose-upskill" className="text-gray-700 text-right w-full">שדרוג מיומנויות לתפקיד הנוכחי</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="interest" id="purpose-interest" />
                <Label htmlFor="purpose-interest" className="text-gray-700 text-right w-full">סקרנות אישית והרחבת אופקים</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="research" id="purpose-research" />
                <Label htmlFor="purpose-research" className="text-gray-700 text-right w-full">מחקר אקדמי או פיתוח ידע מתקדם</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            <Label htmlFor="personalityType" className="text-xl font-bold text-gray-900 block mb-3">איזה סגנון אישיות מתאר אותך בצורה הטובה ביותר?</Label>
            <RadioGroup 
              value={formData.personalityType} 
              onValueChange={(value) => handleRadioChange('personalityType', value)}
              className="space-y-3 mt-2"
              dir="rtl"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="analytical" id="personality-analytical" />
                <Label htmlFor="personality-analytical" className="text-gray-700 text-right w-full">אנליטי/ת - שיטתי/ת, מעמיק/ה בפרטים ומונע/ת מנתונים</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="creative" id="personality-creative" />
                <Label htmlFor="personality-creative" className="text-gray-700 text-right w-full">יצירתי/ת - חדשני/ת, פתוח/ה לרעיונות ואוהב/ת לחשוב מחוץ לקופסה</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="organized" id="personality-organized" />
                <Label htmlFor="personality-organized" className="text-gray-700 text-right w-full">מאורגן/ת - מתכנן/ת היטב, מתמקד/ת במשימות ואוהב/ת סדר</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="social" id="personality-social" />
                <Label htmlFor="personality-social" className="text-gray-700 text-right w-full">חברתי/ת - נהנה/ית לעבוד עם אנשים ולשתף פעולה</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="pragmatic" id="personality-pragmatic" />
                <Label htmlFor="personality-pragmatic" className="text-gray-700 text-right w-full">פרגמטי/ת - מעשי/ת, ממוקד/ת בתוצאות ובפתרונות</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            <Label htmlFor="workPreference" className="text-xl font-bold text-gray-900 block mb-3">איך אתה/את מעדיף/ה לעבוד?</Label>
            <RadioGroup 
              value={formData.workPreference} 
              onValueChange={(value) => handleRadioChange('workPreference', value)}
              className="space-y-3 mt-2"
              dir="rtl"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="independent" id="work-independent" />
                <Label htmlFor="work-independent" className="text-gray-700 text-right w-full">עצמאי/ת - עם חופש לבחור את הדרך שלי</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="collaborative" id="work-collaborative" />
                <Label htmlFor="work-collaborative" className="text-gray-700 text-right w-full">בשיתוף פעולה - בצוות עם רעיונות משותפים</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="structured" id="work-structured" />
                <Label htmlFor="work-structured" className="text-gray-700 text-right w-full">במסגרת מובנית - עם הנחיות ברורות</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="exploratory" id="work-exploratory" />
                <Label htmlFor="work-exploratory" className="text-gray-700 text-right w-full">באופן חקרני - לגלות בעצמי ולפתח רעיונות</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="mentor" id="work-mentor" />
                <Label htmlFor="work-mentor" className="text-gray-700 text-right w-full">בליווי מנטור - עם הדרכה אישית ומשוב</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            <Label htmlFor="challengeHandling" className="text-xl font-bold text-gray-900 block mb-3">איך אתה/את מתמודד/ת עם אתגרים?</Label>
            <RadioGroup 
              value={formData.challengeHandling} 
              onValueChange={(value) => handleRadioChange('challengeHandling', value)}
              className="space-y-3 mt-2"
              dir="rtl"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="systematic" id="challenge-systematic" />
                <Label htmlFor="challenge-systematic" className="text-gray-700 text-right w-full">בגישה שיטתית - פירוק הבעיה לחלקים קטנים</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="intuitive" id="challenge-intuitive" />
                <Label htmlFor="challenge-intuitive" className="text-gray-700 text-right w-full">באינטואיציה - הסתמכות על תחושות וניסיון</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="collaborative" id="challenge-collaborative" />
                <Label htmlFor="challenge-collaborative" className="text-gray-700 text-right w-full">בעזרת אחרים - התייעצות ושיתוף פעולה</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="research" id="challenge-research" />
                <Label htmlFor="challenge-research" className="text-gray-700 text-right w-full">בחקירה - למידה מעמיקה לפני פעולה</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="experimental" id="challenge-experimental" />
                <Label htmlFor="challenge-experimental" className="text-gray-700 text-right w-full">בניסוי וטעייה - התנסות מעשית ולמידה תוך כדי</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            <Label htmlFor="decisionMaking" className="text-xl font-bold text-gray-900 block mb-3">איך אתה/את מקבל/ת החלטות בדרך כלל?</Label>
            <RadioGroup 
              value={formData.decisionMaking} 
              onValueChange={(value) => handleRadioChange('decisionMaking', value)}
              className="space-y-3 mt-2"
              dir="rtl"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="logical" id="decision-logical" />
                <Label htmlFor="decision-logical" className="text-gray-700 text-right w-full">בגישה לוגית - ניתוח עובדות ונתונים</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="emotional" id="decision-emotional" />
                <Label htmlFor="decision-emotional" className="text-gray-700 text-right w-full">בהתבסס על רגש - מה מרגיש נכון</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="experienced" id="decision-experienced" />
                <Label htmlFor="decision-experienced" className="text-gray-700 text-right w-full">בהסתמך על ניסיון קודם - מה עבד בעבר</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="weighing" id="decision-weighing" />
                <Label htmlFor="decision-weighing" className="text-gray-700 text-right w-full">בשקילת יתרונות וחסרונות - השוואת אפשרויות</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="quick" id="decision-quick" />
                <Label htmlFor="decision-quick" className="text-gray-700 text-right w-full">במהירות - אינטואיטיבי ומתקדם</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            <Label htmlFor="feedbackPreference" className="text-xl font-bold text-gray-900 block mb-3">איזה סוג משוב אתה/את מעדיף/ה לקבל?</Label>
            <RadioGroup 
              value={formData.feedbackPreference} 
              onValueChange={(value) => handleRadioChange('feedbackPreference', value)}
              className="space-y-3 mt-2"
              dir="rtl"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="direct" id="feedback-direct" />
                <Label htmlFor="feedback-direct" className="text-gray-700 text-right w-full">ישיר וברור - גם אם זה ביקורתי</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="constructive" id="feedback-constructive" />
                <Label htmlFor="feedback-constructive" className="text-gray-700 text-right w-full">בונה - עם דגש על איך להשתפר</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="positive" id="feedback-positive" />
                <Label htmlFor="feedback-positive" className="text-gray-700 text-right w-full">חיובי - המדגיש את החוזקות שלי</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="detailed" id="feedback-detailed" />
                <Label htmlFor="feedback-detailed" className="text-gray-700 text-right w-full">מפורט - עם דוגמאות ספציפיות</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="minimal" id="feedback-minimal" />
                <Label htmlFor="feedback-minimal" className="text-gray-700 text-right w-full">מינימלי - רק כשבאמת צריך</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            <Label htmlFor="motivationSource" className="text-xl font-bold text-gray-900 block mb-3">מה מניע אותך בלמידה וצמיחה?</Label>
            <RadioGroup 
              value={formData.motivationSource} 
              onValueChange={(value) => handleRadioChange('motivationSource', value)}
              className="space-y-3 mt-2"
              dir="rtl"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="curiosity" id="motivation-curiosity" />
                <Label htmlFor="motivation-curiosity" className="text-gray-700 text-right w-full">סקרנות - הרצון לדעת ולהבין</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="achievement" id="motivation-achievement" />
                <Label htmlFor="motivation-achievement" className="text-gray-700 text-right w-full">הישגים - תחושת הצלחה והתקדמות</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="impact" id="motivation-impact" />
                <Label htmlFor="motivation-impact" className="text-gray-700 text-right w-full">השפעה - היכולת ליצור שינוי משמעותי</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="recognition" id="motivation-recognition" />
                <Label htmlFor="motivation-recognition" className="text-gray-700 text-right w-full">הכרה - הערכה מאחרים על הידע שלי</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="mastery" id="motivation-mastery" />
                <Label htmlFor="motivation-mastery" className="text-gray-700 text-right w-full">מומחיות - שליטה מלאה בתחום</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            <Label htmlFor="stressManagement" className="text-xl font-bold text-gray-900 block mb-3">איך אתה/את מתמודד/ת עם לחץ?</Label>
            <RadioGroup 
              value={formData.stressManagement} 
              onValueChange={(value) => handleRadioChange('stressManagement', value)}
              className="space-y-3 mt-2"
              dir="rtl"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="planning" id="stress-planning" />
                <Label htmlFor="stress-planning" className="text-gray-700 text-right w-full">בתכנון מדוקדק - ארגון וניהול זמן</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="breaks" id="stress-breaks" />
                <Label htmlFor="stress-breaks" className="text-gray-700 text-right w-full">בהפסקות קצרות - התרעננות ואיפוס</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="support" id="stress-support" />
                <Label htmlFor="stress-support" className="text-gray-700 text-right w-full">בתמיכה חברתית - שיחה עם אחרים</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="refocus" id="stress-refocus" />
                <Label htmlFor="stress-refocus" className="text-gray-700 text-right w-full">במיקוד מחדש - התמקדות במה שחשוב באמת</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="physical" id="stress-physical" />
                <Label htmlFor="stress-physical" className="text-gray-700 text-right w-full">בפעילות פיזית - ספורט או תנועה</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </QuestionPageLayout>
  );
};

export default PersonalQuestionsPage;
