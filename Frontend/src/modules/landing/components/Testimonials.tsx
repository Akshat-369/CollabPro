import React from 'react';
import { Star } from 'lucide-react';
import { Testimonial } from '../../../../Data/types';
import { IMAGES } from '../../../../Data/images';

const testimonials: Testimonial[] = [
  { id: '1', name: 'Shivam Patel', role: 'Freelancer', avatarUrl: IMAGES.testimonials.user1, rating: 5, text: "This job portal made job search easy and quick. Recommended to all job seekers!" },
  { id: '2', name: 'Abhishek Kullu', role: 'Developer', avatarUrl: IMAGES.testimonials.user2, rating: 5, text: "Found my dream job within a week! The application process was smooth." },
  { id: '3', name: 'Swapnil Pandey', role: 'Designer', avatarUrl: IMAGES.testimonials.user3, rating: 4, text: "I secured a job offer within days of applying. Exceptional user experience and support." },
  { id: '4', name: 'Pavan Barnana', role: 'Manager', avatarUrl: IMAGES.testimonials.user4, rating: 4, text: "Highly efficient job portal with excellent resources. Helped me land a great position." },
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-mine-shaft-950 border-t border-mine-shaft-900 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-mine-shaft-50">
            What <span className="text-bright-sun-400">Users</span> says about us?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((item) => (
            <div key={item.id} className="bg-mine-shaft-900 border border-bright-sun-900/30 p-6 rounded-xl hover:bg-mine-shaft-800 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <img src={item.avatarUrl} alt={item.name} className="w-12 h-12 rounded-full border-2 border-bright-sun-500 object-cover" />
                <div>
                  <h4 className="text-mine-shaft-50 font-bold text-sm">{item.name}</h4>
                  <div className="flex gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < item.rating ? "fill-bright-sun-500 text-bright-sun-500" : "fill-mine-shaft-600 text-mine-shaft-600"} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs text-mine-shaft-300 leading-relaxed">"{item.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;