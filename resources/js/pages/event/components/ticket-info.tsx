/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { DollarSign, Plus, Trash2 } from 'lucide-react';
import { EventFormData } from '../types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Props {
    eventData: EventFormData;
    handleInputChange: (field: keyof EventFormData, value: any) => void;
    addTicketType: () => void,
    removeTicketType: (index: number) => void,
    updateTicketType: (index: number, field: string, value: string) => void,
}

const TicketInfo = ({handleInputChange,eventData, removeTicketType, addTicketType, updateTicketType }: Props) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Tickets & Pricing</CardTitle>
                <CardDescription>
                    Set up your event tickets and capacity
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                    <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-[#14B8A6]" />
                        <div>
                            <p className="font-medium">Free Event</p>
                            <p className="text-sm text-gray-500">
                                No charge for attendees
                            </p>
                        </div>
                    </div>
                    <Switch
                        checked={eventData.is_free}
                        onCheckedChange={(v) => handleInputChange('is_free', v)}
                    />
                </div>

                <div>
                    <Label htmlFor="capacity">Event Capacity</Label>
                    <Input
                        id="capacity"
                        type="number"
                        placeholder="Leave empty for unlimited"
                        value={eventData.capacity}
                        onChange={(e) =>
                            handleInputChange('capacity', e.target.value)
                        }
                        className="mt-1"
                    />
                </div>

                {!eventData.is_free && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Ticket Types</Label>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={addTicketType}
                            >
                                <Plus className="mr-1 h-4 w-4" />
                                Add Ticket
                            </Button>
                        </div>

                        {eventData.ticket_types.map((ticket, i) => (
                            <div
                                key={i}
                                className="space-y-3 rounded-xl border p-4"
                            >
                                <div className="flex items-start justify-between">
                                    <span className="text-sm font-medium text-gray-500">
                                        Ticket #{i + 1}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeTicketType(i)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                                <div className="grid gap-3 md:grid-cols-3">
                                    <Input
                                        placeholder="Ticket name"
                                        value={ticket.name}
                                        onChange={(e) =>
                                            updateTicketType(
                                                i,
                                                'name',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Price"
                                        value={ticket.price}
                                        onChange={(e) =>
                                            updateTicketType(
                                                i,
                                                'price',
                                                (parseFloat(e.target.value) || 0).toString(),
                                            )
                                        }
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Capacity"
                                        value={ticket.capacity}
                                        onChange={(e) =>
                                            updateTicketType(
                                                i,
                                                'capacity',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <Input
                                    placeholder="Ticket description"
                                    value={ticket.description}
                                    onChange={(e) =>
                                        updateTicketType(
                                            i,
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        ))}

                        {eventData.ticket_types.length === 0 && (
                            <p className="py-4 text-center text-gray-500">
                                No ticket types added yet. Click "Add Ticket" to
                                create one.
                            </p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default TicketInfo;
