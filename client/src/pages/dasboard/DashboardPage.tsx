import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '@/api/dashboard';
import { Loader } from '@/components';
import { DashboardCards } from '@/components/dashboard/DashboardCards';
import type { IDashboardData } from '@/interfaces/dashboard/IDashboardData';

export const DashboardPage = () => {
    const { data, isLoading, error } = useQuery<IDashboardData>({
        queryKey: ['dashboard'],
        queryFn: getDashboardData,
    });

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
                
                {isLoading ? 
                <div className="flex justify-center items-center">
                    <Loader />
                </div> : error ?
                 <div className="text-red-500 font-bold text-center"> {error instanceof Error ? error.message : 'An unexpected error occurred'}</div> 
                 : <DashboardCards data={data} />}
            </div>
        </div>
    )
};