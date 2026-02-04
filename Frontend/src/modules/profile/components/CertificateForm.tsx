import React, { useState } from 'react';
import { FileText, Building2, Calendar, Hash } from 'lucide-react';
import { getCompanyLogo } from '../../../../shared/utils/companyUtils';
import { Certification } from '../../../../Data/types';

interface CertificateFormProps {
    initialData?: Certification;
    onSave: (data: Certification) => void;
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
    if (!dateStr) return '';
    // Remove "Issued " prefix if present
    const cleanDate = dateStr.replace('Issued ', '').trim();
    const parts = cleanDate.split(' ');
    if (parts.length < 2) return '';
    const monthStr = parts[0];
    const yearStr = parts[1];
    const month = monthsMap[monthStr] || '01';
    return `${yearStr}-${month}`;
};

const formatMonthValueToDate = (value: string) => {
    if (!value) return '';
    const [year, month] = value.split('-');
    const mIndex = parseInt(month, 10) - 1;
    if (mIndex >= 0 && mIndex < 12) {
        return `Issued ${reverseMonths[mIndex]} ${year}`;
    }
    return value;
};

const CertificateForm: React.FC<CertificateFormProps> = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        issuer: initialData?.issuer || '',
        issueDate: parseDateToMonthValue(initialData?.issueDate),
        id: initialData?.id?.replace('ID: ', '') || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Fetch logo based on issuer/company name
        const logoUrl = getCompanyLogo(formData.issuer);

        onSave({
            name: formData.name,
            issuer: formData.issuer,
            issueDate: formatMonthValueToDate(formData.issueDate),
            id: formData.id ? `ID: ${formData.id}` : '',
            logo: logoUrl // Will be empty if unknown
        });
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6 mb-6">
            <h3 className="text-xl font-bold text-mine-shaft-200 mb-6">{initialData ? 'Edit Certificate' : 'Add Certificate'}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-mine-shaft-200">Title <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-2 bg-mine-shaft-900 border border-mine-shaft-700 rounded-xl px-4 py-3 focus-within:border-bright-sun-400 transition-colors">
                        <FileText size={18} className="text-mine-shaft-400" />
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name} 
                            onChange={handleChange}
                            placeholder="Enter Title"
                            className="bg-transparent border-none outline-none text-mine-shaft-50 w-full placeholder-mine-shaft-500"
                            required
                        />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-medium text-mine-shaft-200">Company <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-2 bg-mine-shaft-900 border border-mine-shaft-700 rounded-xl px-4 py-3 focus-within:border-bright-sun-400 transition-colors">
                        <Building2 size={18} className="text-mine-shaft-400" />
                        <input 
                            type="text" 
                            name="issuer"
                            value={formData.issuer} 
                            onChange={handleChange}
                            placeholder="Enter Company Name"
                            className="bg-transparent border-none outline-none text-mine-shaft-50 w-full placeholder-mine-shaft-500"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-mine-shaft-200">Issue date <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-2 bg-mine-shaft-900 border border-mine-shaft-700 rounded-xl px-4 py-3 focus-within:border-bright-sun-400 transition-colors">
                        <Calendar size={18} className="text-mine-shaft-400" />
                        <input 
                            type="month" 
                            name="issueDate"
                            value={formData.issueDate}
                            onChange={handleChange}
                            className="bg-transparent border-none outline-none text-mine-shaft-50 w-full placeholder-mine-shaft-500 [color-scheme:dark]"
                            required
                        />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-medium text-mine-shaft-200">Certificate ID <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-2 bg-mine-shaft-900 border border-mine-shaft-700 rounded-xl px-4 py-3 focus-within:border-bright-sun-400 transition-colors">
                        <Hash size={18} className="text-mine-shaft-400" />
                        <input 
                            type="text" 
                            name="id"
                            value={formData.id} 
                            onChange={handleChange}
                            placeholder="Enter ID"
                            className="bg-transparent border-none outline-none text-mine-shaft-50 w-full placeholder-mine-shaft-500"
                            required
                        />
                    </div>
                </div>
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

export default CertificateForm;
