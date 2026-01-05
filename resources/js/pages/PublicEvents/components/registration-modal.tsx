
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Ticket {
    id: string;
    name: string;
    price: number;
    description: string;
    quantity_available: number;
}

interface Event {
    id: string;
    name: string;
    is_free: boolean;
    tickets: Ticket[];
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    event: Event;
}

export default function RegistrationModal({ isOpen, onClose, event }: Props) {
    const { auth } = usePage().props as any;
    const [step, setStep] = useState(1);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [attendeeName, setAttendeeName] = useState(auth.user?.name || '');
    const [attendeeEmail, setAttendeeEmail] = useState(auth.user?.email || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTicketSelect = (ticketId: string) => {
        setSelectedTicketId(ticketId);
        setError(null);
    };

    const handleNext = () => {
        if (!event.is_free && !selectedTicketId) {
            setError('Please select a ticket.');
            return;
        }
        setStep(2);
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        router.post(
            `/events/${event.id}/register`,
            {
                ticket_id: selectedTicketId,
                quantity: quantity,
                attendee_details: {
                    name: attendeeName,
                    email: attendeeEmail,
                },
            },
            {
                onSuccess: (page: any) => {
                    setIsSubmitting(false);
                    const flash = page.props.flash;
                    if (flash && flash.error) {
                        setError(flash.error);
                    } else {
                        onClose();
                    }
                },
                onError: (errors) => {
                    setIsSubmitting(false);
                    const errorMessage = Object.values(errors).flat().join('. ');
                    setError(errorMessage || 'Registration failed. Please try again.');
                },
            }
        );
    };

    const selectedTicket = event.tickets.find((t) => t.id === selectedTicketId);
    const totalPrice = selectedTicket ? selectedTicket.price * quantity : 0;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Register for {event.name}</DialogTitle>
                    <DialogDescription>
                        {step === 1
                            ? 'Select your ticket and quantity.'
                            : 'Enter attendee details.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {step === 1 && (
                        <div className="space-y-4">
                            {!event.is_free && event.tickets.length > 0 ? (
                                <div className="space-y-3">
                                    <Label>Select Ticket</Label>
                                    {event.tickets.map((ticket) => (
                                        <div
                                            key={ticket.id}
                                            onClick={() => handleTicketSelect(ticket.id)}
                                            className={`cursor-pointer rounded-lg border p-4 transition-all hover:bg-gray-50 ${
                                                selectedTicketId === ticket.id
                                                    ? 'border-indigo-600 ring-1 ring-indigo-600'
                                                    : 'border-gray-200'
                                            }`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="font-medium text-gray-900">{ticket.name}</div>
                                                <div className="font-semibold text-gray-900">${ticket.price}</div>
                                            </div>
                                            {ticket.description && (
                                                <div className="text-sm text-gray-500 mt-1">{ticket.description}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-600">
                                    Free Registration
                                </div>
                            )}

                            {error && <p className="text-sm text-red-500">{error}</p>}

                            <div className="space-y-2">
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                />
                            </div>

                            {selectedTicket && (
                                <div className="flex justify-between border-t pt-4 font-medium">
                                    <span>Total</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={attendeeName}
                                    onChange={(e) => setAttendeeName(e.target.value)}
                                    placeholder="Jane Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={attendeeEmail}
                                    onChange={(e) => setAttendeeEmail(e.target.value)}
                                    placeholder="jane@example.com"
                                />
                            </div>
                            
                            <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
                                <p><strong>Summary:</strong></p>
                                <p>Event: {event.name}</p>
                                {selectedTicket && <p>Ticket: {selectedTicket.name} x {quantity}</p>}
                                <p>Total: {event.is_free ? 'Free' : `$${totalPrice.toFixed(2)}`}</p>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    {step === 2 && (
                        <Button variant="outline" onClick={() => setStep(1)} disabled={isSubmitting}>
                            Back
                        </Button>
                    )}
                    {step === 1 ? (
                        <Button onClick={handleNext}>Next</Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? 'Registering...' : 'Confirm Registration'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
