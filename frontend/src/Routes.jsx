import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
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
        <Route path="/" element={<ExecutiveDashboard />} />
        <Route path="/analytics-and-insights-dashboard" element={<AnalyticsAndInsightsDashboard />} />
        <Route path="/request-management-center" element={<RequestManagementCenter />} />
        <Route path="/team-and-system-administration" element={<TeamAndSystemAdministration />} />
        <Route path="/capacity-planning-workspace" element={<CapacityPlanningWorkspace />} />
        <Route path="/ok-rs-and-roadmap-management" element={<OKRsAndRoadmapManagement />} />
        <Route path="/executive-dashboard" element={<ExecutiveDashboard />} />
        <Route path="/authentication-and-access-control" element={<AuthenticationAndAccessControl />} />
        <Route path="/products-and-client-portfolio" element={<ProductsAndClientPortfolio />} />
        <Route path="/predictive-risk-dashboard" element={<PredictiveRiskDashboard />} />
        <Route path="/activity-logs" element={<ActivityLogs />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;