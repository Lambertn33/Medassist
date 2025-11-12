import { Input } from "@/components";

interface PatientsSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export const PatientsSearch = ({ value, onChange }: PatientsSearchProps) => {
    return (
        <div className="w-full md:w-1/2 lg:w-1/4">
            <Input 
                type="text" 
                placeholder="Search patients by name" 
                name="search"
                autoComplete="off"
                required={false}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={false}
                additionalClasses="w-full"
            />
        </div>
    );
};