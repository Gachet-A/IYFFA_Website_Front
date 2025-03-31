import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  birthdate: string;
  phone_number: string;
  user_type: 'admin' | 'user';
  status: boolean;
  cgu: boolean;
  stripe_id: string | null;
  otp_enabled: boolean;
  date_joined: string;
}

export interface UserFormData {
  email: string;
  password?: string;  // Optional for updates
  first_name: string;
  last_name: string;
  birthdate: string;
  phone_number: string;
  user_type: 'admin' | 'user';
  status: boolean;
  cgu: boolean;
}

export const useUserManagement = () => {
  const queryClient = useQueryClient();
  const { getToken, user } = useAuth();

  // Fetch all users
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        if (!user) {
          throw new Error('Not authenticated');
        }

        const token = await getToken();
        if (!token) {
          throw new Error('Not authenticated');
        }

        const response = await fetch('/api/users/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (response.status === 401) {
          window.location.href = '/verify-otp';
          throw new Error('2FA verification required');
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch users');
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },
    enabled: !!user
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: UserFormData) => {
      try {
        const token = await getToken();
        if (!token) {
          throw new Error('Not authenticated');
        }

        console.log('Creating user with data:', userData);

        const response = await fetch('/api/users/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (response.status === 401) {
          window.location.href = '/verify-otp';
          throw new Error('2FA verification required');
        }

        const responseData = await response.json();
        
        if (!response.ok) {
          console.error('Create user error response:', responseData);
          throw new Error(responseData.error || responseData.detail || 'Failed to create user');
        }

        console.log('User created successfully:', responseData);
        return responseData;
      } catch (error) {
        console.error('Error in createUserMutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('Invalidating users query cache');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    }
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, userData }: { id: number; userData: Partial<UserFormData> }) => {
      try {
        const token = await getToken();
        if (!token) {
          throw new Error('Not authenticated');
        }

        // Nettoyer les données avant l'envoi
        const cleanedData = {
          ...userData,
          username: userData.email, // S'assurer que le username est toujours égal à l'email
        };

        console.log('Sending PATCH request to:', `/api/users/${id}/`);
        console.log('With data:', cleanedData);

        const response = await fetch(`/api/users/${id}/`, {
          method: 'PUT', // Utiliser PUT au lieu de PATCH comme pour les articles
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cleanedData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || errorData.error || 'Failed to update user');
        }

        const responseData = await response.json();
        console.log('Update successful:', responseData);
        return responseData;
      } catch (error) {
        console.error('Error in updateUserMutation:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Update mutation succeeded:', data);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Update mutation failed:', error);
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = await getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`/api/users/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete user');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  return {
    users,
    isLoading,
    error,
    createUser: createUserMutation.mutateAsync,
    updateUser: updateUserMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutateAsync,
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending
  };
}; 