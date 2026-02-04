/**
 * This utility simulates a backend service that fetches company logos.
 * In the future, replace the internal logic with an API call like:
 * return await api.get(`/companies/logo?name=${encodeURIComponent(companyName)}`);
 */

const COMPANY_LOGOS: Record<string, string> = {
    'google': 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
    'microsoft': 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    'meta': 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    'facebook': 'https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg',
    'netflix': 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    'amazon': 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg',
    'apple': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    'spotify': 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
    'airbnb': 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg',
    'uber': 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png',
    'linkedin': 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png',
    'twitter': 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg',
    'x': 'https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg',
    'adobe': 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png'
};

export const getCompanyLogo = (companyName: string): string => {
    if (!companyName) return '';
    
    const normalizedName = companyName.toLowerCase().trim();
    
    // Check for exact match or partial match in keys
    // In a real Spring Boot backend, this would be a database query
    const key = Object.keys(COMPANY_LOGOS).find(k => normalizedName.includes(k));
    
    return key ? COMPANY_LOGOS[key] : ''; // Return empty string for unknown companies
};