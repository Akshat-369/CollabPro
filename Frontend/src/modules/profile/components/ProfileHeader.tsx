import React, { useState, useRef } from 'react';
import { Pencil, Check, X, Mail, Phone, User, Camera } from 'lucide-react';
import { useUser } from '../../../../context/UserContext';
import ProfileService from '../service/profile.service';

interface ProfileHeaderProps {
    name: string;
    email: string;
    phone: string;
    coverImage: string;
    profileImage: string;
    onSave: (data: { name: string; email: string; phone: string }) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, email, phone, coverImage, profileImage, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name, email, phone });
    const { updateUserProfile } = useUser();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState(profileImage);

    // Sync preview with prop updates
    React.useEffect(() => {
        setPreviewImage(profileImage);
    }, [profileImage]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        onSave(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({ name, email, phone });
        setIsEditing(false);
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 1. "Immediately preview image using URL.createObjectURL"
        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);

        try {
            // 2. "Upload image using FormData ... Call /api/profile/me/image"
            const permanentUrl = await ProfileService.uploadProfileImage(file);
            
            // 3. "On success: Update profile image everywhere"
            updateUserProfile({ profileImage: permanentUrl });
            
            // 4. Update local preview to match server URL (optional, but good for consistency)
            setPreviewImage(permanentUrl);
        } catch (error) {
            console.error("Failed to upload image", error);
            // "On error: Show popup"
            alert("Failed to upload image");
            // "Do NOT clear selected image" -> previewImage stays (user sees what they tried to upload)
        }
    };

    return (
        <div className="w-full mb-8">
            {/* Banner Section */}
            <div className="relative w-full h-48 md:h-72 rounded-t-3xl md:rounded-3xl overflow-visible mb-6">
                <div className="w-full h-full rounded-t-3xl md:rounded-3xl overflow-hidden shadow-lg relative">
                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-mine-shaft-950/60 to-transparent"></div>
                </div>
                
                {/* Profile Image */}
                <div className="absolute -bottom-16 left-6 md:left-10 z-10">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="image/*"
                    />
                    <div 
                        className="p-1.5 bg-mine-shaft-950 rounded-full cursor-pointer relative group"
                        onClick={handleImageClick}
                        title="Change Profile Photo"
                    >
                        {previewImage ? (
                            <img 
                                src={previewImage} 
                                alt="Profile" 
                                className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-[6px] border-mine-shaft-950 group-hover:opacity-80 transition-opacity" 
                            />
                        ) : (
                            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-[6px] border-mine-shaft-950 bg-mine-shaft-900 group-hover:opacity-80 transition-opacity"></div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                             <Camera className="text-white w-8 h-8 md:w-12 md:h-12 drop-shadow-lg" />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Profile Info Section */}
            <div className="px-2 md:px-4 mt-20 md:mt-24">
                <div className="flex justify-between items-start">
                    <div className="w-full">
                        <div className="flex justify-between items-center mb-2">
                             {!isEditing && <h1 className="text-3xl md:text-4xl font-bold text-mine-shaft-50">{name}</h1>}
                             {isEditing && (
                                <div className="flex-1 mr-4">
                                     <label className="text-sm text-mine-shaft-300 font-medium mb-1 block">Full Name <span className="text-red-500">*</span></label>
                                     <div className="flex items-center gap-2 bg-mine-shaft-900 border border-mine-shaft-700 rounded-lg px-3 py-2 max-w-md">
                                        <User size={18} className="text-mine-shaft-400" />
                                        <input 
                                            type="text" 
                                            name="name" 
                                            value={formData.name} 
                                            onChange={handleChange} 
                                            className="bg-transparent border-none outline-none text-mine-shaft-50 w-full"
                                        />
                                    </div>
                                </div>
                             )}
                             
                             <div className="flex gap-2">
                                {isEditing ? (
                                    <>
                                        <button onClick={handleSave} className="p-2 text-green-500 hover:bg-mine-shaft-900 rounded-full transition-colors"><Check size={24}/></button>
                                        <button onClick={handleCancel} className="p-2 text-red-500 hover:bg-mine-shaft-900 rounded-full transition-colors"><X size={24}/></button>
                                    </>
                                ) : (
                                    <button onClick={() => setIsEditing(true)} className="p-2 text-bright-sun-400 hover:bg-mine-shaft-900 rounded-full transition-colors">
                                        <Pencil size={20} />
                                    </button>
                                )}
                             </div>
                        </div>

                        {isEditing ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="space-y-1">
                                    <label className="text-sm text-mine-shaft-300 font-medium">Email <span className="text-red-500">*</span></label>
                                    <div className="flex items-center gap-2 bg-mine-shaft-900 border border-mine-shaft-700 rounded-lg px-3 py-2">
                                        <Mail size={18} className="text-mine-shaft-400" />
                                        <input 
                                            type="email" 
                                            name="email" 
                                            value={formData.email} 
                                            onChange={handleChange} 
                                            className="bg-transparent border-none outline-none text-mine-shaft-50 w-full"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-mine-shaft-300 font-medium">Phone <span className="text-red-500">*</span></label>
                                    <div className="flex items-center gap-2 bg-mine-shaft-900 border border-mine-shaft-700 rounded-lg px-3 py-2">
                                        <Phone size={18} className="text-mine-shaft-400" />
                                        <input 
                                            type="text" 
                                            name="phone" 
                                            value={formData.phone} 
                                            onChange={handleChange} 
                                            className="bg-transparent border-none outline-none text-mine-shaft-50 w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 mt-2">
                                <div className="flex items-center gap-2 text-mine-shaft-200 text-base md:text-lg font-medium">
                                    <Mail size={18} className="text-bright-sun-400"/>
                                    <span>{email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-mine-shaft-300 text-sm md:text-base">
                                    <Phone size={18} className="text-bright-sun-400" />
                                    <span>{phone}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;