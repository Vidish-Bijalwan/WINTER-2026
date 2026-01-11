import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WikipediaDataProvider } from "@/context/WikipediaDataContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { lazy, Suspense } from "react";

// Lazy load all pages for code splitting
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Monitor = lazy(() => import("./pages/Monitor"));
const Sources = lazy(() => import("./pages/Sources"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Settings = lazy(() => import("./pages/Settings"));
const Geography = lazy(() => import("./pages/Geography"));
const Visualizations = lazy(() => import("./pages/Visualizations"));
const DataFlowDiagram = lazy(() => import("./pages/DataFlowDiagram"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

import { UIProvider } from "@/context/UIContext";

// ... imports

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UIProvider>
        <WikipediaDataProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename="/WINTER-2026">
            <CommandPalette />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/monitor"
                  element={
                    <ProtectedRoute>
                      <Monitor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/sources"
                  element={
                    <ProtectedRoute>
                      <Sources />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <Analytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/geography"
                  element={
                    <ProtectedRoute>
                      <Geography />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/visualizations"
                  element={
                    <ProtectedRoute>
                      <Visualizations />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/data-flow"
                  element={
                    <ProtectedRoute>
                      <DataFlowDiagram />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </WikipediaDataProvider>
      </UIProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
