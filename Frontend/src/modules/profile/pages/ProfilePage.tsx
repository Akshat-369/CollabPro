import React from 'react';
import Footer from '../../layout/Footer';
import ProfileHeader from '../components/ProfileHeader';
import ProfileAbout from '../components/ProfileAbout';
import ProfileSkills from '../components/ProfileSkills';
import ProfileExperience from '../components/ProfileExperience';
import ProfileCertifications from '../components/ProfileCertifications';
import { useUser } from '../../../../context/UserContext';

const ProfilePage: React.FC = () => {
  const { userProfile, updateUserProfile } = useUser();

  return (
    <div className="min-h-screen bg-mine-shaft-950 font-sans text-mine-shaft-50 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-20 py-8">
        
        <ProfileHeader 
            name={userProfile.name}
            email={userProfile.email}
            phone={userProfile.phone}
            coverImage={userProfile.coverImage}
            profileImage={userProfile.profileImage}
            onSave={(data) => updateUserProfile(data)}
        />

        <div className="border-t border-mine-shaft-800 my-8"></div>

        <ProfileAbout 
            about={userProfile.about} 
            onSave={(text) => updateUserProfile({ about: text })}
        />

        <ProfileSkills 
            skills={userProfile.skills} 
            onSave={(skills) => updateUserProfile({ skills })}
        />

        <ProfileExperience 
            experiences={userProfile.experiences} 
            onUpdate={(experiences) => updateUserProfile({ experiences })}
        />

        <ProfileCertifications 
            certifications={userProfile.certifications} 
            onUpdate={(certifications) => updateUserProfile({ certifications })}
        />

      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
