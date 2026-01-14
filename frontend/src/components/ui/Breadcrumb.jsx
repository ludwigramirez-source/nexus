import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = ({ customItems }) => {
  const location = useLocation();

  const routeLabels = {
    '/executive-dashboard': 'Executive Dashboard',
    '/request-management-center': 'Request Management',
    '/capacity-planning-workspace': 'Capacity Planning',
    '/ok-rs-and-roadmap-management': 'OKRs & Roadmap',
    '/products-and-client-portfolio': 'Products & Clients',
    '/analytics-and-insights-dashboard': 'Analytics & Insights',
    '/team-and-system-administration': 'Team & System Admin',
    '/authentication-and-access-control': 'Authentication'
  };

  const generateBreadcrumbs = () => {
    if (customItems) {
      return customItems;
    }

    const pathSegments = location?.pathname?.split('/')?.filter(segment => segment);
    
    if (pathSegments?.length === 0) {
      return [{ label: 'Home', path: '/' }];
    }

    const breadcrumbs = [{ label: 'Home', path: '/' }];
    
    let currentPath = '';
    pathSegments?.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = routeLabels?.[currentPath] || segment?.split('-')?.map(word => 
        word?.charAt(0)?.toUpperCase() + word?.slice(1)
      )?.join(' ');
      
      breadcrumbs?.push({
        label,
        path: currentPath,
        isLast: index === pathSegments?.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs?.length <= 1) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm font-caption">
        {breadcrumbs?.map((crumb, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <Icon
                name="ChevronRight"
                size={16}
                className="text-muted-foreground mx-2"
              />
            )}
            {crumb?.isLast || index === breadcrumbs?.length - 1 ? (
              <span className="text-foreground font-medium">
                {crumb?.label}
              </span>
            ) : (
              <Link
                to={crumb?.path}
                className="text-muted-foreground hover:text-foreground transition-smooth"
              >
                {crumb?.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;