import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { EventFormData, Speaker } from '../types';

interface Props {
    eventData: EventFormData;
    addSpeaker: () => void;
    removeSpeaker: (index: number) => void;
    updateSpeaker: (index: number, field: keyof Speaker, value: string) => void;
    addAgendaItem: () => void;
    updateFaq: (
        index: number,
        field: 'question' | 'answer',
        value: string,
    ) => void;
    removeFaq: (index: number) => void;
    addFaq: () => void;
    updateAgendaItem: (
        index: number,
        field: 'start_time' | 'end_time' | 'title' | 'description',
        value: string,
    ) => void;
    removeAgendaItem: (index: number) => void;
}

const SpeakerInfo = ({
    eventData,
    addSpeaker,
    removeSpeaker,
    updateSpeaker,
    updateFaq,
    removeFaq,
    addAgendaItem,
    addFaq,
    updateAgendaItem,
    removeAgendaItem,
}: Props) => {
    return (
        <div className="space-y-6">
            {/* Speakers */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Speakers</CardTitle>
                            <CardDescription>
                                Add featured speakers or hosts
                            </CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={addSpeaker}
                        >
                            <Plus className="mr-1 h-4 w-4" />
                            Add Speaker
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {eventData.speakers.map((speaker, i) => (
                        <div
                            key={i}
                            className="space-y-3 rounded-xl border p-4"
                        >
                            <div className="flex items-start justify-between">
                                <span className="text-sm font-medium text-gray-500">
                                    Speaker #{i + 1}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeSpeaker(i)}
                                >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                            <div className="grid gap-3 md:grid-cols-2">
                                <Input
                                    placeholder="Name"
                                    value={speaker.name}
                                    onChange={(e) =>
                                        updateSpeaker(i, 'name', e.target.value)
                                    }
                                />
                                <Input
                                    placeholder="Title/Role"
                                    value={speaker.title}
                                    onChange={(e) =>
                                        updateSpeaker(
                                            i,
                                            'title',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <Input
                                placeholder="Bio"
                                value={speaker.bio}
                                onChange={(e) =>
                                    updateSpeaker(i, 'bio', e.target.value)
                                }
                            />
                            <Input
                                placeholder="Photo URL"
                                value={speaker.image_url}
                                onChange={(e) =>
                                    updateSpeaker(
                                        i,
                                        'image_url',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                    ))}
                    {eventData.speakers.length === 0 && (
                        <p className="py-4 text-center text-gray-500">
                            No speakers added yet
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Agenda */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Event Schedule</CardTitle>
                            <CardDescription>Add agenda items</CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={addAgendaItem}
                        >
                            <Plus className="mr-1 h-4 w-4" />
                            Add Item
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {eventData.agenda.map((item, i) => (
                        <div
                            key={i}
                            className="space-y-3 rounded-xl border p-4"
                        >
                            <div className="flex items-start justify-between">
                                <span className="text-sm font-medium text-gray-500">
                                    Item #{i + 1}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeAgendaItem(i)}
                                >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                            <div className="grid gap-3 md:grid-cols-5">
                                <Input
                                    type="time"
                                    placeholder="Start Time"
                                    value={item.start_time}
                                    onChange={(e) =>
                                        updateAgendaItem(
                                            i,
                                            'start_time',
                                            e.target.value,
                                        )
                                    }
                                />
                                <Input
                                    type="time"
                                    placeholder="End Time"
                                    value={item.end_time}
                                    onChange={(e) =>
                                        updateAgendaItem(
                                            i,
                                            'end_time',
                                            e.target.value,
                                        )
                                    }
                                />
                                <Input
                                    placeholder="Title"
                                    value={item.title}
                                    onChange={(e) =>
                                        updateAgendaItem(
                                            i,
                                            'title',
                                            e.target.value,
                                        )
                                    }
                                    className="md:col-span-3"
                                />
                            </div>
                            <Input
                                placeholder="Description"
                                value={item.description}
                                onChange={(e) =>
                                    updateAgendaItem(
                                        i,
                                        'description',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                    ))}
                    {eventData.agenda.length === 0 && (
                        <p className="py-4 text-center text-gray-500">
                            No schedule items added yet
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* FAQs */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>FAQs</CardTitle>
                            <CardDescription>
                                Common questions about your event
                            </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={addFaq}>
                            <Plus className="mr-1 h-4 w-4" />
                            Add FAQ
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {eventData.faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="space-y-3 rounded-xl border p-4"
                        >
                            <div className="flex items-start justify-between">
                                <span className="text-sm font-medium text-gray-500">
                                    FAQ #{i + 1}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeFaq(i)}
                                >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                            <Input
                                placeholder="Question"
                                value={faq.question}
                                onChange={(e) =>
                                    updateFaq(i, 'question', e.target.value)
                                }
                            />
                            <Textarea
                                placeholder="Answer"
                                value={faq.answer}
                                onChange={(e) =>
                                    updateFaq(i, 'answer', e.target.value)
                                }
                            />
                        </div>
                    ))}
                    {eventData.faqs.length === 0 && (
                        <p className="py-4 text-center text-gray-500">
                            No FAQs added yet
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default SpeakerInfo;
