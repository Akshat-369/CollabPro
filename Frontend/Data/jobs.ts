

export interface Job {
  id: string;
  title: string;
  applicants: number;
  membersCount?: number;
  incompleteTasksCount?: number;
  tags: string[];
  description: string;
  longDescription: string;
  requirements: string[];
  price: string;
  postedAgo: string;
  location: string;
  experience: string;
  projectType: string;
  company: string;
  companyLogo?: string;
  postedByMe?: boolean;
  status?: 'Active' | 'Draft' | 'Closed';
}

export const JOBS: Job[] = [
  {
    id: '1',
    title: 'E-commerce Website Redesign',
    applicants: 25,
    tags: ['Entry Level', 'Full-Stack', 'New York'],
    description: 'Meta is seeking a Product Designer to join our team. You\'ll be working on designing user-centric interfaces for our...',
    longDescription: 'We are looking for a talented Full-Stack Developer to lead the redesign of our e-commerce platform. The ideal candidate will have a strong eye for design and the technical skills to bring it to life. You will be responsible for rebuilding the front-end using React and Tailwind CSS, while ensuring a robust back-end integration.\n\nThis project involves creating a seamless shopping experience, optimizing page load times, and implementing a new payment gateway. You will collaborate closely with our design and marketing teams to ensure the new site aligns with our brand identity.',
    requirements: [
      'Proficiency in React.js, Node.js, and Tailwind CSS',
      'Experience with e-commerce platforms (Shopify, WooCommerce, or custom)',
      'Strong understanding of UI/UX principles',
      'Ability to write clean, maintainable code',
      'Experience with payment gateway integration (Stripe, PayPal)',
      'Good communication skills and ability to work independently'
    ],
    price: '₹32,000',
    postedAgo: '12 days ago',
    location: 'New York',
    experience: 'Entry Level',
    projectType: 'Full-Stack',
    company: 'Meta',
    postedByMe: true,
    status: 'Active'
  },
  {
    id: '2',
    title: 'Online Exam Portal Development',
    applicants: 20,
    tags: ['Entry Level', 'Frontend', 'New York'],
    description: 'Looking for a Frontend Developer to build a responsive online exam portal for educational institutions...',
    longDescription: 'We are an EdTech startup looking for a skilled Frontend Developer to build a secure and intuitive online exam portal. The portal will allow students to take exams remotely, with features like timer controls, question navigation, and real-time result submission.\n\nThe interface needs to be distraction-free and highly responsive across all devices. Accessibility is a key priority for this project.',
    requirements: [
      'Strong proficiency in React.js and TypeScript',
      'Experience with state management (Redux or Context API)',
      'Knowledge of web security best practices',
      'Experience building responsive web applications',
      'Familiarity with RESTful APIs',
      'Attention to detail'
    ],
    price: '₹40,000',
    postedAgo: '5 days ago',
    location: 'New York',
    experience: 'Entry Level',
    projectType: 'Frontend',
    company: 'EduTech Solutions',
    status: 'Active'
  },
  {
    id: '3',
    title: 'Healthcare Management System',
    applicants: 10,
    tags: ['Entry Level', 'Backend', 'New York'],
    description: 'Healthcare provider needs a secure backend system for patient management and appointment scheduling...',
    longDescription: 'Our clinic requires a robust backend system to manage patient records, doctor schedules, and appointment bookings. Security and data privacy (HIPAA compliance) are paramount.\n\nYou will be designing the database schema, creating API endpoints, and implementing authentication and authorization protocols. Integration with existing frontend systems will be required.',
    requirements: [
      'Strong knowledge of Node.js and Express',
      'Experience with database design (PostgreSQL or MongoDB)',
      'Understanding of data security and encryption',
      'Experience with API development and documentation',
      'Knowledge of healthcare data standards is a plus',
      'Problem-solving skills'
    ],
    price: '₹50,000',
    postedAgo: '2 hours ago',
    location: 'New York',
    experience: 'Entry Level',
    projectType: 'Backend',
    company: 'HealthPlus',
    status: 'Closed'
  },
  {
    id: '4',
    title: 'Mobile App for Food Delivery',
    applicants: 5,
    tags: ['Expert', 'Mobile App', 'Remote'],
    description: 'Need an expert Flutter developer to build a cross-platform food delivery application with real-time tracking.',
    longDescription: 'We are launching a new food delivery service and need a high-performance mobile app. The app must support real-time GPS tracking, push notifications, and secure payment processing.\n\nYou should have experience publishing apps to both the App Store and Google Play Store.',
    requirements: [
      'Expertise in Flutter/Dart',
      'Experience with Google Maps API',
      'Knowledge of Firebase for notifications and auth',
      'State management (Provider, Riverpod, or Bloc)',
      'Experience with payment gateways'
    ],
    price: '₹85,000',
    postedAgo: '1 hour ago',
    location: 'Remote',
    experience: 'Expert',
    projectType: 'Mobile App',
    company: 'FastFoodie',
    postedByMe: true,
    status: 'Draft'
  },
  {
    id: '5',
    title: 'Personal Portfolio Website',
    applicants: 0,
    tags: ['Intermediate', 'Web Design', 'Remote'],
    description: 'Need a creative portfolio website to showcase my design work.',
    longDescription: 'Simple yet elegant portfolio website.',
    requirements: ['HTML/CSS', 'JavaScript'],
    price: '₹15,000',
    postedAgo: '1 month ago',
    location: 'Remote',
    experience: 'Intermediate',
    projectType: 'Frontend',
    company: 'Personal',
    postedByMe: true,
    status: 'Closed'
  }
];
