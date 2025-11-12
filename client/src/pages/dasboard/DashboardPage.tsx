import { getDashboardData } from '@/api/dashboard';
import { Loader } from '@/components/ui/Loader';
import { useQuery } from '@tanstack/react-query';

export const DashboardPage = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['dashboard'],
        queryFn: getDashboardData,
    });

    if (isLoading) return <Loader />;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h2>Dashboard Page</h2>
            <div>
                <h3>Patients</h3>
                <p>{data?.patients}</p>
            </div>
        </div>
    );
}