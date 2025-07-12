import {
    getStates,
    getCities,
    getPostcodes,
} from "malaysia-postcodes";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { FormMessage } from "../ui/form";
import { Control } from "react-hook-form";
import { useState } from "react";
import { Input } from "../ui/input";

// THE OUTCOME THE ADDRESS SHOULD LOOK LIKE THIS 
// <unit>,<building | apartment | taman | complex>, <street>, <city>,<postcode> <state>
// 301, Apartment Saujana, Jalan PJU10/1C, Petaling Jaya, 47810, Selangor

interface MalaysiaAddressProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>;
    name: string;
}

export default function MalaysiaAddress({ control, name }: MalaysiaAddressProps) {
    const [addressComponents, setAddressComponents] = useState({
        unit: "",
        building: "",
        street: "",
        city: "",
        postcode: "",
        state: ""
    });

    const [availableCities, setAvailableCities] = useState<string[]>([]);
    const [availablePostcodes, setAvailablePostcodes] = useState<string[]>([]);

    // Build complete address string from components
    const buildAddressString = (components: typeof addressComponents) => {
        const parts = [];

        if (components.unit.trim()) parts.push(components.unit.trim());
        if (components.building.trim()) parts.push(components.building.trim());
        if (components.street.trim()) parts.push(components.street.trim());
        if (components.city.trim()) parts.push(components.city.trim());
        if (components.postcode.trim()) parts.push(components.postcode.trim());
        if (components.state.trim()) parts.push(components.state.trim());

        return parts.join(", ");
    };

    // Handle state change
    const handleStateChange = (newState: string, onChange: (value: string) => void) => {
        const newComponents = {
            ...addressComponents,
            state: newState,
            city: "", // Reset city when state changes
            postcode: "" // Reset postcode when state changes
        };

        setAddressComponents(newComponents);
        setAvailableCities(newState ? getCities(newState) : []);
        setAvailablePostcodes([]);

        // Update the form field with new address string
        onChange(buildAddressString(newComponents));
    };

    // Handle city change
    const handleCityChange = (newCity: string, onChange: (value: string) => void) => {
        const newComponents = {
            ...addressComponents,
            city: newCity,
            postcode: "" // Reset postcode when city changes
        };

        setAddressComponents(newComponents);

        // Get postcodes for the selected city and state
        if (newCity && addressComponents.state) {
            const postcodes = getPostcodes(addressComponents.state, newCity);
            setAvailablePostcodes(postcodes);
        } else {
            setAvailablePostcodes([]);
        }

        // Update the form field with new address string
        onChange(buildAddressString(newComponents));
    };

    // Handle postcode change
    const handlePostcodeChange = (newPostcode: string, onChange: (value: string) => void) => {
        const newComponents = {
            ...addressComponents,
            postcode: newPostcode
        };

        setAddressComponents(newComponents);

        // Update the form field with new address string
        onChange(buildAddressString(newComponents));
    };

    // Handle other field changes (unit, building, street)
    const handleFieldChange = (field: keyof typeof addressComponents, value: string, onChange: (value: string) => void) => {
        const newComponents = {
            ...addressComponents,
            [field]: value
        };

        setAddressComponents(newComponents);

        // Update the form field with new address string
        onChange(buildAddressString(newComponents));
    };

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="flex items-center gap-1">
                        Address
                        <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                        <div className="space-y-3">
                            {/* Unit Number */}
                            <div>
                                <label className="text-sm font-medium mb-1 block">Unit Number</label>
                                <Input
                                    placeholder="e.g., 301, A-12-3"
                                    value={addressComponents.unit}
                                    onChange={(e) => handleFieldChange('unit', e.target.value, field.onChange)}
                                />
                            </div>

                            {/* Building/Complex Name */}
                            <div>
                                <label className="text-sm font-medium mb-1 block">Building/Complex</label>
                                <Input
                                    placeholder="e.g., Apartment Saujana, Taman Desa"
                                    value={addressComponents.building}
                                    onChange={(e) => handleFieldChange('building', e.target.value, field.onChange)}
                                />
                            </div>

                            {/* Street Address */}
                            <div>
                                <label className="text-sm font-medium mb-1 block">Street</label>
                                <Input
                                    placeholder="e.g., Jalan PJU10/1C"
                                    value={addressComponents.street}
                                    onChange={(e) => handleFieldChange('street', e.target.value, field.onChange)}
                                />
                            </div>

                            {/* State */}
                            <div>
                                <label className="text-sm font-medium mb-1 block">State <span className="text-red-500">*</span></label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={addressComponents.state}
                                    onChange={(e) => handleStateChange(e.target.value, field.onChange)}
                                >
                                    <option value="">Select a state</option>
                                    {getStates().map((state) => (
                                        <option key={state} value={state}>
                                            {state}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* City */}
                            <div>
                                <label className="text-sm font-medium mb-1 block">City <span className="text-red-500">*</span></label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={addressComponents.city}
                                    onChange={(e) => handleCityChange(e.target.value, field.onChange)}
                                    disabled={!addressComponents.state}
                                >
                                    <option value="">Select a city</option>
                                    {availableCities.map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Postcode */}
                            <div>
                                <label className="text-sm font-medium mb-1 block">Postcode <span className="text-red-500">*</span></label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={addressComponents.postcode}
                                    onChange={(e) => handlePostcodeChange(e.target.value, field.onChange)}
                                    disabled={!addressComponents.city}
                                >
                                    <option value="">Select a postcode</option>
                                    {availablePostcodes.map((postcode) => (
                                        <option key={postcode} value={postcode}>
                                            {postcode}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Preview of complete address */}
                            {field.value && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                                    <label className="text-sm font-medium text-gray-600 block mb-1">Complete Address:</label>
                                    <p className="text-sm text-gray-800">{field.value}</p>
                                </div>
                            )}
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}