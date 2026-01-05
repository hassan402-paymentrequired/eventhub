
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
  price: number | "Free";
  attendees: number;
  featured?: boolean;
  speakers: Speaker[],
  tickets: TicketType[],
  agendas: Agenda[],
  faqs: Faq[],
  images: Array<{ url: string, id: string }>,
  category: Category[] | Category,
  state: string,
  city: string
  is_free?: boolean
  is_online?: boolean
  online_url?: string
  venue_name?: string
  name?: string
  user?: {
    name: string
  }
}

export interface Category {
  id: string,
  name: string,
  slug?: string
}

export interface TicketType { name: string, price: number, capacity: string, description: string }

export interface Speaker { name: string, title: string, bio: string, image_url: string }

export interface Faq { id?: string, question: string, answer: string }

export interface Agenda { start_time: string, end_time: string, title: string, description: string }

export interface EventFormData {
  title: string,
  description: string,
  category: string,
  date: string,
  start_time: string,
  end_time: string,
  is_online: false,
  online_link: string,
  location_name: string,
  location_address: string,
  location_lat: null,
  location_lng: null,
  is_free: true,
  capacity: string,
  ticket_types: Array<TicketType>,
  speakers: Array<Speaker>,
  agenda: Array<Agenda>,
  tags: string[],
  faqs: Array<Faq>,
  images: File[],
  status: string,
  city: string,
  state: string
}

