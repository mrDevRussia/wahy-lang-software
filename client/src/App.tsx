import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import WahyEditor from "@/pages/wahy-editor";
import LoginPage from "@/pages/login";
import MobileEditor from "@/pages/mobile-editor";
import TutorialPage from "@/pages/tutorial";
import WahyPlayground from "@/pages/wahy-playground";
import UserGuide from "@/pages/user-guide";
import DualModePage from "@/pages/dual-mode";
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
      <Route path="/playground" component={WahyPlayground} />
      <Route path="/mobile" component={MobileEditor} />
      <Route path="/guide" component={UserGuide} />
      <Route path="/dual-mode" component={DualModePage} />
      <Route path="/" component={isMobile ? MobileEditor : WahyEditor} />
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
