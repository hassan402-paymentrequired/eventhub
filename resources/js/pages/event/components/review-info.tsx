import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { EventFormData } from '../types';
import { Calendar, Clock, DollarSign, MapPin } from 'lucide-react';

interface Props {
    eventData: EventFormData;
}

const ReviewInfo = ({eventData}: Props) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Review Your Event</CardTitle>
                <CardDescription>
                    Make sure everything looks good before publishing
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* {eventData.image_url && (
                    <img
                        src={eventData.image_url}
                        alt="Event"
                        className="h-48 w-full rounded-xl object-cover"
                    />
                )} */}

                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <h3 className="text-lg font-semibold text-[#0A1F44]">
                            {eventData.title || 'Untitled Event'}
                        </h3>
                        <p className="mt-1 text-gray-500">
                            {eventData.short_description}
                        </p>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-[#14B8A6]" />
                            <span>{eventData.date || 'No date set'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-[#14B8A6]" />
                            <span>{eventData.start_time || 'No time set'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-[#14B8A6]" />
                            <span>
                                {eventData.is_online
                                    ? 'Online Event'
                                    : eventData.location_name || 'No location'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-[#14B8A6]" />
                            <span>
                                {eventData.is_free
                                    ? 'Free'
                                    : `${eventData.ticket_types.length} ticket types`}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <p className="whitespace-pre-wrap text-gray-600">
                        {eventData.description || 'No description'}
                    </p>
                </div>

                {eventData.speakers.length > 0 && (
                    <div className="border-t pt-4">
                        <h4 className="mb-2 font-medium">
                            Speakers ({eventData.speakers.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {eventData.speakers.map((s, i) => (
                                <span
                                    key={i}
                                    className="rounded-full bg-gray-100 px-3 py-1 text-sm"
                                >
                                    {s.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {eventData.agenda.length > 0 && (
                    <div className="border-t pt-4">
                        <h4 className="mb-2 font-medium">
                            Schedule ({eventData.agenda.length} items)
                        </h4>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ReviewInfo;
