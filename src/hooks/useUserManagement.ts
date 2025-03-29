import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
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
  const { getToken } = useAuth();

  // Fetch all users
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const token = await getToken();
      const response = await api.get('/api/users/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    enabled: true
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: UserFormData) => {
      const token = await getToken();
      const response = await api.post('/api/users/', userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, userData }: { id: number; userData: Partial<UserFormData> }) => {
      const token = await getToken();
      const response = await api.patch(`/api/users/${id}/`, userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = await getToken();
      await api.delete(`/api/users/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  return {
    users,
    isLoading,
    error,
    createUser: createUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending
  };
}; 