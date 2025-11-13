import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/api/users';
import type { IUser } from '@/interfaces/users/IUser';
import { UsersList } from '@/components';

export const UsersPage = () => {
    const [inputValue, setInputValue] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(inputValue);
        }, 500);

        return () => clearTimeout(timer);
    }, [inputValue]);

    // Get users list
    const { data, isLoading, error } = useQuery<{ users: IUser[] }>({
        queryKey: ['users', searchTerm],
        queryFn: () => getUsers(searchTerm || null),
    });

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-blue-600">Users List</h1>
            </div>
            <UsersList 
                users={data?.users || []} 
                searchValue={inputValue}
                onSearchChange={setInputValue}
                isLoading={isLoading}
                error={error}
            />
        </>
    );
};
