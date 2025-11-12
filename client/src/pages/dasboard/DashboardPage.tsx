import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '@/api/dashboard';
import { Loader, TotalsOverview, LatestEncounters } from '@/components';
import type { IDashboardData } from '@/interfaces/dashboard/IDashboardData';

export const DashboardPage = () => {
    const { data, isLoading, error } = useQuery<IDashboardData>({
        queryKey: ['dashboard'],
        queryFn: getDashboardData,
    });

    return (
        <div className="min-h-screen bg-gray-50 pt-4">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-blue-600 mb-8">Dashboard</h1>
                
                {isLoading ? 
                <div className="flex justify-center items-center">
                    <Loader />
                </div> : error ?
                 <div className="text-red-500 font-bold text-center"> {error instanceof Error ? error.message : 'An unexpected error occurred'}</div> 
                 : <div className="flex flex-col gap-6">
                    <TotalsOverview data={data} />
                    <div className="flex flex-col gap-6">
                        <h2 className="text-3xl font-bold text-blue-600 mb-4">Latest Encounters</h2>
                        <LatestEncounters data={data?.todayEncounters || []} />
                    </div>
                </div>}
            </div>
        </div>
    )
};