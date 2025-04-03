import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QuestionnaireProvider } from "./context/QuestionnaireContext";
import LandingPage from "./pages/LandingPage";
import ProfessionalQuestionsPage from "./pages/ProfessionalQuestionsPage";
import PersonalQuestionsPage from "./pages/PersonalQuestionsPage";
import ValueAddQuestionsPage from "./pages/ValueAddQuestionsPage";
import ContactInfoPage from "./pages/ContactInfoPage";
import ThankYouPage from "./pages/ThankYouPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <QuestionnaireProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/questionnaire/1" element={<ProfessionalQuestionsPage />} />
            <Route path="/questionnaire/2" element={<PersonalQuestionsPage />} />
            <Route path="/questionnaire/3" element={<ValueAddQuestionsPage />} />
            <Route path="/questionnaire/4" element={<ContactInfoPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </QuestionnaireProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
