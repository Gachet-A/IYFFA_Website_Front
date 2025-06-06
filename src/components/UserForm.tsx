import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import type { UserFormData } from '@/hooks/useUserManagement';

// Base schema without password
const baseSchema = {
  email: z.string().email('Invalid email address'),
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  birthdate: z.string(),
  phone_number: z.string().min(10, 'Phone number must be at least 10 characters'),
  user_type: z.enum(['admin', 'user']),
  status: z.boolean(),
  cgu: z.boolean(),
};

// Create schema (requires password)
const createUserSchema = z.object({
  ...baseSchema,
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Update schema (password optional)
const updateUserSchema = z.object({
  ...baseSchema,
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
});

interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
  initialData?: Partial<UserFormData>;
  isSubmitting?: boolean;
}

export const UserForm = ({ onSubmit, initialData, isSubmitting }: UserFormProps) => {
  const schema = initialData ? updateUserSchema : createUserSchema;
  console.log('Form initialized with initialData:', initialData);

  const form = useForm<UserFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      birthdate: '',
      phone_number: '',
      user_type: 'user',
      status: true,
      cgu: false,
    },
  });

  // Mettre à jour les valeurs du formulaire quand initialData change
  useEffect(() => {
    if (initialData) {
      console.log('Updating form values with:', initialData);
      form.reset({
        email: initialData.email || '',
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        birthdate: initialData.birthdate || '',
        phone_number: initialData.phone_number || '',
        user_type: initialData.user_type || 'user',
        status: initialData.status ?? true,
        cgu: initialData.cgu ?? false,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (data: UserFormData) => {
    try {
      console.log('Form submission started with data:', data);
      
      // Nettoyer les données avant soumission
      const cleanedData = {
        email: data.email.trim(),
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        birthdate: data.birthdate,
        phone_number: data.phone_number.trim(),
        user_type: data.user_type,
        status: data.status,
        cgu: data.cgu,
      };

      // Ajouter le mot de passe uniquement s'il est fourni
      if (data.password && data.password.trim() !== '') {
        cleanedData['password'] = data.password.trim();
      }

      console.log('Cleaned form data to submit:', cleanedData);
      
      await onSubmit(cleanedData);
      console.log('Form submission completed successfully');
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit form",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit((data) => {
          console.log('Form submit event triggered with data:', data);
          handleSubmit(data);
        })} 
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="user@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!initialData && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="birthdate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birthdate</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="user_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="user">Regular User</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Status</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cgu"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Terms of Service Accepted</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}; 