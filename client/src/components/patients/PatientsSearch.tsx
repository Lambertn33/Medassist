import { useState } from "react";
import { Input } from "@/components";

export const PatientsSearch = () => {
    const [search, setSearch] = useState('');
    return (
        <div className="w-full md:w-1/2 lg:w-1/4">
            <Input type="text" 
            placeholder="Search patients by name" 
            name="search"
            autoComplete="off"
            required={false}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={false}
            additionalClasses="w-full"
                />
        </div>
    );
};