import React, { useState } from 'react';
import { Briefcase, MapPin } from 'lucide-react';
import { getCompanyLogo } from '../../../../shared/utils/companyUtils';
import { Experience } from '../../../../Data/types';

interface ExperienceFormProps {
    initialData?: Experience;
    onSave: (data: Experience) => void;
    onCancel: () => void;
}

const monthsMap: { [key: string]: string } = {
  'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
  'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12',
  'January': '01', 'February': '02', 'March': '03', 'April': '04', 'June': '06',
  'July': '07', 'August': '08', 'September': '09', 'October': '10', 'November': '11', 'December': '12'
};

const reverseMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const parseDateToMonthValue = (dateStr: string | undefined) => {
    if (!dateStr || dateStr.toLowerCase() === 'present') return '';
    const parts = dateStr.trim().split(' ');
    if (parts.length < 2) return '';
    const monthStr = parts[0];
    const cleanMonth = monthStr.replace(',', '');
    const yearStr = parts[1];
    const month = monthsMap[cleanMonth] || '01';
    return `${yearStr}-${month}`;
};

const formatMonthValueToDate = (value: string) => {
    if (!value) return '';
    const [year, month] = value.split('-');
    const mIndex = parseInt(month, 10) - 1;
    if (mIndex >= 0 && mIndex < 12) {
        return `${reverseMonths[mIndex]} ${year}`;
    }
    return value;
};

const ExperienceForm: React.FC<ExperienceFormProps> = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        role: initialData?.role || '',
        company: initialData?.company || '',
        location: initialData?.location || '',
        description: initialData?.description || '',
        startDate: parseDateToMonthValue(initialData?.date?.split(' - ')[0]),
        endDate: parseDateToMonthValue(initialData?.date?.split(' - ')[1]),
        currentlyWorking: initialData?.date?.includes('Present') || false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const start = formatMonthValueToDate(formData.startDate);
        const end = formData.currentlyWorking ? 'Present' : formatMonthValueToDate(formData.endDate);
        const dateStr = `${start} - ${end}`;
        
        // Fetch logo based on company name
        const logoUrl = getCompanyLogo(formData.company);

        onSave({
            role: formData.role,
            company: formData.company,
            location: formData.location,
            description: formData.description,
            date: dateStr,
            logo: logoUrl // Will be empty string if company is unknown
        });
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6 mb-6">
            <h3 className="text-xl font-bold text-mine-shaft-200 mb-6">Edit Experience</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-mine-shaft-200">Job Title <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-2 bg-mine-shaft-900 border border-mine-shaft-700 rounded-xl px-4 py-3 focus-within:border-bright-sun-400 transition-colors">
                        <Briefcase size={18} className="text-mine-shaft-400" />
                        <input 
                            type="text" 
                            name="role"
                            value={formData.role} 
                            onChange={handleChange}
                            placeholder="Software Engineer"
                            className="bg-transparent border-none outline-none text-mine-shaft-50 w-full placeholder-mine-shaft-500"
                            required
                        />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-medium text-mine-shaft-200">Company <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-2 bg-mine-shaft-900 border border-mine-shaft-700 rounded-xl px-4 py-3 focus-within:border-bright-sun-400 transition-colors">
                        <Briefcase size={18} className="text-mine-shaft-400" />
                        <input 
                            type="text" 
                            name="company"
                            value={formData.company} 
                            onChange={handleChange}
                            placeholder="Microsoft"
                            className="bg-transparent border-none outline-none text-mine-shaft-50 w-full placeholder-mine-shaft-500"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2 mb-6">
                <label className="text-sm font-medium text-mine-shaft-200">Location <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-2 bg-mine-shaft-900 border border-mine-shaft-700 rounded-xl px-4 py-3 focus-within:border-bright-sun-400 transition-colors">
                    <MapPin size={18} className="text-mine-shaft-400" />
                    <input 
                        type="text" 
                        name="location"
                        value={formData.location} 
                        onChange={handleChange}
                        placeholder="Seattle, United States"
                        className="bg-transparent border-none outline-none text-mine-shaft-50 w-full placeholder-mine-shaft-500"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2 mb-6">
                <label className="text-sm font-medium text-mine-shaft-200">Summary <span className="text-red-500">*</span></label>
                <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter Summary..."
                    rows={4}
                    className="w-full bg-mine-shaft-900 border border-mine-shaft-700 rounded-xl p-4 text-mine-shaft-50 outline-none focus:border-bright-sun-400 transition-colors resize-none placeholder-mine-shaft-500"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-mine-shaft-200">Start date <span className="text-red-500">*</span></label>
                    <input 
                        type="month" 
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="w-full bg-mine-shaft-900 border border-mine-shaft-700 rounded-xl px-4 py-3 text-mine-shaft-50 outline-none focus:border-bright-sun-400 transition-colors placeholder-mine-shaft-500 [color-scheme:dark]"
                        required
                    />
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-medium text-mine-shaft-200">End date <span className="text-red-500">*</span></label>
                    <input 
                        type="month" 
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        disabled={formData.currentlyWorking}
                        className="w-full bg-mine-shaft-900 border border-mine-shaft-700 rounded-xl px-4 py-3 text-mine-shaft-50 outline-none focus:border-bright-sun-400 transition-colors placeholder-mine-shaft-500 disabled:opacity-50 disabled:cursor-not-allowed [color-scheme:dark]"
                        required={!formData.currentlyWorking}
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 mb-8">
                 <div 
                    onClick={() => setFormData({...formData, currentlyWorking: !formData.currentlyWorking})}
                    className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${formData.currentlyWorking ? 'bg-bright-sun-400 border-bright-sun-400' : 'border-mine-shaft-600 bg-transparent'}`}
                 >
                    {formData.currentlyWorking && <div className="w-2.5 h-2.5 rounded-sm bg-black"></div>}
                 </div>
                 <label className="text-sm text-mine-shaft-300 cursor-pointer select-none" onClick={() => setFormData({...formData, currentlyWorking: !formData.currentlyWorking})}>Currently work here</label>
            </div>

            <div className="flex gap-4">
                <button 
                    type="submit"
                    className="px-8 py-2.5 rounded-lg bg-mine-shaft-800 text-green-500 font-bold hover:bg-green-500/10 transition-colors border border-transparent hover:border-green-500/20"
                >
                    Save
                </button>
                <button 
                    type="button" 
                    onClick={onCancel}
                    className="px-8 py-2.5 rounded-lg bg-mine-shaft-800 text-red-500 font-bold hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default ExperienceForm;
