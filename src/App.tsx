
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import CemeteryDetail from "./pages/CemeteryDetail";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import UserProfile from "./pages/UserProfile";
import WorkOrders from "./pages/WorkOrders";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Layout from "./components/layout/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Layout title="Dashboard">
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cemeteries" 
              element={
                <ProtectedRoute>
                  <Layout title="Gestione Cimiteri">
                    <Index />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cemetery/:id" 
              element={
                <ProtectedRoute>
                  <Layout title="Dettaglio Cimitero">
                    <CemeteryDetail />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Layout title="Profilo Utente">
                    <UserProfile />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/work-orders" 
              element={
                <ProtectedRoute>
                  <Layout title="Ordini di Lavoro">
                    <WorkOrders />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Layout title="Impostazioni">
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
