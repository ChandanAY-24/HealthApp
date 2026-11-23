// Lightweight Client-Side Router for Halsa
import { useState, useEffect } from 'react';

export type RoutePath =
  | 'home'
  | 'vitals'
  | 'activity'
  | 'sleep'
  | 'food'
  | 'meds'
  | 'records'
  | 'care'
  | 'reports'
  | 'settings'
  | 'help';

export const parseCurrentRoute = (): RoutePath => {
  if (typeof window === 'undefined') return 'home';
  const hash = window.location.hash.replace('#/', '').replace('#', '').trim();
  const validRoutes: RoutePath[] = [
    'home',
    'vitals',
    'activity',
    'sleep',
    'food',
    'meds',
    'records',
    'care',
    'reports',
    'settings',
    'help',
  ];
  if (validRoutes.includes(hash as RoutePath)) {
    return hash as RoutePath;
  }
  return 'home';
};

export const navigateTo = (route: RoutePath) => {
  window.location.hash = `#/${route}`;
};

export const useRoute = (): RoutePath => {
  const [route, setRoute] = useState<RoutePath>(parseCurrentRoute);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseCurrentRoute());
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return route;
};
