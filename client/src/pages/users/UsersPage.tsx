import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { getUsers, createUser, updateAccountStatus } from '@/api/users';
import type { IUser, ICreateUser } from '@/interfaces/users/IUser';
import { UsersList, UserForm, Button, Toast } from '@/components';

export const UsersPage = () => {
    const [inputValue, setInputValue] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const queryClient = useQueryClient();

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(inputValue);
        }, 500);

        return () => clearTimeout(timer);
    }, [inputValue]);

    const { data, isLoading, error } = useQuery<{ users: IUser[] }>({
        queryKey: ['users', searchTerm],
        queryFn: () => getUsers(searchTerm || null),
    });

    const createUserMutation = useMutation({
        mutationFn: createUser,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setIsModalOpen(false);

            // Show success toast with message from response
            const message = data?.message as string;
            setToastMessage(message);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 3000);
        },
        onError: (error: unknown) => {
            const isValidationError = 
                (axios.isAxiosError(error) && error.response?.status === 422) ||
                ((error as any)?.response?.status === 422);
            
            if (!isValidationError) {
                const errorMessage = error instanceof Error ? error.message : 'An error occurred';
                setToastMessage(errorMessage);
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 3000);
            }
        },
    });


    const updateAccountStatusMutation = useMutation({
        mutationFn: (id: number) => updateAccountStatus(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setToastMessage(data?.message as string);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 3000);
        },
        onError: (error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred while updating the user account status';
            setToastMessage(errorMessage);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 3000);
        },
    });

    // Handle form submission
    const handleCreateUser = (formData: ICreateUser) => {
        createUserMutation.mutate(formData);
    };

    const handleUpdateAccountStatus = (id: number) => {
        updateAccountStatusMutation.mutate(id);
    };

    // Handle modal close - reset errors
    const handleClose = () => {
        createUserMutation.reset();
        setIsModalOpen(false);
    };

    return (
        <>
            {showToast && (
                <div className="fixed top-20 right-4 z-50 transition-all duration-300 ease-in-out">
                    <Toast
                        message={toastMessage}
                        type="success"
                    />
                </div>
            )}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-blue-600">Users List</h1>
                <Button 
                    disabled={false}
                    type="button" 
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium" 
                    loading={false}
                    onClick={() => setIsModalOpen(true)}
                >
                    Add User
                </Button>
            </div>
            <UsersList 
                users={data?.users || []} 
                searchValue={inputValue}
                onSearchChange={setInputValue}
                isLoading={isLoading}
                error={error}
                onUpdateAccountStatus={handleUpdateAccountStatus}
            />
            <UserForm
                isOpen={isModalOpen}
                onClose={handleClose}
                onSubmit={handleCreateUser}
                error={createUserMutation.error as Error | null}
                isLoading={createUserMutation.isPending}
            />
        </>
    );
};
