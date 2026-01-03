<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EventStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'category' => 'required|exists:event_categories,id',
            'location_name' => 'nullable|string|max:255',
            'location_address' => 'required_if:is_online,false|nullable|string|max:255',
            'location_lat' => 'nullable|numeric',
            'location_lng' => 'nullable|numeric',
            'is_online' => 'required|boolean',
            'online_link' => 'required_if:is_online,true|nullable|url',
            'is_free' => 'required|boolean',
            'capacity' => 'nullable|integer|min:1',
            'state' => 'required_if:is_online,false|nullable|string|max:255',
            'city' => 'required_if:is_online,false|nullable|string|max:255',
            'status' => 'required|string|in:draft,published,archived',

            'ticket_types' => 'nullable|array',
            'ticket_types.*.name' => 'required|string|max:255',
            'ticket_types.*.price' => 'required|numeric|min:0',
            'ticket_types.*.capacity' => 'nullable|string',
            'ticket_types.*.description' => 'nullable|string',

            'faqs' => 'nullable|array',
            'faqs.*.question' => 'required|string',
            'faqs.*.answer' => 'required|string',

            'tags' => 'nullable|array',
            'tags.*' => 'required|string|max:50',

            'agenda' => 'nullable|array',
            'agenda.*.title' => 'required|string|max:255',
            'agenda.*.description' => 'nullable|string',
            'agenda.*.start_time' => 'required|date_format:H:i',
            'agenda.*.end_time' => 'required|date_format:H:i|after:agenda.*.start_time',

            'images' => 'nullable|array',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',

            'speakers' => 'nullable|array',
            'speakers.*.name' => 'required|string|max:255',
            'speakers.*.title' => 'required|string|max:255',
            'speakers.*.bio' => 'nullable|string',
            'speakers.*.image_url' => 'nullable|string',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Please enter an event title.',
            'description.required' => 'Please provide a description for your event.',
            'date.required' => 'Please select an event date.',
            'date.after_or_equal' => 'Event date must be today or in the future.',
            'start_time.required' => 'Please specify a start time.',
            'end_time.required' => 'Please specify an end time.',
            'end_time.after' => 'End time must be after start time.',
            'category.required' => 'Please select a category.',
            'category.exists' => 'The selected category is invalid.',
            'online_link.required_if' => 'Please provide a meeting link for online events.',
            'online_link.url' => 'Please enter a valid URL for the meeting link.',
            'location_address.required_if' => 'Please provide a venue address for in-person events.',
            'city.required_if' => 'Please specify the city for in-person events.',
            'state.required_if' => 'Please specify the state for in-person events.',
            'capacity.min' => 'Capacity must be at least 1.',
            'images.*.image' => 'The file must be an image.',
            'images.*.mimes' => 'Images must be jpeg, png, jpg, or gif format.',
            'images.*.max' => 'Images must not exceed 2MB.',
            'ticket_types.*.name.required' => 'Ticket name is required.',
            'ticket_types.*.price.required' => 'Ticket price is required.',
            'ticket_types.*.price.min' => 'Ticket price cannot be negative.',
            'speakers.*.name.required' => 'Speaker name is required.',
            'speakers.*.title.required' => 'Speaker title/role is required.',
            'agenda.*.title.required' => 'Agenda item title is required.',
            'agenda.*.start_time.required' => 'Agenda start time is required.',
            'agenda.*.end_time.required' => 'Agenda end time is required.',
            'agenda.*.end_time.after' => 'Agenda end time must be after start time.',
            'faqs.*.question.required' => 'FAQ question is required.',
            'faqs.*.answer.required' => 'FAQ answer is required.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        // Combine date and time fields into datetime strings
        if ($this->has('date') && $this->has('start_time')) {
            $this->merge([
                'start_date' => $this->date . ' ' . $this->start_time,
            ]);
        }

        if ($this->has('date') && $this->has('end_time')) {
            $this->merge([
                'end_date' => $this->date . ' ' . $this->end_time,
            ]);
        }

        // Map category to category_id
        if ($this->has('category')) {
            $this->merge([
                'category_id' => $this->category,
            ]);
        }
    }
}


//   title: string,
//   description: string,
//   category: string,
//   date: string,
//   start_time: string,
//   end_time: string,
//   is_online: false,
//   online_link: string,
//   location_name: string,
//   location_address: string,
//   location_lat: null ,
//   location_lng: null,
//   is_free: true,
//   capacity: string,
//   ticket_types: Array<TicketType>,
//   speakers: Array<Speaker>,
//   agenda: Array<Agenda>,
//   tags: string[],
//   faqs: Array<Faq>,
//   images: File[],
//   status: string,
//   city: string,
//   state: string
