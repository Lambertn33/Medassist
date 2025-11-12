import { FaUser, FaStethoscope, FaPrescriptionBottle, FaFileMedical, FaDiagnoses, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import type { IDashboardData } from "@/interfaces/dashboard/IDashboardData";
import { DashboardCard } from "./DashboardCard";

export const DashboardCards = ({ data }: { data: IDashboardData | undefined }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
                title="Total Patients"
                value={data?.patients || 0}
                icon={<FaUser />}
            />
            
            <DashboardCard
                title="Total Encounters"
                value={data?.encounters || 0}
                icon={<FaStethoscope />}
                bgColor="bg-blue-50"
                iconBgColor="bg-blue-500"
            />
            
            <DashboardCard
                title="Total Observations"
                value={data?.observations || 0}
                icon={<FaFileMedical />}
                bgColor="bg-purple-50"
                iconBgColor="bg-purple-500"
            />
            
            <DashboardCard
                title="Total Treatments"
                value={data?.treatments || 0}
                icon={<FaPrescriptionBottle />}
                bgColor="bg-orange-50"
                iconBgColor="bg-orange-500"
            />
            <DashboardCard
                title="Total Diagnoses"
                value={data?.diagnoses || 0}
                icon={<FaDiagnoses />}
                bgColor="bg-red-50"
                iconBgColor="bg-red-500"
            />
            <DashboardCard
                title="Total Completed Encounters"
                value={data?.completedEncounters || 0}
                icon={<FaCheckCircle />}
                bgColor="bg-green-50"
                iconBgColor="bg-green-500"
            />
            <DashboardCard
                title="Total Cancelled Encounters"
                value={data?.cancelledEncounters || 0}
                icon={<FaTimesCircle />}
                bgColor="bg-red-50"
                iconBgColor="bg-red-500"
            />
        </div>
    );
};