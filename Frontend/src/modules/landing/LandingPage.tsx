import React from 'react';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import Hero from './components/Hero';
import TrustedBy from './components/TrustedBy';
import Categories from './components/Categories';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';

interface LandingProps {
  isLoggedIn: boolean;
}

const LandingPage: React.FC<LandingProps> = ({ isLoggedIn }) => {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} />
      <Hero />
      <TrustedBy />
      <Categories />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </main>
  );
};

export default LandingPage;