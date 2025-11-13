import { formatDate } from "@/utils";
import { FaUser, FaPhone, FaUserFriends } from "react-icons/fa";
import type { IPatientDetails } from "@/interfaces/patients/IPatient";

export const PatientDetailsInfo = ({ patientDetails }: { patientDetails: IPatientDetails }) => {

    const detailsInfo: { title: string, icon: React.ReactNode, details: { title: string, value: string }[] }[] = [
        {
            title: "Personal Information",
            icon: <FaUser className="text-blue-600" />,
            details: [
                {
                    title: "Gender",
                    value: patientDetails.gender,
                },
                {
                    title: "Date of Birth",
                    value: formatDate(patientDetails.date_of_birth),
                },
                {
                    title: "National ID",
                    value: patientDetails.national_id,
                },
            ],
        },
        {
            title: "Contact Information",
            icon: <FaPhone className="text-blue-600" />,
            details: [
                {
                    title: "Phone",
                    value: patientDetails.phone,
                },
                {
                    title: "Address",
                    value: patientDetails.address,
                },
            ],
        },
        {
            title: "Emergency Contact",
            icon: <FaUserFriends className="text-blue-600" />,
            details: [
                {
                    title: "Name",
                    value: patientDetails.emergency_contact_name,
                },
            ],
        },
    ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {detailsInfo.map((detail) => (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    {detail.icon}
                    {detail.title}
                </h3>
                <div className="space-y-3">
                    {detail.details.map((detail) => (
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                {detail.title}
                            </p>
                            <p className="text-sm text-gray-900">{detail.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
    );
};