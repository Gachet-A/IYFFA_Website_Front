import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserManagement, type User, type UserFormData } from '@/hooks/useUserManagement';
import { UserForm } from '@/components/UserForm';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, Plus, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

const UserManagement = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const {
    users,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    isCreating,
    isUpdating,
    isDeleting
  } = useUserManagement();

  const queryClient = useQueryClient();

  // Redirect if not admin
  if (!isAdmin()) {
    navigate('/dashboard');
    return null;
  }

  const handleCreateUser = async (data: UserFormData) => {
    try {
      console.log('Submitting user creation with data:', data);
      await createUser(data);
      setIsCreateDialogOpen(false);
      // Force refresh the users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Success",
        description: "User created successfully",
      });
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async (data: UserFormData) => {
    if (selectedUser) {
      try {
        console.log('Submitting user update with data:', data);
        await updateUser({ id: selectedUser.id, userData: data });
        setIsEditDialogOpen(false);
        setSelectedUser(null);
        // Force refresh the users list
        queryClient.invalidateQueries({ queryKey: ['users'] });
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      } catch (error) {
        console.error('Error updating user:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to update user",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        // Force refresh the users list
        queryClient.invalidateQueries({ queryKey: ['users'] });
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
      } catch (error) {
        console.error('Error deleting user:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to delete user",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#1EAEDB] mx-auto" />
          <h1 className="text-4xl font-bold text-[#1EAEDB] mt-4">Loading Users...</h1>
          <p className="text-[#FEF7CD] mt-2">Please wait while we fetch the data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load users. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#1EAEDB]">User Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1EAEDB] hover:bg-[#1EAEDB]/90">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Fill in the form below to create a new user account.
              </DialogDescription>
            </DialogHeader>
            <UserForm
              onSubmit={handleCreateUser}
              isSubmitting={isCreating}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-[#1A1F2C] rounded-lg border border-[#1EAEDB]/20">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.first_name} {user.last_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.user_type === 'admin'
                      ? 'bg-blue-500/20 text-blue-500'
                      : 'bg-green-500/20 text-green-500'
                  }`}>
                    {user.user_type}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.status
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-red-500/20 text-red-500'
                  }`}>
                    {user.status ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>
                  {format(new Date(user.date_joined), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white"
                          onClick={() => handleEditClick(user)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit User</DialogTitle>
                          <DialogDescription>
                            Update the user information using the form below.
                          </DialogDescription>
                        </DialogHeader>
                        <UserForm
                          onSubmit={handleUpdateUser}
                          initialData={user}
                          isSubmitting={isUpdating}
                        />
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="icon"
                      className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManagement; 