import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import WahyEditorSimple from "@/pages/wahy-editor-simple";
import LoginPage from "@/pages/login";
import MobileEditor from "@/pages/mobile-editor";
import TutorialPage from "@/pages/tutorial";
import NotFound from "@/pages/not-found";
import { useEffect, useState } from "react";

function Router() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/tutorial" component={TutorialPage} />
      <Route path="/mobile" component={MobileEditor} />
      <Route path="/" component={isMobile ? MobileEditor : WahyEditorSimple} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
