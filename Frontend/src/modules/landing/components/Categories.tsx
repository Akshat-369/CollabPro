import React, { useRef } from 'react';
import { Code, PenTool, Cpu, Megaphone, FileText, Headphones, BadgeDollarSign, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Category } from '../../../../Data/types';

const categories: Category[] = [
  { 
    id: '1', 
    title: 'Development & IT', 
    description: 'Software, Web, Mobile & Game Development', 
    projectCount: '12k+ projects', 
    icon: Code 
  },
  { 
    id: '2', 
    title: 'Design & Creative', 
    description: 'UI/UX, Graphics, Video & Animation', 
    projectCount: '8k+ projects', 
    icon: PenTool 
  },
  { 
    id: '3', 
    title: 'AI & Data Science', 
    description: 'Machine Learning, AI Integration & Analytics', 
    projectCount: '3k+ projects', 
    icon: Cpu 
  },
  { 
    id: '4', 
    title: 'Sales & Marketing', 
    description: 'Digital Marketing, SEO, SEM & Strategy', 
    projectCount: '5k+ projects', 
    icon: Megaphone 
  },
  { 
    id: '5', 
    title: 'Writing & Translation', 
    description: 'Articles, Scripts, Translations & Proofreading', 
    projectCount: '4k+ projects', 
    icon: FileText 
  },
  { 
    id: '6', 
    title: 'Admin & Support', 
    description: 'Virtual Assistants, Data Entry & Support', 
    projectCount: '2.5k+ projects', 
    icon: Headphones 
  },
  { 
    id: '7', 
    title: 'Finance & Accounting', 
    description: 'Accounting, Bookkeeping & Financial Planning', 
    projectCount: '1.5k+ projects', 
    icon: BadgeDollarSign 
  },
  { 
    id: '8', 
    title: 'Engineering', 
    description: 'CAD, 3D Modeling & Architecture', 
    projectCount: '1k+ projects', 
    icon: Building2 
  },
];

const Categories: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 320;
      current.scrollBy({ left: direction === 'right' ? scrollAmount : -scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-mine-shaft-950 group/section transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-mine-shaft-50 mb-4">
            Explore Top <span className="text-bright-sun-400">Categories</span>
          </h2>
          <p className="text-mine-shaft-300">
            Find the perfect professionals or projects across our most popular specialized domains.
          </p>
        </div>

        <div className="relative">
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-mine-shaft-800 border border-mine-shaft-600 text-mine-shaft-50 rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover/section:opacity-100 transition-all duration-300 hover:bg-bright-sun-400 hover:text-black hover:scale-110 disabled:opacity-0"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>

          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto py-8 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category) => (
              <div 
                key={category.id} 
                className="min-w-[280px] md:min-w-[320px] snap-center group relative bg-mine-shaft-900 border border-mine-shaft-700 rounded-2xl p-6 hover:border-bright-sun-500 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center select-none"
              >
                <div className="w-14 h-14 rounded-full bg-mine-shaft-800 flex items-center justify-center mb-4 group-hover:bg-bright-sun-500 group-hover:text-black transition-colors text-bright-sun-400 border border-mine-shaft-700 group-hover:border-transparent">
                  <category.icon size={28} />
                </div>
                <h3 className="text-lg font-bold text-mine-shaft-50 mb-2">{category.title}</h3>
                <p className="text-sm text-mine-shaft-400 mb-6 flex-grow">{category.description}</p>
                <span className="text-bright-sun-400 text-sm font-medium bg-bright-sun-400/10 px-3 py-1 rounded-full border border-bright-sun-400/20">{category.projectCount}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-mine-shaft-800 border border-mine-shaft-600 text-mine-shaft-50 rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover/section:opacity-100 transition-all duration-300 hover:bg-bright-sun-400 hover:text-black hover:scale-110 disabled:opacity-0"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Categories;