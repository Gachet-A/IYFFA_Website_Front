// src/hooks/useDashboardStats.ts
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';

export interface DashboardStats {
  total_articles: number;
  total_events: number;
  total_projects: number;
  personal_stats: {
    my_articles: number;
    my_events: number;
    my_donations: Array<{
      amount: number;
      creation_time: string;
      status: string;
      currency: string;
    }>;
    membership_status: {
      is_active: boolean;
      last_payment: {
        amount: number;
        creation_time: string;
        status: string;
        currency: string;
      } | null;
    };
  };
  recent_activities: {
    articles: Array<{
      id: number;
      title: string;
      creation_time: string;
      text: string;
    }>;
    events: Array<{
      id: number;
      title: string;
      start_datetime: string;
      location: string;
      price: number;
    }>;
    projects: Array<{
      id: number;
      title: string;
      description: string;
      budget: number;
    }>;
  };
  // Champs optionnels pour les admins
  total_users?: number;
  total_regular_users?: number;
  total_members?: number;
  total_admins?:number;
  donations_stats?: {
    total_amount: number;
    monthly_amount: number;
    recent_donations: Array<{
      amount: number;
      creation_time: string;
      status: string;
      currency: string;
    }>;
  };
  user_growth?: {
    monthly_new_users: number;
    monthly_new_members: number;
  };
}

export const useDashboardStats = () => {
  const { getToken, user } = useAuth();

  return useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      try {
        // Vérifier d'abord si l'utilisateur est connecté
        if (!user) {
          throw new Error('Not authenticated');
        }

        console.log('Getting token...');
        const token = await getToken();
        if (!token) {
          console.error('No token available');
          throw new Error('Not authenticated');
        }
        console.log('Token received successfully');

        // Utiliser l'URL exacte comme définie dans le ViewSet (avec underscore)
        const apiUrl = '/api/users/dashboard_stats/';
        console.log('Fetching dashboard stats from:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });

        console.log('Response status:', response.status);
        
        if (response.status === 401) {
          // Rediriger vers la page de vérification 2FA si nécessaire
          window.location.href = '/verify-otp';
          throw new Error('2FA verification required');
        }

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response error text:', errorText);
          
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch (e) {
            errorData = { detail: errorText };
          }
          
          console.error('Response error data:', errorData);

          if (response.status === 403) {
            throw new Error('Access forbidden. Please check your permissions.');
          }
          if (response.status === 404) {
            throw new Error('Dashboard stats endpoint not found. Please check the API configuration.');
          }
          
          throw new Error(errorData.detail || errorData.error || `Failed to fetch dashboard stats (${response.status})`);
        }

        const data = await response.json();
        console.log('Dashboard stats received:', data);
        return data;
      } catch (error) {
        console.error('Dashboard stats error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: !!user
  });
};