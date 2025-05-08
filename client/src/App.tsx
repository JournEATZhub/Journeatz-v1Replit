import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Auth from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";

function Router() {
  const { isAuthenticated, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={Auth} />
      <Route path="/dashboard">
        {isAuthenticated ? <Dashboard /> : <Auth />}
      </Route>
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
