import { EncounterDetails, Loader, Toast } from "@/components";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import type { IEncounter } from "@/interfaces/encounters/IEncounter";
import { getEncounter } from "@/api/encounters";


export const EncountersDetailsPage = () => {
    const { encounterId } = useParams();
    const { data: encounterData, isLoading, error } = useQuery<{ encounter: IEncounter }>({
        queryKey: ['encounter', encounterId],
        queryFn: () => getEncounter(parseInt(encounterId as string)),
    });
    return (
        <div>
            {isLoading && <Loader />}
            {error && <Toast message={error.message} type="error" />}
            {encounterData && <EncounterDetails encounter={encounterData.encounter} />}
        </div>
    );
};