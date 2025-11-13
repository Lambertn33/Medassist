import { Input } from "@/components";

interface EncountersSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export const EncountersSearch = ({ value, onChange }: EncountersSearchProps) => {
    return (
        <div className="w-full md:w-1/2 lg:w-1/4">
            <Input 
                type="text" 
                placeholder="Search encounters by patient name" 
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

