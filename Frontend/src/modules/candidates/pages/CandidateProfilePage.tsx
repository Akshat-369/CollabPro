import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../../../context/UserContext'; // Only for types if needed, or I'll just match structure
import Footer from '../../layout/Footer';
import Navbar from '../../layout/Navbar';
import ProfileHeader from '../../profile/components/ProfileHeader';
import ProfileAbout from '../../profile/components/ProfileAbout';
import ProfileSkills from '../../profile/components/ProfileSkills';
import ProfileExperience from '../../profile/components/ProfileExperience';
import ProfileCertifications from '../../profile/components/ProfileCertifications';
import { Button } from '../../../../shared/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { IMAGES } from '../../../../Data/images';

const CandidateProfilePage: React.FC = () => {
    const { applicantId } = useParams<{ applicantId: string }>();
    const navigate = useNavigate();

    const [profile, setProfile] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    const fetchProfile = async () => {
        try {
             // We can reuse AuthService/ProfileService but they are coupled with classes. 
             // Let's do raw fetch for simplicity or import if available. 
             // We'll use the existing API route directly.
             const token = localStorage.getItem('token');
             const response = await fetch(`http://localhost:8080/api/profile/${applicantId}`, {
                 headers: {
                     'Authorization': `Bearer ${token}`
                 }
             });
             
             if (response.ok) {
                 const data = await response.json();
                 setProfile(data);
             } else {
                 console.error("Failed to load profile");
             }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (applicantId) {
            fetchProfile();
        }
    }, [applicantId]);

    const handleNoOp = () => {
        console.log("Read-only profile: Save action ignored");
    };

    if (loading) {
        return <div className="min-h-screen bg-mine-shaft-950 flex items-center justify-center text-mine-shaft-400">Loading profile...</div>;
    }

    if (!profile) {
         return <div className="min-h-screen bg-mine-shaft-950 flex items-center justify-center text-mine-shaft-400">Profile not found</div>;
    }

    return (
        <div className="min-h-screen bg-mine-shaft-950 font-sans text-mine-shaft-50 transition-colors duration-300">
            {/* Reusing Navbar for consistency, though App handles it usually, but direct page usage sometimes needs wrapper. 
                However, looking at App.tsx, Navbar is rendered in the Route wrapper. 
                So I do NOT need to render Navbar here if I add it to App.tsx correctly.
            */}
            
            <div className="container mx-auto px-4 md:px-20 py-8">
                <Button 
                    variant="ghost" 
                    className="mb-6 flex items-center gap-2 text-mine-shaft-400 hover:text-bright-sun-400 pl-0"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={20} /> Back to Applicants
                </Button>

                <ProfileHeader 
                    name={profile.name}
                    email={profile.email}
                    phone={profile.phone}
                    coverImage={profile.coverImage}
                    profileImage={profile.profileImage}
                    onSave={handleNoOp} 
                />

                <div className="border-t border-mine-shaft-800 my-8"></div>

                <ProfileAbout 
                    about={profile.about} 
                    onSave={handleNoOp}
                />

                <ProfileSkills 
                    skills={profile.skills} 
                    onSave={handleNoOp}
                />

                <ProfileExperience 
                    experiences={profile.experiences} 
                    onUpdate={handleNoOp}
                />

                <ProfileCertifications 
                    certifications={profile.certifications} 
                    onUpdate={handleNoOp}
                />
            </div>
            <Footer />
        </div>
    );
};

export default CandidateProfilePage;
