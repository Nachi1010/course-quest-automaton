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

const ProfessionalQuestionsPage: React.FC = () => {
  const { answers, updateAnswers } = useQuestionnaire();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    yearsExperience: answers.yearsExperience || '',
    programmingLanguages: answers.programmingLanguages || '',
    aiExperience: answers.aiExperience || '',
    preferredLearningMethod: answers.preferredLearningMethod || '',
    projectGoals: answers.projectGoals || '',
    educationLevel: answers.educationLevel || '',
    softwareDevelopmentRoles: answers.softwareDevelopmentRoles || '',
    companySize: answers.companySize || '',
    industryExperience: answers.industryExperience || '',
    dataScience: answers.dataScience || '',
    frameworks: answers.frameworks || '',
    cloudPlatforms: answers.cloudPlatforms || '',
    aiModelsUsed: answers.aiModelsUsed || '',
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
        educationLevel: answers.educationLevel || '',
        softwareDevelopmentRoles: answers.softwareDevelopmentRoles || '',
        companySize: answers.companySize || '',
        industryExperience: answers.industryExperience || '',
        dataScience: answers.dataScience || '',
        frameworks: answers.frameworks || '',
        cloudPlatforms: answers.cloudPlatforms || '',
        aiModelsUsed: answers.aiModelsUsed || '',
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
          <RadioGroup 
            value={formData.yearsExperience} 
            onValueChange={(value) => handleRadioChange('yearsExperience', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="0-1" id="years-0-1" />
              <Label htmlFor="years-0-1">פחות משנה</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="1-3" id="years-1-3" />
              <Label htmlFor="years-1-3">1-3 שנים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="3-5" id="years-3-5" />
              <Label htmlFor="years-3-5">3-5 שנים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="5-10" id="years-5-10" />
              <Label htmlFor="years-5-10">5-10 שנים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="10+" id="years-10-plus" />
              <Label htmlFor="years-10-plus">10+ שנים</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="educationLevel">מהי רמת ההשכלה הגבוהה ביותר שלך?</Label>
          <RadioGroup 
            value={formData.educationLevel} 
            onValueChange={(value) => handleRadioChange('educationLevel', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="high-school" id="edu-high-school" />
              <Label htmlFor="edu-high-school">תעודת בגרות</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="vocational" id="edu-vocational" />
              <Label htmlFor="edu-vocational">לימודי מקצוע / הכשרה טכנית</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="bachelor" id="edu-bachelor" />
              <Label htmlFor="edu-bachelor">תואר ראשון</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="master" id="edu-master" />
              <Label htmlFor="edu-master">תואר שני</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="phd" id="edu-phd" />
              <Label htmlFor="edu-phd">דוקטורט</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="softwareDevelopmentRoles">מהו תפקידך העיקרי בפיתוח תוכנה?</Label>
          <RadioGroup 
            value={formData.softwareDevelopmentRoles} 
            onValueChange={(value) => handleRadioChange('softwareDevelopmentRoles', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="frontend" id="role-frontend" />
              <Label htmlFor="role-frontend">מפתח/ת צד לקוח (Front-end)</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="backend" id="role-backend" />
              <Label htmlFor="role-backend">מפתח/ת צד שרת (Back-end)</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="fullstack" id="role-fullstack" />
              <Label htmlFor="role-fullstack">מפתח/ת פול-סטאק</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="data" id="role-data" />
              <Label htmlFor="role-data">מהנדס/ת נתונים / מדען/ית נתונים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="devops" id="role-devops" />
              <Label htmlFor="role-devops">מהנדס/ת DevOps / Cloud</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companySize">מהו גודל הארגון בו את/ה עובד/ת?</Label>
          <RadioGroup 
            value={formData.companySize} 
            onValueChange={(value) => handleRadioChange('companySize', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="startup" id="company-startup" />
              <Label htmlFor="company-startup">סטארט-אפ (1-20 עובדים)</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="small" id="company-small" />
              <Label htmlFor="company-small">חברה קטנה (21-100 עובדים)</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="medium" id="company-medium" />
              <Label htmlFor="company-medium">חברה בינונית (101-500 עובדים)</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="large" id="company-large" />
              <Label htmlFor="company-large">חברה גדולה (501-1000 עובדים)</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="enterprise" id="company-enterprise" />
              <Label htmlFor="company-enterprise">חברת ענק (1000+ עובדים)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="programmingLanguages">באילו שפות תכנות יש לך ניסיון?</Label>
          <RadioGroup 
            value={formData.programmingLanguages} 
            onValueChange={(value) => handleRadioChange('programmingLanguages', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="javascript" id="lang-js" />
              <Label htmlFor="lang-js">JavaScript/TypeScript</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="python" id="lang-python" />
              <Label htmlFor="lang-python">Python</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="java-csharp" id="lang-java-csharp" />
              <Label htmlFor="lang-java-csharp">Java/C#</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="cpp" id="lang-cpp" />
              <Label htmlFor="lang-cpp">C/C++</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="other" id="lang-other" />
              <Label htmlFor="lang-other">שפות אחרות</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="aiExperience">מהי רמת הניסיון שלך עם AI?</Label>
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
              <Label htmlFor="ai-beginner">מתחיל - השתמשתי בכלי AI בסיסיים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="intermediate" id="ai-intermediate" />
              <Label htmlFor="ai-intermediate">בינוני - השתמשתי במספר כלי AI ומודלים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="advanced" id="ai-advanced" />
              <Label htmlFor="ai-advanced">מתקדם - בניתי פרויקטים עם AI</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="expert" id="ai-expert" />
              <Label htmlFor="ai-expert">מומחה - ניסיון נרחב בפיתוח פתרונות AI</Label>
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
              <Label htmlFor="learn-video">הרצאות וסרטוני וידאו</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="reading" id="learn-reading" />
              <Label htmlFor="learn-reading">קריאת מאמרים ותיעוד</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="hands-on" id="learn-hands-on" />
              <Label htmlFor="learn-hands-on">תרגילים מעשיים ופרויקטים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="interactive" id="learn-interactive" />
              <Label htmlFor="learn-interactive">למידה אינטראקטיבית ותרגול</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="mentor" id="learn-mentor" />
              <Label htmlFor="learn-mentor">הדרכה אישית וחניכה</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectGoals">מהי המטרה העיקרית שלך בלמידת AI?</Label>
          <RadioGroup 
            value={formData.projectGoals} 
            onValueChange={(value) => handleRadioChange('projectGoals', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="career" id="goal-career" />
              <Label htmlFor="goal-career">קידום קריירה</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="project" id="goal-project" />
              <Label htmlFor="goal-project">פיתוח פרויקט ספציפי</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="business" id="goal-business" />
              <Label htmlFor="goal-business">פיתוח מיזם/עסק</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="academic" id="goal-academic" />
              <Label htmlFor="goal-academic">מחקר אקדמי</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="curiosity" id="goal-curiosity" />
              <Label htmlFor="goal-curiosity">סקרנות אישית</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="industryExperience">באיזו תעשייה יש לך את הניסיון הרב ביותר?</Label>
          <RadioGroup 
            value={formData.industryExperience} 
            onValueChange={(value) => handleRadioChange('industryExperience', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="tech" id="industry-tech" />
              <Label htmlFor="industry-tech">טכנולוגיה/תוכנה</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="finance" id="industry-finance" />
              <Label htmlFor="industry-finance">פיננסים/בנקאות</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="healthcare" id="industry-healthcare" />
              <Label htmlFor="industry-healthcare">בריאות/רפואה</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="education" id="industry-education" />
              <Label htmlFor="industry-education">חינוך/אקדמיה</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="other" id="industry-other" />
              <Label htmlFor="industry-other">אחר</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dataScience">האם יש לך ניסיון במדעי הנתונים?</Label>
          <RadioGroup 
            value={formData.dataScience} 
            onValueChange={(value) => handleRadioChange('dataScience', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="none" id="data-none" />
              <Label htmlFor="data-none">אין ניסיון</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="basic" id="data-basic" />
              <Label htmlFor="data-basic">ידע בסיסי</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="intermediate" id="data-intermediate" />
              <Label htmlFor="data-intermediate">ניסיון בינוני</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="advanced" id="data-advanced" />
              <Label htmlFor="data-advanced">ניסיון מתקדם</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="professional" id="data-professional" />
              <Label htmlFor="data-professional">מקצועי/מומחה</Label>
            </div>
          </RadioGroup>
        </div>

      </div>
    </QuestionPageLayout>
  );
};

export default ProfessionalQuestionsPage;
