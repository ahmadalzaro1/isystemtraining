
import React, { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SkipToContent } from "@/components/accessibility/SkipToContent";
import { ProtectedRoute, AdminRoute } from "@/components/auth/ProtectedRoute";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { FeatureFlagsProvider } from "@/contexts/FeatureFlagsContext";

// Lazy load pages for better performance with explicit imports
const Index = lazy(() => import("./pages/Index").then(module => ({ default: module.default })));
const NotFound = lazy(() => import("./pages/NotFound").then(module => ({ default: module.default })));
const Auth = lazy(() => import("./pages/Auth").then(module => ({ default: module.default })));
const Admin = lazy(() => import("./pages/Admin").then(module => ({ default: module.default })));
const MyRegistrations = lazy(() => import("./pages/MyRegistrations").then(module => ({ default: module.default })));

// Create a single QueryClient instance at module scope (no hooks)
const appQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error instanceof Error && error.message.includes('4')) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false, // Reduce unnecessary refetches
      networkMode: 'online', // Only run queries when online
    },
    mutations: {
      retry: 1, // Retry mutations once on failure
      networkMode: 'online',
    },
  },
});

// Enhanced loading component with accessibility
const LoadingSpinner = (): JSX.Element => (
  <div 
    className="min-h-screen flex items-center justify-center bg-background" 
    role="status" 
    aria-label="Loading application"
  >
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="text-muted-foreground animate-pulse">Loading...</p>
      <span className="sr-only">Please wait while the application loads</span>
    </div>
  </div>
);

function App(): JSX.Element {
  // Configure React Query with optimized settings for performance
  const queryClient = appQueryClient;
  
  // Feature flag for V4 workshops redesign - clean minimal design
  const useMassiveWorkshopsDesign = true;
  const spacingVersion = "v4.0-clean-minimal-workshops";
  
  try {
    console.info('[Debug] React version', React.version);
    console.info('[Debug] QueryClient ready', !!queryClient);
    console.info('[Debug] Workshops design', useMassiveWorkshopsDesign ? 'Massive V2' : 'Original');
    console.info('[Debug] Spacing version', spacingVersion);
  } catch {}

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <FeatureFlagsProvider>
            <AuthProvider>
              <SkipToContent />
              <SiteHeader />
              <Suspense fallback={<LoadingSpinner />}>
                <main id="main-content" tabIndex={-1}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
                    <Route path="/my-registrations" element={<ProtectedRoute><MyRegistrations /></ProtectedRoute>} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </Suspense>
            </AuthProvider>
          </FeatureFlagsProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
