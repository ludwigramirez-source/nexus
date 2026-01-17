import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AnalyticsAndInsightsDashboard from './pages/analytics-and-insights-dashboard';
import RequestManagementCenter from './pages/request-management-center';
import TeamAndSystemAdministration from './pages/team-and-system-administration';
import CapacityPlanningWorkspace from './pages/capacity-planning-workspace';
import OKRsAndRoadmapManagement from './pages/ok-rs-and-roadmap-management';
import ExecutiveDashboard from './pages/executive-dashboard';
import AuthenticationAndAccessControl from './pages/authentication-and-access-control';
import ProductsAndClientPortfolio from './pages/products-and-client-portfolio';
import PredictiveRiskDashboard from './pages/predictive-risk-dashboard';
import ActivityLogs from './pages/activity-logs';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route
          path="/"
          element={
            <ProtectedRoute permission="view_executive_dashboard" redirectTo="/request-management-center">
              <ExecutiveDashboard />
            </ProtectedRoute>
          }
        />

        {/* DASHBOARDS - Protected */}
        <Route
          path="/executive-dashboard"
          element={
            <ProtectedRoute permission="view_executive_dashboard" redirectTo="/request-management-center">
              <ExecutiveDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics-and-insights-dashboard"
          element={
            <ProtectedRoute permission="view_analytics_dashboard" redirectTo="/request-management-center">
              <AnalyticsAndInsightsDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/predictive-risk-dashboard"
          element={
            <ProtectedRoute permission="view_predictive_dashboard" redirectTo="/request-management-center">
              <PredictiveRiskDashboard />
            </ProtectedRoute>
          }
        />

        {/* OPERACIONES - Require auth but data filtered by permissions */}
        <Route
          path="/request-management-center"
          element={
            <ProtectedRoute>
              <RequestManagementCenter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/capacity-planning-workspace"
          element={
            <ProtectedRoute>
              <CapacityPlanningWorkspace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ok-rs-and-roadmap-management"
          element={
            <ProtectedRoute permission="view_okrs" redirectTo="/request-management-center">
              <OKRsAndRoadmapManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products-and-client-portfolio"
          element={
            <ProtectedRoute permission="view_products_clients" redirectTo="/request-management-center">
              <ProductsAndClientPortfolio />
            </ProtectedRoute>
          }
        />

        {/* ADMINISTRACIÓN - Protected */}
        <Route
          path="/team-and-system-administration"
          element={
            <ProtectedRoute
              anyPermissions={['manage_users', 'manage_roles', 'manage_system_config', 'manage_skills']}
              redirectTo="/request-management-center"
            >
              <TeamAndSystemAdministration />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activity-logs"
          element={
            <ProtectedRoute permission="view_activity_logs" redirectTo="/request-management-center">
              <ActivityLogs />
            </ProtectedRoute>
          }
        />

        {/* PUBLIC ROUTES */}
        <Route path="/authentication-and-access-control" element={<AuthenticationAndAccessControl />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;