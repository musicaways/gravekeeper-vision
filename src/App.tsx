
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";

import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import CemeteryDetail from "@/pages/CemeteryDetail";
import BlockDetail from "@/pages/BlockDetail";
import NotFound from "@/pages/NotFound";
import Layout from "@/components/layout/Layout";
import WorkOrders from "@/pages/WorkOrders";
import Settings from "@/pages/Settings";
import UserProfile from "@/pages/UserProfile";
import Deceased from "@/pages/Deceased";

import { Toaster } from "@/components/ui/toaster";

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            
            {/* Home route (cemeteries list) */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Index />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Dashboard route */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Cemetery detail route */}
            <Route path="/cemetery/:id" element={
              <ProtectedRoute>
                <Layout>
                  <CemeteryDetail />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Block detail route */}
            <Route path="/block/:id" element={
              <ProtectedRoute>
                <Layout>
                  <BlockDetail />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Work orders route */}
            <Route path="/work-orders" element={
              <ProtectedRoute>
                <Layout>
                  <WorkOrders />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Deceased registry route */}
            <Route path="/deceased" element={
              <ProtectedRoute>
                <Layout>
                  <Deceased />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Settings route */}
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* User profile route */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <UserProfile />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* NotFound route (for any other route) */}
            <Route path="*" element={
              <ProtectedRoute>
                <Layout>
                  <NotFound />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
