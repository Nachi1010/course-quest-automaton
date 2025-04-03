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
    strengths: answers.strengths || '',
    learningEnvironment: answers.learningEnvironment || '',
    learningGoals: answers.learningGoals || '',
    previousAiCourses: answers.previousAiCourses || '',
    careerAspirations: answers.careerAspirations || '',
    learningObstacles: answers.learningObstacles || '',
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
        strengths: answers.strengths || '',
        learningEnvironment: answers.learningEnvironment || '',
        learningGoals: answers.learningGoals || '',
        previousAiCourses: answers.previousAiCourses || '',
        careerAspirations: answers.careerAspirations || '',
        learningObstacles: answers.learningObstacles || '',
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
        description: "אנא בחר את המוטיבציות שלך ללמידת AI",
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
          <RadioGroup 
            value={formData.motivations} 
            onValueChange={(value) => handleRadioChange('motivations', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="career" id="motivation-career" />
              <Label htmlFor="motivation-career">קידום קריירה ופיתוח מקצועי</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="interest" id="motivation-interest" />
              <Label htmlFor="motivation-interest">עניין אישי וסקרנות טכנולוגית</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="business" id="motivation-business" />
              <Label htmlFor="motivation-business">פיתוח מיזם עסקי או מוצר</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="academic" id="motivation-academic" />
              <Label htmlFor="motivation-academic">מחקר אקדמי או לימודים מתקדמים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="industry" id="motivation-industry" />
              <Label htmlFor="motivation-industry">התעדכנות בחידושים בתעשייה</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="learningGoals">מהן המטרות האישיות שלך בלמידת AI?</Label>
          <RadioGroup 
            value={formData.learningGoals} 
            onValueChange={(value) => handleRadioChange('learningGoals', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="career-change" id="goal-career-change" />
              <Label htmlFor="goal-career-change">מעבר קריירה לתחום ה-AI</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="skill-upgrade" id="goal-skill-upgrade" />
              <Label htmlFor="goal-skill-upgrade">שדרוג כישורים מקצועיים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="startup" id="goal-startup" />
              <Label htmlFor="goal-startup">יזמות וסטארטאפ בתחום ה-AI</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="academic" id="goal-academic" />
              <Label htmlFor="goal-academic">מחקר אקדמי</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="hobby" id="goal-hobby" />
              <Label htmlFor="goal-hobby">תחביב והעשרה אישית</Label>
            </div>
          </RadioGroup>
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
          <RadioGroup 
            value={formData.careerAspirations} 
            onValueChange={(value) => handleRadioChange('careerAspirations', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="ai-engineer" id="career-ai-engineer" />
              <Label htmlFor="career-ai-engineer">מהנדס/ת AI</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="data-scientist" id="career-data-scientist" />
              <Label htmlFor="career-data-scientist">מדען/ית נתונים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="research" id="career-research" />
              <Label htmlFor="career-research">חוקר/ת באקדמיה או בתעשייה</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="entrepreneur" id="career-entrepreneur" />
              <Label htmlFor="career-entrepreneur">יזם/ית טכנולוגי/ת</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="management" id="career-management" />
              <Label htmlFor="career-management">ניהול צוותי AI</Label>
            </div>
          </RadioGroup>
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
              <Label htmlFor="env-quiet">סביבה שקטה ומבודדת</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="collaborative" id="env-collaborative" />
              <Label htmlFor="env-collaborative">סביבה שיתופית עם עמיתים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="structured" id="env-structured" />
              <Label htmlFor="env-structured">סביבה מובנית עם הנחייה ברורה</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="flexible" id="env-flexible" />
              <Label htmlFor="env-flexible">סביבה גמישה המאפשרת חופש</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="hands-on" id="env-hands-on" />
              <Label htmlFor="env-hands-on">סביבה מעשית עם התנסות</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeCommitment">כמה זמן בשבוע את/ה מוכן/ה להקדיש ללימודי AI?</Label>
          <RadioGroup 
            value={formData.timeCommitment} 
            onValueChange={(value) => handleRadioChange('timeCommitment', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="0-2" id="time-0-2" />
              <Label htmlFor="time-0-2">פחות מ-2 שעות בשבוע</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="2-5" id="time-2-5" />
              <Label htmlFor="time-2-5">2-5 שעות בשבוע</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="5-10" id="time-5-10" />
              <Label htmlFor="time-5-10">5-10 שעות בשבוע</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="10-20" id="time-10-20" />
              <Label htmlFor="time-10-20">10-20 שעות בשבוע</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="20+" id="time-20-plus" />
              <Label htmlFor="time-20-plus">יותר מ-20 שעות בשבוע</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="previousAiCourses">האם השתתפת בעבר בקורסים בנושא AI?</Label>
          <RadioGroup 
            value={formData.previousAiCourses} 
            onValueChange={(value) => handleRadioChange('previousAiCourses', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="none" id="prev-none" />
              <Label htmlFor="prev-none">לא, זה הקורס הראשון שלי</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="one-online" id="prev-one-online" />
              <Label htmlFor="prev-one-online">כן, קורס מקוון אחד</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="several-online" id="prev-several-online" />
              <Label htmlFor="prev-several-online">כן, מספר קורסים מקוונים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="academic" id="prev-academic" />
              <Label htmlFor="prev-academic">כן, קורסים אקדמיים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="professional" id="prev-professional" />
              <Label htmlFor="prev-professional">כן, הכשרות מקצועיות</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="learningChallenges">מהו האתגר הגדול ביותר שלך בלמידת טכנולוגיות חדשות?</Label>
          <RadioGroup 
            value={formData.learningChallenges} 
            onValueChange={(value) => handleRadioChange('learningChallenges', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="time" id="challenge-time" />
              <Label htmlFor="challenge-time">מחסור בזמן</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="background" id="challenge-background" />
              <Label htmlFor="challenge-background">חוסר בידע רקע מספק</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="motivation" id="challenge-motivation" />
              <Label htmlFor="challenge-motivation">שמירה על מוטיבציה לאורך זמן</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="practice" id="challenge-practice" />
              <Label htmlFor="challenge-practice">מציאת הזדמנויות לתרגול מעשי</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="resources" id="challenge-resources" />
              <Label htmlFor="challenge-resources">מציאת משאבי למידה איכותיים</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="communicationPreference">מהי העדפת התקשורת שלך?</Label>
          <RadioGroup 
            value={formData.communicationPreference} 
            onValueChange={(value) => handleRadioChange('communicationPreference', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="email" id="comm-email" />
              <Label htmlFor="comm-email">דוא"ל</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="phone" id="comm-phone" />
              <Label htmlFor="comm-phone">שיחת טלפון</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="video" id="comm-video" />
              <Label htmlFor="comm-video">שיחת וידאו</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="messaging" id="comm-messaging" />
              <Label htmlFor="comm-messaging">הודעות מיידיות (WhatsApp/Telegram)</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="in-person" id="comm-in-person" />
              <Label htmlFor="comm-in-person">מפגשים פנים אל פנים</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </QuestionPageLayout>
  );
};

export default PersonalQuestionsPage;
