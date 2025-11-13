import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '@/api/dashboard';
import { Loader, TotalsOverview, LatestEncounters } from '@/components';
import type { IDashboardData } from '@/interfaces/dashboard/IDashboardData';
import { Link } from 'react-router';

export const DashboardIndex = () => {
    const { data, isLoading, error } = useQuery<IDashboardData>({
        queryKey: ['dashboard'],
        queryFn: getDashboardData,
    });

    return (
        <>
            <h1 className="text-3xl font-bold text-blue-600 mb-8">Dashboard</h1>
            
            {isLoading ? 
            <div className="flex justify-center items-center">
                <Loader />
            </div> : error ?
             <div className="text-red-500 font-bold text-center"> {error instanceof Error ? error.message : 'An unexpected error occurred'}</div> 
             : <div className="flex flex-col gap-6">
                <TotalsOverview data={data} />
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-bold text-blue-600 mb-4">Latest Encounters</h2>
                        <Link to="/dashboard/encounters" className="text-blue-600 font-bold hover:text-blue-800 transition-colors">View All Encounters</Link>
                    </div>
                    <LatestEncounters data={data?.todayEncounters || []} />
                </div>
            </div>}
        </>
    );
};

