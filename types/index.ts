export interface City {
  name: string;
  state: string;
  status: 'launching' | 'coming-soon';
  launchDate: string;
  vehicleCount: string;
  features: string[];
  description: string;
  image: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  city: string;
  status: 'invite-only' | 'coming-soon';
  description: string;
  format?: string;
  image: string;
}

export interface Feature {
  title: string;
  description: string;
  icon?: string;
}

export interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  current_city: string;
  city_of_interest: string;
  brief_intro: string;
  invite_code: string | null;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_at: string | null;
  notes: string | null;
}
