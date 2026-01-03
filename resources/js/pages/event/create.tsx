/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import events from '@/routes/events';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Calendar,
    DollarSign,
    Eye,
    Loader2,
    MapPin,
    Save,
    Send,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import BasicInfo from './components/basic-info';
import LocationInfo from './components/location-info';
import ReviewInfo from './components/review-info';
import SpeakerInfo from './components/speaker-info';
import TicketInfo from './components/ticket-info';
import { Category, EventFormData, Speaker } from './types';

export const Eventsteps = [
    { title: 'Basic Info', icon: Calendar },
    { title: 'Location', icon: MapPin },
    { title: 'Tickets', icon: DollarSign },
    { title: 'Details', icon: Users },
    { title: 'Review', icon: Eye },
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Create Event',
        href: '#',
    },
];

const CreateEvent = ({ categories }: { categories: Category[] }) => {
    const [activeStep, setActiveStep] = useState(0);

    const { data, setData, processing, post, errors } = useForm<EventFormData>({
        title: '',
        description: '',
        category: '',
        date: '',
        start_time: '',
        end_time: '',
        is_online: false,
        online_link: '',
        location_name: '',
        location_address: '',
        location_lat: null,
        location_lng: null,
        is_free: true,
        capacity: '',
        ticket_types: [],
        speakers: [],
        agenda: [],
        tags: [],
        faqs: [],
        images: [],
        status: 'draft',
        city: '',
        state: '',
    });
    const [tagInput, setTagInput] = useState('');

    const [autocomplete, setAutocomplete] =
        useState<google.maps.places.Autocomplete | null>(null);

    const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
        setAutocomplete(autocompleteInstance);
    };

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();

            if (place.address_components) {
                let city = '';
                let state = '';

                place.address_components.forEach((component) => {
                    const types = component.types;
                    if (types.includes('locality')) {
                        city = component.long_name;
                    }
                    if (types.includes('administrative_area_level_1')) {
                        state = component.short_name;
                    }
                });

                setData({
                    ...data,
                    location_address: place.formatted_address || '',
                    city,
                    state,
                    location_lat: place.geometry?.location?.lat() || null,
                    location_lng: place.geometry?.location?.lng() || null,
                });
            }
        }
    };

    const handleInputChange = (field: keyof EventFormData, value: any) => {
        setData(field, value);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (!files.length) return;

        setData('images', [...data.images, ...files]);
    };

    const addTicketType = () => {
        setData('ticket_types', [
            ...data.ticket_types,
            {
                name: '',
                price: 0,
                capacity: '',
                description: '',
            },
        ]);
    };

    const updateTicketType = (index: number, field: string, value: string) => {
        const updated = data.ticket_types.map((item, i) =>
            i === index ? { ...item, [field]: value } : item,
        );

        handleInputChange('ticket_types', updated);
    };

    const removeTicketType = (index: number) => {
        setData(
            'ticket_types',
            data.ticket_types.filter((_, i) => i !== index),
        );
    };

    const addSpeaker = () => {
        setData('speakers', [
            ...data.speakers,
            { name: '', title: '', bio: '', image_url: '' },
        ]);
    };

    const updateSpeaker = (
        index: number,
        field: keyof Speaker,
        value: string,
    ) => {
        const updated = data.speakers.map((speaker, i) =>
            i === index ? { ...speaker, [field]: value } : speaker,
        );

        handleInputChange('speakers', updated);
    };

    const removeSpeaker = (index: number) => {
        setData(
            'speakers',
            data.speakers.filter((_, i) => i !== index),
        );
    };

    const addAgendaItem = () => {
        setData('agenda', [
            ...data.agenda,
            { start_time: '', end_time: '', title: '', description: '' },
        ]);
    };

    const updateAgendaItem = (
        index: number,
        field: 'start_time' | 'end_time' | 'title' | 'description',
        value: string,
    ) => {
        const updated = data.agenda.map((item, i) =>
            i === index ? { ...item, [field]: value } : item,
        );

        handleInputChange('agenda', updated);
    };

    // Remove agenda item
    const removeAgendaItem = (index: number) => {
        setData(
            'agenda',
            data.agenda.filter((_, i) => i !== index),
        );
    };

    // Add FAQ
    const addFaq = () => {
        setData('faqs', [...data.faqs, { question: '', answer: '' }]);
    };

    // Update FAQ
    const updateFaq = (
        index: number,
        field: 'question' | 'answer',
        value: string,
    ) => {
        const updated = data.faqs.map((faq, i) =>
            i === index ? { ...faq, [field]: value } : faq,
        );

        setData('faqs', updated);
    };

    // Remove FAQ
    const removeFaq = (index: number) => {
        setData(
            'faqs',
            data.faqs.filter((_, i) => i !== index),
        );
    };

    const addTag = () => {
        if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
            handleInputChange('tags', [...data.tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        handleInputChange(
            'tags',
            data.tags.filter((t) => t !== tag),
        );
    };

    const getStepErrors = (stepIndex: number): boolean => {
        const stepFields: Record<number, string[]> = {
            0: [
                'title',
                'description',
                'category',
                'date',
                'start_time',
                'end_time',
                'tags',
                'images',
            ],
            1: [
                'is_online',
                'online_link',
                'location_name',
                'location_address',
                'city',
                'state',
                'location_lat',
                'location_lng',
            ],
            2: ['is_free', 'capacity', 'ticket_types'],
            3: ['speakers', 'agenda', 'faqs'],
        };

        const fields = stepFields[stepIndex] || [];
        return Object.keys(errors).some((key) =>
            fields.some((field) => key.startsWith(field)),
        );
    };

    const saveEvent = async (status: string) => {
        setData('status', status);
        post(events.store().url, {
            onError: (errors) => {
                // Show error toast with first error message
                const firstError = Object.values(errors)[0];
                console.error('Event creation failed:', errors);

                // Find which step has errors and navigate to it
                const errorFields = Object.keys(errors);
                if (
                    errorFields.some((f) =>
                        [
                            'title',
                            'description',
                            'category',
                            'date',
                            'start_time',
                            'end_time',
                            'tags',
                            'images',
                        ].includes(f),
                    )
                ) {
                    setActiveStep(0);
                } else if (
                    errorFields.some((f) =>
                        [
                            'is_online',
                            'online_link',
                            'location_name',
                            'location_address',
                            'city',
                            'state',
                        ].includes(f),
                    )
                ) {
                    setActiveStep(1);
                } else if (
                    errorFields.some((f) =>
                        ['is_free', 'capacity', 'ticket_types'].includes(f),
                    )
                ) {
                    setActiveStep(2);
                } else if (
                    errorFields.some((f) =>
                        ['speakers', 'agenda', 'faqs'].includes(f),
                    )
                ) {
                    setActiveStep(3);
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Event" />

            <div className="min-h-screen bg-gray-50/50 py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 lg:grid-cols-12">
                        {/* Sidebar Stepper */}
                        <div className="lg:col-span-3">
                            <div className="sticky top-8 space-y-8">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Create Event
                                    </h1>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Share your event with the world.
                                    </p>
                                </div>

                                <nav className="space-y-1">
                                    {Eventsteps.map((step, i) => {
                                        const hasErrors = getStepErrors(i);
                                        const isActive = activeStep === i;
                                        const isCompleted = activeStep > i;

                                        return (
                                            <div
                                                key={i}
                                                className="relative pb-8 last:pb-0"
                                            >
                                                {/* Connecting Line */}
                                                {i !== Eventsteps.length - 1 && (
                                                    <div
                                                        className={`absolute left-3.5 top-8 -ml-px h-full w-0.5 ${
                                                            isCompleted
                                                                ? 'bg-teal-500'
                                                                : 'bg-gray-200'
                                                        }`}
                                                        aria-hidden="true"
                                                    />
                                                )}

                                                <button
                                                    onClick={() =>
                                                        setActiveStep(i)
                                                    }
                                                    disabled={i > activeStep && !isCompleted} // Optional: restrict jumping forward
                                                    className="group relative flex items-start"
                                                >
                                                    <span className="flex h-9 items-center">
                                                        <span
                                                            className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors ${
                                                                isActive
                                                                    ? 'border-teal-500 bg-white'
                                                                    : isCompleted
                                                                    ? 'border-teal-500 bg-teal-500'
                                                                    : hasErrors
                                                                    ? 'border-red-500 bg-white'
                                                                    : 'border-gray-300 bg-white'
                                                            }`}
                                                        >
                                                            {isCompleted ? (
                                                                <svg
                                                                    className="h-4 w-4 text-white"
                                                                    viewBox="0 0 20 20"
                                                                    fill="currentColor"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            ) : (
                                                                <step.icon
                                                                    className={`h-3.5 w-3.5 ${
                                                                        isActive
                                                                            ? 'text-teal-500'
                                                                            : hasErrors
                                                                            ? 'text-red-500'
                                                                            : 'text-gray-400'
                                                                    }`}
                                                                />
                                                            )}
                                                        </span>
                                                    </span>
                                                    <span className="ml-4 flex min-w-0 flex-col text-left">
                                                        <span
                                                            className={`text-sm font-semibold tracking-wide ${
                                                                isActive
                                                                    ? 'text-teal-600'
                                                                    : isCompleted
                                                                    ? 'text-gray-900'
                                                                    : 'text-gray-500'
                                                            }`}
                                                        >
                                                            {step.title}
                                                        </span>
                                                    </span>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </nav>
                                
                                {/* Draft Status */}
                                <div className="rounded-xl bg-blue-50 p-4">
                                     <div className="flex">
                                        <div className="flex-shrink-0">
                                            <div className="h-2 w-2 rounded-full bg-blue-400 mt-2"></div>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-blue-800">Draft Saved</h3>
                                            <div className="mt-1 text-sm text-blue-700">
                                                <p>Last saved just now</p>
                                            </div>
                                        </div>
                                     </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Info */}
                        <div className="lg:col-span-9">
                            {/* Error Summary */}
                            {Object.keys(errors).length > 0 && (
                                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <svg
                                                className="h-5 w-5 text-red-400"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">
                                                There{' '}
                                                {Object.keys(errors).length === 1
                                                    ? 'is'
                                                    : 'are'}{' '}
                                                {Object.keys(errors).length} error
                                                {Object.keys(errors).length === 1
                                                    ? ''
                                                    : 's'}{' '}
                                                with your submission
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            )}

                             <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                                <div className="p-8">
                                    <motion.div
                                        key={activeStep}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {activeStep === 0 && (
                                            <BasicInfo
                                                eventData={data}
                                                addTag={addTag}
                                                removeTag={removeTag}
                                                categories={categories}
                                                handleInputChange={handleInputChange}
                                                handleImageUpload={handleImageUpload}
                                                tagInput={tagInput}
                                                setTagInput={setTagInput}
                                                errors={errors}
                                            />
                                        )}

                                        {activeStep === 1 && (
                                            <LocationInfo
                                                eventData={data}
                                                handleInputChange={handleInputChange}
                                                onLoad={onLoad}
                                                onPlaceChanged={onPlaceChanged}
                                                errors={errors}
                                            />
                                        )}

                                        {activeStep === 2 && (
                                            <TicketInfo
                                                updateTicketType={updateTicketType}
                                                addTicketType={addTicketType}
                                                removeTicketType={removeTicketType}
                                                eventData={data}
                                                handleInputChange={handleInputChange}
                                                errors={errors}
                                            />
                                        )}

                                        {activeStep === 3 && (
                                            <SpeakerInfo
                                                eventData={data}
                                                addAgendaItem={addAgendaItem}
                                                addFaq={addFaq}
                                                addSpeaker={addSpeaker}
                                                removeAgendaItem={removeAgendaItem}
                                                updateAgendaItem={updateAgendaItem}
                                                removeFaq={removeFaq}
                                                removeSpeaker={removeSpeaker}
                                                updateFaq={updateFaq}
                                                updateSpeaker={updateSpeaker}
                                            />
                                        )}

                                        {activeStep === 4 && <ReviewInfo eventData={data} />}
                                    </motion.div>
                                </div>

                                {/* Form Footer / Navigation */}
                                <div className="border-t border-gray-100 bg-gray-50/50 p-6 px-8 rounded-b-2xl flex items-center justify-between">
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            setActiveStep(Math.max(0, activeStep - 1))
                                        }
                                        disabled={activeStep === 0}
                                        className="bg-white border-gray-200"
                                    >
                                        Back
                                    </Button>

                                    <div className="flex gap-3">
                                        <Button
                                            variant="outline"
                                            onClick={() => saveEvent('draft')}
                                            disabled={processing}
                                            className="bg-white border-gray-200"
                                        >
                                            {processing ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Save className="mr-2 h-4 w-4" />
                                            )}
                                            Save Draft
                                        </Button>

                                        {activeStep < 4 ? (
                                            <Button
                                                onClick={() =>
                                                    setActiveStep(activeStep + 1)
                                                }
                                                className="bg-[#14B8A6] hover:bg-[#0d9488] shadow-lg shadow-teal-500/20"
                                            >
                                                Next Step
                                                <svg className="ml-2 -mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                </svg>
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={() => saveEvent('published')}
                                                disabled={processing}
                                                className="bg-[#0A1F44] hover:bg-[#0A1F44]/90 shadow-lg shadow-blue-900/20"
                                            >
                                                {processing ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Send className="mr-2 h-4 w-4" />
                                                )}
                                                Publish Event
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default CreateEvent;
