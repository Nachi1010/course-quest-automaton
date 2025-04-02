
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
    learningEnvironment: answers.learningEnvironment || '',
    learningGoals: answers.learningGoals || '',
    previousAiCourses: answers.previousAiCourses || '',
    careerAspirations: answers.careerAspirations || '',
    learningObstacles: answers.learningObstacles || [],
    communicationPreference: answers.communicationPreference || '',
    feedbackPreference: answers.feedbackPreference || '',
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
        learningEnvironment: answers.learningEnvironment || '',
        learningGoals: answers.learningGoals || '',
        previousAiCourses: answers.previousAiCourses || '',
        careerAspirations: answers.careerAspirations || '',
        learningObstacles: answers.learningObstacles || [],
        communicationPreference: answers.communicationPreference || '',
        feedbackPreference: answers.feedbackPreference || '',
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
          <Label htmlFor="learningGoals">מהן המטרות האישיות שלך בלמידת AI?</Label>
          <Select 
            value={formData.learningGoals} 
            onValueChange={(value) => handleSelectChange('learningGoals', value)}
          >
            <SelectTrigger id="learningGoals" className="w-full">
              <SelectValue placeholder="בחר/י מתוך האפשרויות" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="career-change">מעבר קריירה לתחום ה-AI</SelectItem>
              <SelectItem value="skill-upgrade">שדרוג כישורים מקצועיים</SelectItem>
              <SelectItem value="startup">יזמות וסטארטאפ בתחום ה-AI</SelectItem>
              <SelectItem value="academic">מחקר אקדמי</SelectItem>
              <SelectItem value="hobby">תחביב והעשרה אישית</SelectItem>
            </SelectContent>
          </Select>
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
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="leadership" id="style-leadership" />
              <Label htmlFor="style-leadership">מנהיגותי/ת - מעדיף/ה להוביל צוות</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="supportive" id="style-supportive" />
              <Label htmlFor="style-supportive">תומך/ת - מעדיף/ה לסייע לאחרים</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="careerAspirations">מהן השאיפות הקריירה שלך בטווח הארוך?</Label>
          <Select 
            value={formData.careerAspirations} 
            onValueChange={(value) => handleSelectChange('careerAspirations', value)}
          >
            <SelectTrigger id="careerAspirations" className="w-full">
              <SelectValue placeholder="בחר/י מתוך האפשרויות" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ai-engineer">מהנדס/ת AI</SelectItem>
              <SelectItem value="data-scientist">מדען/ית נתונים</SelectItem>
              <SelectItem value="research">חוקר/ת באקדמיה או בתעשייה</SelectItem>
              <SelectItem value="entrepreneur">יזם/ית טכנולוגי/ת</SelectItem>
              <SelectItem value="management">ניהול צוותי AI</SelectItem>
              <SelectItem value="consulting">ייעוץ AI</SelectItem>
              <SelectItem value="educator">הוראה והדרכה בתחום</SelectItem>
              <SelectItem value="current-enhancement">שיפור התפקיד הנוכחי</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="learningEnvironment">באיזו סביבת למידה את/ה הכי אפקטיבי/ת?</Label>
          <RadioGroup 
            value={formData.learningEnvironment} 
            onValueChange={(value) => handleRadioChange('learningEnvironment', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="quiet" id="env-quiet" />
              <Label htmlFor="env-quiet">סביבה שקטה ופרטית</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="busy" id="env-busy" />
              <Label htmlFor="env-busy">סביבה תוססת עם אנשים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="outdoor" id="env-outdoor" />
              <Label htmlFor="env-outdoor">מרחבים פתוחים וטבע</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="night" id="env-night" />
              <Label htmlFor="env-night">בשעות הלילה המאוחרות</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="adaptable" id="env-adaptable" />
              <Label htmlFor="env-adaptable">מסתגל/ת לכל סביבה</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>מהם המכשולים העיקריים ללמידה שלך? (ניתן לבחור כמה אפשרויות)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            {[
              { id: 'time', label: 'מגבלות זמן' },
              { id: 'technical', label: 'פערי ידע טכני' },
              { id: 'mathematical', label: 'קושי במתמטיקה' },
              { id: 'focus', label: 'קושי בריכוז לאורך זמן' },
              { id: 'motivation', label: 'שמירה על מוטיבציה' },
              { id: 'resources', label: 'גישה למשאבים' },
              { id: 'language', label: 'קשיי שפה' },
              { id: 'confidence', label: 'חוסר בטחון עצמי' },
            ].map(item => (
              <div key={item.id} className="flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox 
                  id={`obstacle-${item.id}`} 
                  checked={(formData.learningObstacles || []).includes(item.id)}
                  onCheckedChange={(checked) => handleCheckboxChange('learningObstacles', item.id, checked === true)}
                />
                <Label htmlFor={`obstacle-${item.id}`}>{item.label}</Label>
              </div>
            ))}
          </div>
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
              { id: 'fast-learning', label: 'למידה מהירה' },
              { id: 'teamwork', label: 'עבודת צוות' },
            ].map(item => (
              <div key={item.id} className="flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox 
                  id={item.id} 
                  checked={(formData.strengths || []).includes(item.id)}
                  onCheckedChange={(checked) => handleCheckboxChange('strengths', item.id, checked === true)}
                />
                <Label htmlFor={item.id}>{item.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="previousAiCourses">האם למדת בעבר קורסים בתחום ה-AI או מדע הנתונים?</Label>
          <RadioGroup 
            value={formData.previousAiCourses} 
            onValueChange={(value) => handleRadioChange('previousAiCourses', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="none" id="courses-none" />
              <Label htmlFor="courses-none">לא למדתי קורסים בתחום</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="online-free" id="courses-online-free" />
              <Label htmlFor="courses-online-free">קורסים מקוונים חינמיים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="online-paid" id="courses-online-paid" />
              <Label htmlFor="courses-online-paid">קורסים מקוונים בתשלום</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="academic" id="courses-academic" />
              <Label htmlFor="courses-academic">קורסים אקדמיים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="bootcamp" id="courses-bootcamp" />
              <Label htmlFor="courses-bootcamp">מחנה אימונים (bootcamp)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="communicationPreference">איך את/ה מעדיף/ה לתקשר במהלך הקורס?</Label>
          <Select 
            value={formData.communicationPreference} 
            onValueChange={(value) => handleSelectChange('communicationPreference', value)}
          >
            <SelectTrigger id="communicationPreference" className="w-full">
              <SelectValue placeholder="בחר/י מתוך האפשרויות" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">אימייל</SelectItem>
              <SelectItem value="forum">פורום דיונים</SelectItem>
              <SelectItem value="chat">צ'אט קבוצתי (סלאק, דיסקורד וכו')</SelectItem>
              <SelectItem value="video">שיחות וידאו</SelectItem>
              <SelectItem value="in-person">פגישות פנים מול פנים</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="feedbackPreference">איזה סוג משוב את/ה מעדיף/ה לקבל?</Label>
          <RadioGroup 
            value={formData.feedbackPreference} 
            onValueChange={(value) => handleRadioChange('feedbackPreference', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="direct" id="feedback-direct" />
              <Label htmlFor="feedback-direct">ישיר ומפורט</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="gentle" id="feedback-gentle" />
              <Label htmlFor="feedback-gentle">עדין ותומך</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="written" id="feedback-written" />
              <Label htmlFor="feedback-written">בכתב</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="verbal" id="feedback-verbal" />
              <Label htmlFor="feedback-verbal">בעל פה</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="peer" id="feedback-peer" />
              <Label htmlFor="feedback-peer">מעמיתים לקורס</Label>
            </div>
          </RadioGroup>
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
