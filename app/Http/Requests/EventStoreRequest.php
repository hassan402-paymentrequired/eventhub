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
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'location' => 'nullable|string|max:255',
            'category_id' => 'required|exists:event_categories,id',
            'location_name' => 'nullable|string|max:255',
            'location_address' => 'nullable|string|max:255',
            'location_lat' => 'nullable|numeric',
            'location_lng' => 'nullable|numeric',
            'is_online' => 'required|boolean',
            'online_link' => 'nullable|url',
            'is_free' => 'required|boolean',
            'capacity' => 'nullable|integer|min:1',
            'state' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'status' => 'required|string|in:draft,published,archived',

            'ticket_types' => 'nullable|array',
            'ticket_types.*.name' => 'required|string|max:255',
            'ticket_types.*.price' => 'required|numeric|min:0',
            'ticket_types.*.quantity' => 'required|integer|min:1',
            
            'faqs' => 'nullable|array',
            'faqs.*.question' => 'required|string',
            'faqs.*.answer' => 'required|string',

            'tags' => 'nullable|array',
            'tags.*' => 'required|string|max:50',

            'agenda' => 'nullable|array',
            'agenda.*.title' => 'required|string|max:255',
            'agenda.*.description' => 'nullable|string',
            'agenda.*.start_time' => 'required|date_format:H:i',
            'agenda.*.end_time' => 'required|date_format:H:i|after:start_time',

            'images' => 'nullable|array',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',

            'speakers' => 'nullable|array',
            'speakers.*.name' => 'required|string|max:255',
            'speakers.*.title' => 'required|string|max:255',
            'speakers.*.bio' => 'nullable|string',
            'speakers.*.image_url' => 'nullable|string',

            
        ];
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