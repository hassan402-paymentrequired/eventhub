/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Autocomplete, LoadScript } from '@react-google-maps/api';
import { Globe } from 'lucide-react';
import { EventFormData } from '../types';

interface Props {
    eventData: EventFormData;
    handleInputChange: (field: keyof EventFormData, value: any) => void;
    onPlaceChanged: () => void;
    onLoad: (autocompleteInstance: google.maps.places.Autocomplete) => void;
    errors: any;
}

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const libraries: 'places'[] = ['places'];

const LocationInfo = ({
    eventData,
    handleInputChange,
    onPlaceChanged,
    onLoad,
    errors,
}: Props) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>
                    Where will your event take place?
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                    <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-[#14B8A6]" />
                        <div>
                            <p className="font-medium">Online Event</p>
                            <p className="text-sm text-gray-500">
                                This event will be held virtually
                            </p>
                        </div>
                    </div>
                    <Switch
                        checked={eventData.is_online}
                        onCheckedChange={(v) =>
                            handleInputChange('is_online', v)
                        }
                    />
                </div>

                {eventData.is_online ? (
                    <div>
                        <Label htmlFor="online_link">Meeting Link *</Label>
                        <Input
                            id="online_link"
                            placeholder="https://zoom.us/j/..."
                            value={eventData.online_link}
                            onChange={(e) =>
                                handleInputChange('online_link', e.target.value)
                            }
                            className="mt-1"
                        />
                        {errors.online_link && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.online_link}
                            </p>
                        )}
                    </div>
                ) : (
                    <>
                        <div>
                            <Label htmlFor="location_name">Venue Name</Label>
                            <Input
                                id="location_name"
                                placeholder="e.g., Convention Center"
                                value={eventData.location_name}
                                onChange={(e) =>
                                    handleInputChange(
                                        'location_name',
                                        e.target.value,
                                    )
                                }
                                className="mt-1"
                            />
                            {errors.location_name && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.location_name}
                                </p>
                            )}
                        </div>

                        <LoadScript
                            googleMapsApiKey={googleMapsApiKey}
                            libraries={libraries}
                        >
                            <div>
                                <Label>Address *</Label>
                                <Autocomplete
                                    onLoad={onLoad}
                                    onPlaceChanged={onPlaceChanged}
                                >
                                    <Input
                                        id="location_address"
                                        placeholder="Full address"
                                        value={eventData.location_address}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'location_address',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1"
                                    />
                                </Autocomplete>
                                {errors.location_address && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.location_address}
                                    </p>
                                )}
                            </div>
                        </LoadScript>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="city">City *</Label>
                                <Input
                                    id="city"
                                    placeholder="City"
                                    value={eventData.city}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'city',
                                            e.target.value,
                                        )
                                    }
                                    className="mt-1"
                                />
                                {errors.city && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.city}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="state">State *</Label>
                                <Input
                                    id="state"
                                    placeholder="State"
                                    value={eventData.state}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'state',
                                            e.target.value,
                                        )
                                    }
                                    className="mt-1"
                                />
                                {errors.state && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.state}
                                    </p>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default LocationInfo;
