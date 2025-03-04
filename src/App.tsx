
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

import { Toaster } from "@/components/ui/toaster";

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route index element={<Index />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="cemetery/:id" element={<CemeteryDetail />} />
                      <Route path="block/:id" element={<BlockDetail />} />
                      <Route path="work-orders" element={<WorkOrders />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="profile" element={<UserProfile />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
