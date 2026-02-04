import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  projectCount: string;
  icon: LucideIcon;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  rating: number;
  text: string;
}

export interface Step {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: string;
  type: 'Fixed' | 'Hourly';
  postedTime: string;
  skills: string[];
  proposals: number;
  client: {
    name: string;
    rating: number;
    location: string;
    verified: boolean;
  };
  applicants: number;
  membersCount: number;
  incompleteTasksCount: number;
  postedByMe: boolean;
  postedAgo: string;
}

export interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'pdf' | 'zip' | 'file';
  url: string;
  uploadedBy?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  amount: string;
  status: string;
  date: string;
  assignedTo?: string;
  attachments?: Attachment[];
  comments?: Comment[];
  paymentStatus?: 'Pending' | 'Paid' | 'Done' | 'Received';
}

export interface Experience {
  role: string;
  company: string;
  location: string;
  date: string;
  description: string;
  logo: string;
}

export interface Certification {
  name: string;
  issuer: string;
  issueDate: string;
  id: string;
  logo: string;
}

export interface Candidate {
  id: number;
  userId?: number;
  name: string;
  role: string;
  company: string;
  match: string;
  rate: string;
  status: 'applicants' | 'invited' | 'offered' | 'hired' | 'rejected';
  imageIndex: number;
  profileImage?: string;
  skills: string[];
  description: string;
  experience: string;
  location: string;
  email?: string;
  phone?: string;
  resume?: string;
  resumeUrl?: string;
  joinedDate?: string;
  interview?: {
    date: string;
    time: string;
  };
  // Extended Profile Fields
  about?: string;
  experiences?: Experience[];
  certifications?: Certification[];
  coverImage?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  coverImage: string;
  profileImage: string;
  about: string;
  skills: string[];
  experiences: Experience[];
  certifications: Certification[];
}