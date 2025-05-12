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
  DialogFooter,
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
import { AlertCircle, Loader2, Plus, Edit2, Trash2, Check } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';

const UserManagement = () => {
  const navigate = useNavigate();
  const { isAdmin, getToken } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToApprove, setUserToApprove] = useState<User | null>(null);

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

  const approveUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const token = await getToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(`http://localhost:8000/api/auth/approve-user/${userId}/`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to approve user");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Success",
        description: "User approved successfully. Password setup email has been sent.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve user",
        variant: "destructive",
      });
    },
  });

  // Redirect if not admin
  if (!isAdmin()) {
    navigate('/dashboard');
    return null;
  }

  const handleCreateUser = async (data: UserFormData) => {
    try {
      await createUser(data);
      setIsCreateDialogOpen(false);
      await queryClient.invalidateQueries({ queryKey: ['users'] });
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
    if (!selectedUser?.id) {
      console.error('No selected user ID found');
      return;
    }
    
    try {
      console.log('Starting update process for user:', selectedUser.id);
      console.log('Form data received:', data);
      
      // Préparer les données pour la mise à jour
      const updateData = {
        id: selectedUser.id,
        userData: {
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          birthdate: data.birthdate,
          phone_number: data.phone_number,
          user_type: data.user_type,
          status: data.status,
          cgu: data.cgu,
          username: data.email, // S'assurer que le username est toujours égal à l'email
          ...(data.password && data.password.trim() !== '' ? { password: data.password } : {})
        }
      };

      console.log('Sending update request with data:', updateData);
      
      // Appeler la mutation d'update avec l'ID et les données
      await updateUser(updateData);
      
      // Rafraîchir les données et fermer le dialog
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      
      toast({
        title: "Success",
        description: "User updated successfully",
      });

      // Close the dialog after a short delay to allow the user to see the success message
      setTimeout(() => {
        setIsEditDialogOpen(false);
        setSelectedUser(null);
      }, 500);
      
    } catch (error) {
      console.error('Error in handleUpdateUser:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
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
  };

  const handleEditClick = (user: User) => {
    console.log('Edit clicked for user:', user);
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleApproveUser = async (userId: number) => {
    await approveUserMutation.mutateAsync(userId);
    setIsApproveDialogOpen(false);
    setUserToApprove(null);
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Fill in the form below to create a new user account.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <UserForm
                onSubmit={handleCreateUser}
                isSubmitting={isCreating}
              />
            </div>
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
                    {!user.status && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                        onClick={() => {
                          setUserToApprove(user);
                          setIsApproveDialogOpen(true);
                        }}
                        disabled={approveUserMutation.isPending}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white"
                      onClick={() => handleEditClick(user)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                      onClick={() => {
                        setUserToDelete(user);
                        setIsDeleteDialogOpen(true);
                      }}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setUserToDelete(null);
        }
        setIsDeleteDialogOpen(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {userToDelete?.first_name} {userToDelete?.last_name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setUserToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => userToDelete && handleDeleteUser(userToDelete.id)}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve User Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve User</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve {userToApprove?.first_name} {userToApprove?.last_name}? A password setup email will be sent to their email address.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsApproveDialogOpen(false);
                setUserToApprove(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => userToApprove && handleApproveUser(userToApprove.id)}
              disabled={approveUserMutation.isPending}
            >
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog d'édition séparé */}
      <Dialog 
        open={isEditDialogOpen} 
        onOpenChange={(open) => {
          console.log('Dialog open state changing to:', open);
          if (!open) {
            console.log('Dialog closing, resetting selected user');
            setSelectedUser(null);
          }
          setIsEditDialogOpen(open);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information below.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <UserForm
              key={selectedUser.id}
              onSubmit={handleUpdateUser}
              isSubmitting={isUpdating}
              initialData={selectedUser}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement; 