
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
    industryExperience: answers.industryExperience || [],
    dataScience: answers.dataScience || '',
    frameworks: answers.frameworks || '',
    cloudPlatforms: answers.cloudPlatforms || [],
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
        industryExperience: answers.industryExperience || [],
        dataScience: answers.dataScience || '',
        frameworks: answers.frameworks || '',
        cloudPlatforms: answers.cloudPlatforms || [],
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
          <Label htmlFor="educationLevel">מהי רמת ההשכלה הגבוהה ביותר שלך?</Label>
          <Select 
            value={formData.educationLevel} 
            onValueChange={(value) => handleSelectChange('educationLevel', value)}
          >
            <SelectTrigger id="educationLevel" className="w-full">
              <SelectValue placeholder="בחר/י מתוך האפשרויות" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high-school">תעודת בגרות</SelectItem>
              <SelectItem value="vocational">לימודי מקצוע / הכשרה טכנית</SelectItem>
              <SelectItem value="bachelor">תואר ראשון</SelectItem>
              <SelectItem value="master">תואר שני</SelectItem>
              <SelectItem value="phd">דוקטורט</SelectItem>
            </SelectContent>
          </Select>
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
          <Select 
            value={formData.companySize} 
            onValueChange={(value) => handleSelectChange('companySize', value)}
          >
            <SelectTrigger id="companySize" className="w-full">
              <SelectValue placeholder="בחר/י מתוך האפשרויות" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="startup">סטארט-אפ (1-20 עובדים)</SelectItem>
              <SelectItem value="small">חברה קטנה (21-100 עובדים)</SelectItem>
              <SelectItem value="medium">חברה בינונית (101-500 עובדים)</SelectItem>
              <SelectItem value="large">חברה גדולה (501-1000 עובדים)</SelectItem>
              <SelectItem value="enterprise">חברת ענק (1000+ עובדים)</SelectItem>
              <SelectItem value="freelance">עצמאי/ת</SelectItem>
              <SelectItem value="unemployed">לא עובד/ת כרגע</SelectItem>
              <SelectItem value="student">סטודנט/ית</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>באילו תעשיות יש לך ניסיון? (ניתן לבחור כמה אפשרויות)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            {[
              { id: 'finance', label: 'פיננסים / בנקאות' },
              { id: 'healthcare', label: 'בריאות' },
              { id: 'retail', label: 'קמעונאות / מסחר' },
              { id: 'education', label: 'חינוך' },
              { id: 'government', label: 'ממשלה / ציבורי' },
              { id: 'telecom', label: 'טלקומוניקציה' },
              { id: 'manufacturing', label: 'תעשייה / ייצור' },
              { id: 'tech', label: 'טכנולוגיה / היי-טק' },
            ].map(item => (
              <div key={item.id} className="flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox 
                  id={`industry-${item.id}`} 
                  checked={(formData.industryExperience || []).includes(item.id)}
                  onCheckedChange={(checked) => handleCheckboxChange('industryExperience', item.id, checked === true)}
                />
                <Label htmlFor={`industry-${item.id}`}>{item.label}</Label>
              </div>
            ))}
          </div>
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
          <Label htmlFor="frameworks">באילו frameworks או ספריות את/ה משתמש/ת?</Label>
          <Textarea 
            id="frameworks" 
            name="frameworks"
            placeholder="React, Django, TensorFlow, PyTorch, etc."
            value={formData.frameworks}
            onChange={handleInputChange}
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label>באילו פלטפורמות ענן יש לך ניסיון? (ניתן לבחור כמה אפשרויות)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            {[
              { id: 'aws', label: 'Amazon Web Services (AWS)' },
              { id: 'azure', label: 'Microsoft Azure' },
              { id: 'gcp', label: 'Google Cloud Platform (GCP)' },
              { id: 'ibm', label: 'IBM Cloud' },
              { id: 'oracle', label: 'Oracle Cloud' },
              { id: 'none', label: 'אין ניסיון בענן' },
            ].map(item => (
              <div key={item.id} className="flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox 
                  id={`cloud-${item.id}`} 
                  checked={(formData.cloudPlatforms || []).includes(item.id)}
                  onCheckedChange={(checked) => handleCheckboxChange('cloudPlatforms', item.id, checked === true)}
                />
                <Label htmlFor={`cloud-${item.id}`}>{item.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataScience">מהו הניסיון שלך בData Science?</Label>
          <RadioGroup 
            value={formData.dataScience} 
            onValueChange={(value) => handleRadioChange('dataScience', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="none" id="ds-none" />
              <Label htmlFor="ds-none">אין ניסיון</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="beginner" id="ds-beginner" />
              <Label htmlFor="ds-beginner">מתחיל/ה - ביצעתי ניתוחים בסיסיים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="intermediate" id="ds-intermediate" />
              <Label htmlFor="ds-intermediate">בינוני - עבדתי עם כלי אנליזה ולמידת מכונה</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="advanced" id="ds-advanced" />
              <Label htmlFor="ds-advanced">מתקדם - פיתחתי ויישמתי מודלים</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="expert" id="ds-expert" />
              <Label htmlFor="ds-expert">מומחה - ניסיון נרחב וידע עמוק</Label>
            </div>
          </RadioGroup>
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
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="expert" id="ai-expert" />
              <Label htmlFor="ai-expert">מומחה - ניסיון נרחב וידע עמוק</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="aiModelsUsed">באילו מודלים או כלי AI השתמשת בעבר?</Label>
          <Textarea 
            id="aiModelsUsed" 
            name="aiModelsUsed"
            placeholder="GPT-3/4, BERT, DALL-E, Stable Diffusion, etc."
            value={formData.aiModelsUsed}
            onChange={handleInputChange}
            className="min-h-[80px]"
          />
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
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="interactive" id="learn-interactive" />
              <Label htmlFor="learn-interactive">למידה אינטראקטיבית (סדנאות, תרגילים)</Label>
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
