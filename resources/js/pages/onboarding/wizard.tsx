import { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import { Button } from '@/components/button';
import { Container } from '@/components/container';
import { Check, MapPin, Monitor, Users, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Category {
    id: number;
    name: string;
}

interface WizardProps {
    categories: Category[];
}

export default function Wizard({ categories }: WizardProps) {
    const [step, setStep] = useState(1);
    const { data, setData, post, processing } = useForm({
        interests: [] as number[],
        preferred_location: '',
        event_preference: 'both',
        is_organizer: false,
    });

    const toggleInterest = (id: number) => {
        if (data.interests.includes(id)) {
            setData('interests', data.interests.filter(i => i !== id));
        } else {
            setData('interests', [...data.interests, id]);
        }
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/onboarding');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head title="Welcome to EventHub" />

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            {[1, 2, 3, 4].map((s) => (
                                <div key={s} className={`flex items-center ${s < 4 ? 'flex-1' : ''}`}>
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                                        step >= s ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-300 text-gray-400'
                                    }`}>
                                        {s}
                                    </div>
                                    {s < 4 && (
                                        <div className={`flex-1 h-0.5 mx-2 ${step > s ? 'bg-purple-600' : 'bg-gray-300'}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                        <h2 className="text-2xl font-bold text-center text-gray-900">
                            {step === 1 && "What are you interested in?"}
                            {step === 2 && "Where should we look?"}
                            {step === 3 && "How do you prefer to attend?"}
                            {step === 4 && "What brings you here?"}
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            {step === 1 && "Select the topics that excite you the most."}
                            {step === 2 && "We'll show you events in your preferred location."}
                            {step === 3 && "Choose your preferred event format."}
                            {step === 4 && "Help us customize your dashboard."}
                        </p>
                    </div>

                    <form onSubmit={submit}>
                        {/* Step 1: Interests */}
                        {step === 1 && (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {categories.map((category) => (
                                    <div
                                        key={category.id}
                                        onClick={() => toggleInterest(category.id)}
                                        className={`cursor-pointer rounded-lg border p-4 text-center transition-all hover:shadow-md ${
                                            data.interests.includes(category.id)
                                                ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500'
                                                : 'border-gray-200 bg-white hover:border-purple-200'
                                        }`}
                                    >
                                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                        {data.interests.includes(category.id) && (
                                            <div className="mt-2 text-xs text-purple-600 font-semibold">Selected</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Step 2: Location */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                        Preferred City/Region
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="location"
                                            id="location"
                                            value={data.preferred_location}
                                            onChange={(e) => setData('preferred_location', e.target.value)}
                                            className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                                            placeholder="e.g. San Francisco, CA"
                                        />
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">Leave blank if you're open to events anywhere.</p>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Event Format */}
                        {step === 3 && (
                            <div className="space-y-4">
                                {[
                                    { id: 'in_person', label: 'In-Person', icon: Users, desc: 'I want to meet people face-to-face.' },
                                    { id: 'online', label: 'Online', icon: Monitor, desc: 'I prefer attending from home.' },
                                    { id: 'both', label: 'Both', icon: Calendar, desc: "I'm open to anything!" },
                                ].map((option) => (
                                    <div
                                        key={option.id}
                                        onClick={() => setData('event_preference', option.id)}
                                        className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none ${
                                            data.event_preference === option.id
                                                ? 'border-purple-500 ring-1 ring-purple-500'
                                                : 'border-gray-300'
                                        }`}
                                    >
                                        <div className="flex flex-1">
                                            <div className="flex flex-col">
                                                <span className="block text-sm font-medium text-gray-900">
                                                    <div className="flex items-center gap-2">
                                                        <option.icon className="h-4 w-4 text-gray-500" />
                                                        {option.label}
                                                    </div>
                                                </span>
                                                <span className="mt-1 flex items-center text-sm text-gray-500">
                                                    {option.desc}
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                                                data.event_preference === option.id
                                                    ? 'border-purple-600 bg-purple-600'
                                                    : 'border-gray-300 bg-white'
                                            }`}
                                        >
                                            {data.event_preference === option.id && (
                                                <div className="h-2.5 w-2.5 rounded-full bg-white" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Step 4: Role */}
                        {step === 4 && (
                            <div className="space-y-4">
                                <div
                                    onClick={() => setData('is_organizer', false)}
                                    className={`cursor-pointer rounded-lg border p-6 text-center hover:shadow-md ${
                                        data.is_organizer === false
                                            ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500'
                                            : 'border-gray-200 bg-white'
                                    }`}
                                >
                                    <h3 className="text-lg font-medium text-gray-900">Attend Events</h3>
                                    <p className="mt-1 text-sm text-gray-500">I want to discover and register for events.</p>
                                </div>

                                <div
                                    onClick={() => setData('is_organizer', true)}
                                    className={`cursor-pointer rounded-lg border p-6 text-center hover:shadow-md ${
                                        data.is_organizer === true
                                            ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500'
                                            : 'border-gray-200 bg-white'
                                    }`}
                                >
                                    <h3 className="text-lg font-medium text-gray-900">Organize Events</h3>
                                    <p className="mt-1 text-sm text-gray-500">I want to create and manage my own events.</p>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex justify-between">
                            {step > 1 ? (
                                <Button type="button" variant="outline" onClick={prevStep}>
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                </Button>
                            ) : (
                                <div /> /* Spacer */
                            )}

                            {step < 4 ? (
                                <Button type="button" onClick={nextStep} disabled={step === 1 && data.interests.length === 0}>
                                    Next <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Get Started'}
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
