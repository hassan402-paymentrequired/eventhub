/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { format } from 'date-fns';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Upload } from 'lucide-react';
import { ChangeEvent } from 'react';
import { Category, EventFormData } from '../types';

interface Props {
    categories: Category[];
    handleInputChange: (field: keyof EventFormData, value: any) => void;
    eventData: EventFormData;
    handleImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
    addTag: () => void;
    setTagInput: (value: string) => void;
    removeTag: (index: string) => void;
    tagInput: string;
    errors: any;
}

const BasicInfo = ({
    categories,
    handleInputChange,
    eventData,
    handleImageUpload,
    addTag,
    removeTag,
    tagInput,
    setTagInput,
    errors,
}: Props) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                    Enter the essential details about your event
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                        id="title"
                        placeholder="Give your event a catchy title"
                        value={eventData.title}
                        onChange={(e) =>
                            handleInputChange('title', e.target.value)
                        }
                        className="mt-1"
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.title}
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor="description">Full Description *</Label>
                    <Textarea
                        id="description"
                        placeholder="Describe your event in detail..."
                        value={eventData.description}
                        onChange={(e) =>
                            handleInputChange('description', e.target.value)
                        }
                        className="mt-1 min-h-[150px]"
                    />
                    {errors.description && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.description}
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                        value={eventData.category}
                        onValueChange={(v) => handleInputChange('category', v)}
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.category && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.category}
                        </p>
                    )}
                </div>

                <div>
                    <Label>Event Image</Label>
                    <div className="mt-1">
                        {eventData.images.length ? (
                            eventData.images.map((i, index) => {
                                const url = URL.createObjectURL(i);
                                return (
                                    <div className="relative" key={index}>
                                        <img
                                            src={url}
                                            alt="Event"
                                            className="h-48 w-full rounded-xl object-cover"
                                        />
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2"
                                            onClick={() =>
                                                handleInputChange(
                                                    'images',
                                                    eventData.images.filter(
                                                        (_, i) => i !== index,
                                                    ),
                                                )
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                );
                            })
                        ) : (
                            <label className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 transition-colors hover:border-[#14B8A6]">
                                <Upload className="mb-2 h-8 w-8 text-gray-400" />
                                <span className="text-gray-500">
                                    Click to upload image
                                </span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </label>
                        )}
                    </div>
                    {errors.images && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.images}
                        </p>
                    )}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="date">Date *</Label>
                        <DatePicker
                            date={eventData.date ? new Date(eventData.date) : undefined}
                            setDate={(date) => {
                                handleInputChange(
                                    'date',
                                    date ? format(date, 'yyyy-MM-dd') : ''
                                );
                            }}
                        />
                        {errors.date && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.date}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="start_time">Start Time *</Label>
                        <div className="relative">
                            <Input
                                id="start_time"
                                type="time"
                                value={eventData.start_time}
                                onChange={(e) =>
                                    handleInputChange('start_time', e.target.value)
                                }
                                className="block w-full"
                            />
                        </div>
                        {errors.start_time && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.start_time}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="end_time">End Time *</Label>
                        <div className="relative">
                            <Input
                                id="end_time"
                                type="time"
                                value={eventData.end_time}
                                onChange={(e) =>
                                    handleInputChange('end_time', e.target.value)
                                }
                                className="block w-full"
                            />
                        </div>
                        {errors.end_time && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.end_time}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <Label>Tags</Label>
                    <div className="mt-1 flex gap-2">
                        <Input
                            placeholder="Add tags for better discovery"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) =>
                                e.key === 'Enter' &&
                                (e.preventDefault(), addTag())
                            }
                        />
                        <Button type="button" onClick={addTag}>
                            Add
                        </Button>
                    </div>
                    {eventData.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {eventData?.tags.map((tag, i) => (
                                <span
                                    key={i}
                                    className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm"
                                >
                                    {tag}
                                    <button
                                        onClick={() => removeTag(tag)}
                                        className="hover:text-red-500"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default BasicInfo;
