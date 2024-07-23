import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';


export const sideData = [
  {
    routeLink: 'dashboard',
    icon: 'fi fi-sr-grid',
    label: 'Dashboard'
  },
  {
    routeLink: 'meter-view',
    icon: 'fi fi-sr-dashboard',
    label: 'Meter View'
  },
  {
    routeLink: 'analytics',
    icon: 'fi fi-sr-arrow-trend-up',
    label: 'Analytics'
  },
  {
    routeLink: 'reports',
    icon: 'fi fi-ss-memo-circle-check',
    label: 'Reports'
  },
  {
    routeLink: 'workflow',
    icon: 'fi fi-sr-house-laptop',
    label: 'Workflow'
  },
  {
    routeLink: 'settings',
    icon: 'fi fi-sr-settings',
    label: 'Settings'
  },
];

export const CorpadminNavData = [
  {
    routeLink: 'corporate-dashboard',
    icon: 'fi fi-ss-clipboard-user',
    label: 'Dashboard'
  },
  {
    routeLink: 'settings',
    icon: 'fi fi-sr-settings',
    label: 'Settings'
  },
]

export const ClusadminNavData = [
  {
    routeLink: 'clusterhead-dashboard',
    icon: 'fi fi-sr-grid',
    label: 'Dashboard'
  },
  {
    routeLink: 'cluster-analytics',
    icon: 'fi fi-sr-arrow-trend-up',
    label: 'Analytics'
  }
]

export const SupClusadminNavData = [
  {
    routeLink: 'super-clusterhead-dashboard',
    icon: 'fi fi-sr-grid',
    label: 'Dashboard'
  }
]

