import { FarmLocationDetails } from '@/types';

export interface DistrictGeo {
  name: string;
  lat: number;
  lon: number;
}

export interface StateGeo {
  name: string;
  districts: DistrictGeo[];
}

export const INDIAN_STATES_AND_DISTRICTS: Record<string, DistrictGeo[]> = {
  'Punjab': [
    { name: 'Ludhiana', lat: 30.9010, lon: 75.8573 },
    { name: 'Amritsar', lat: 31.6340, lon: 74.8723 },
    { name: 'Bathinda', lat: 30.2110, lon: 74.9455 },
    { name: 'Patiala', lat: 30.3398, lon: 76.3869 },
    { name: 'Jalandhar', lat: 31.3260, lon: 75.5762 },
    { name: 'Gurdaspur', lat: 32.0419, lon: 75.4053 },
    { name: 'Firozpur', lat: 30.9237, lon: 74.6122 },
    { name: 'Hoshiarpur', lat: 31.5273, lon: 75.9149 },
    { name: 'Kapurthala', lat: 31.3802, lon: 75.3815 },
    { name: 'Mansa', lat: 29.9881, lon: 75.3934 },
    { name: 'Moga', lat: 30.8165, lon: 75.1717 },
    { name: 'Muktsar (Sri Muktsar Sahib)', lat: 30.4762, lon: 74.5162 },
    { name: 'Sangrur', lat: 30.2458, lon: 75.8421 },
    { name: 'Tarn Taran', lat: 31.4520, lon: 74.9270 },
    { name: 'Barnala', lat: 30.3752, lon: 75.5456 },
    { name: 'Fatehgarh Sahib', lat: 30.6431, lon: 76.3984 },
    { name: 'Fazilka', lat: 30.4037, lon: 74.0254 },
    { name: 'Pathankot', lat: 32.2689, lon: 75.6499 },
    { name: 'Rupnagar (Ropar)', lat: 30.9664, lon: 76.5331 },
    { name: 'SAS Nagar (Mohali)', lat: 30.7046, lon: 76.7179 },
    { name: 'SBS Nagar (Nawanshahr)', lat: 31.1256, lon: 76.1186 },
    { name: 'Malerkotla', lat: 30.5256, lon: 75.8900 },
  ],
  'Haryana': [
    { name: 'Karnal', lat: 29.6857, lon: 76.9905 },
    { name: 'Hisar', lat: 29.1492, lon: 75.7217 },
    { name: 'Ambala', lat: 30.3782, lon: 76.7767 },
    { name: 'Rohtak', lat: 28.8955, lon: 76.6066 },
    { name: 'Sirsa', lat: 29.5349, lon: 75.0289 },
    { name: 'Kurukshetra', lat: 29.9695, lon: 76.8783 },
    { name: 'Sonipat', lat: 28.9931, lon: 77.0151 },
    { name: 'Panipat', lat: 29.3909, lon: 76.9635 },
    { name: 'Fatehabad', lat: 29.5152, lon: 75.4554 },
    { name: 'Jind', lat: 29.3140, lon: 76.3142 },
    { name: 'Kaithal', lat: 29.8015, lon: 76.3997 },
    { name: 'Bhiwani', lat: 28.7932, lon: 76.1390 },
    { name: 'Yamunanagar', lat: 30.1290, lon: 77.2674 },
    { name: 'Rewari', lat: 28.1920, lon: 76.6191 },
    { name: 'Gurugram', lat: 28.4595, lon: 77.0266 },
    { name: 'Faridabad', lat: 28.4089, lon: 77.3178 },
  ],
  'Rajasthan': [
    { name: 'Sri Ganganagar', lat: 29.9038, lon: 73.8772 },
    { name: 'Hanumangarh', lat: 29.5819, lon: 74.3294 },
    { name: 'Jaipur', lat: 26.9124, lon: 75.7873 },
    { name: 'Jodhpur', lat: 26.2389, lon: 73.0243 },
    { name: 'Kota', lat: 25.2138, lon: 75.8648 },
    { name: 'Bikaner', lat: 28.0229, lon: 73.3119 },
    { name: 'Alwar', lat: 27.5530, lon: 76.6346 },
    { name: 'Bharatpur', lat: 27.2152, lon: 77.5030 },
    { name: 'Udaipur', lat: 24.5854, lon: 73.7125 },
    { name: 'Ajmer', lat: 26.4499, lon: 74.6399 },
    { name: 'Nagaur', lat: 27.2070, lon: 73.7423 },
    { name: 'Chittorgarh', lat: 24.8887, lon: 74.6269 },
    { name: 'Pali', lat: 25.7711, lon: 73.3234 },
    { name: 'Sikar', lat: 27.6094, lon: 75.1398 },
    { name: 'Barmer', lat: 25.7521, lon: 71.4181 },
    { name: 'Jhalawar', lat: 24.5973, lon: 76.1610 },
  ],
  'Uttar Pradesh': [
    { name: 'Meerut', lat: 28.9845, lon: 77.7064 },
    { name: 'Agra', lat: 27.1767, lon: 78.0081 },
    { name: 'Varanasi', lat: 25.3176, lon: 82.9739 },
    { name: 'Lucknow', lat: 26.8467, lon: 80.9462 },
    { name: 'Kanpur', lat: 26.4499, lon: 80.3319 },
    { name: 'Bareilly', lat: 28.3670, lon: 79.4304 },
    { name: 'Aligarh', lat: 27.8974, lon: 78.0880 },
    { name: 'Moradabad', lat: 28.8386, lon: 78.7733 },
    { name: 'Gorakhpur', lat: 26.7606, lon: 83.3732 },
    { name: 'Saharanpur', lat: 29.9640, lon: 77.5460 },
    { name: 'Muzaffarnagar', lat: 29.4727, lon: 77.7085 },
    { name: 'Mathura', lat: 27.4924, lon: 77.6737 },
    { name: 'Jhansi', lat: 25.4484, lon: 78.5685 },
    { name: 'Prayagraj (Allahabad)', lat: 25.4358, lon: 81.8463 },
    { name: 'Ayodhya (Faizabad)', lat: 26.7922, lon: 82.1998 },
    { name: 'Lakhimpur Kheri', lat: 27.9463, lon: 80.7788 },
  ],
  'Madhya Pradesh': [
    { name: 'Indore', lat: 22.7196, lon: 75.8577 },
    { name: 'Bhopal', lat: 23.2599, lon: 77.4126 },
    { name: 'Ujjain', lat: 23.1765, lon: 75.7885 },
    { name: 'Jabalpur', lat: 23.1815, lon: 79.9864 },
    { name: 'Gwalior', lat: 26.2183, lon: 78.1828 },
    { name: 'Sagar', lat: 23.8388, lon: 78.7378 },
    { name: 'Dewas', lat: 22.9676, lon: 76.0534 },
    { name: 'Narmadapuram (Hoshangabad)', lat: 22.7519, lon: 77.7289 },
    { name: 'Vidisha', lat: 23.5251, lon: 77.8081 },
    { name: 'Sehore', lat: 23.2030, lon: 77.0844 },
    { name: 'Ratlam', lat: 23.3315, lon: 75.0367 },
    { name: 'Mandsaur', lat: 24.0728, lon: 75.0682 },
    { name: 'Khargone', lat: 21.8234, lon: 75.6094 },
    { name: 'Chhindwara', lat: 22.0574, lon: 78.9382 },
  ],
  'Maharashtra': [
    { name: 'Nashik', lat: 19.9975, lon: 73.7898 },
    { name: 'Pune', lat: 18.5204, lon: 73.8567 },
    { name: 'Chhatrapati Sambhajinagar (Aurangabad)', lat: 19.8762, lon: 75.3433 },
    { name: 'Nagpur', lat: 21.1458, lon: 79.0882 },
    { name: 'Ahmednagar', lat: 19.0948, lon: 74.7480 },
    { name: 'Kolhapur', lat: 16.7050, lon: 74.2433 },
    { name: 'Solapur', lat: 17.6599, lon: 75.9064 },
    { name: 'Jalgaon', lat: 21.0077, lon: 75.5626 },
    { name: 'Satara', lat: 17.6805, lon: 74.0183 },
    { name: 'Sangli', lat: 16.8524, lon: 74.5815 },
    { name: 'Amravati', lat: 20.9320, lon: 77.7523 },
    { name: 'Latur', lat: 18.4088, lon: 76.5604 },
    { name: 'Yavatmal', lat: 20.3888, lon: 78.1204 },
    { name: 'Akola', lat: 20.7002, lon: 77.0082 },
  ],
  'Gujarat': [
    { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714 },
    { name: 'Rajkot', lat: 22.3039, lon: 70.8022 },
    { name: 'Surat', lat: 21.1702, lon: 72.8311 },
    { name: 'Vadodara', lat: 22.3072, lon: 73.1812 },
    { name: 'Junagadh', lat: 21.5222, lon: 70.4579 },
    { name: 'Bhavnagar', lat: 21.7645, lon: 72.1519 },
    { name: 'Anand', lat: 22.5645, lon: 72.9289 },
    { name: 'Mehsana', lat: 23.5880, lon: 72.3693 },
    { name: 'Banaskantha (Palanpur)', lat: 24.1724, lon: 72.4346 },
    { name: 'Kheda (Nadiad)', lat: 22.6916, lon: 72.8634 },
    { name: 'Amreli', lat: 21.6032, lon: 71.2221 },
    { name: 'Jamnagar', lat: 22.4707, lon: 70.0577 },
  ],
  'Karnataka': [
    { name: 'Belagavi (Belgaum)', lat: 15.8497, lon: 74.4977 },
    { name: 'Dharwad / Hubballi', lat: 15.4589, lon: 75.0078 },
    { name: 'Mysuru (Mysore)', lat: 12.2958, lon: 76.6394 },
    { name: 'Mandya', lat: 12.5242, lon: 76.8958 },
    { name: 'Shivamogga (Shimoga)', lat: 13.9299, lon: 75.5681 },
    { name: 'Vijayapura (Bijapur)', lat: 16.8302, lon: 75.7100 },
    { name: 'Hassan', lat: 13.0033, lon: 76.1004 },
    { name: 'Ballari (Bellary)', lat: 15.1394, lon: 76.9214 },
    { name: 'Kalaburagi (Gulbarga)', lat: 17.3297, lon: 76.8343 },
    { name: 'Tumakuru (Tumkur)', lat: 13.3392, lon: 77.1017 },
    { name: 'Davangere', lat: 14.4644, lon: 75.9218 },
    { name: 'Bagalkote', lat: 16.1875, lon: 75.6980 },
    { name: 'Bengaluru Rural', lat: 13.2215, lon: 77.5753 },
  ],
  'Andhra Pradesh': [
    { name: 'Guntur', lat: 16.3067, lon: 80.4365 },
    { name: 'Krishna (Machilipatnam / Vijayawada)', lat: 16.1875, lon: 81.1389 },
    { name: 'East Godavari (Kakinada / Rajahmundry)', lat: 16.9891, lon: 82.2475 },
    { name: 'West Godavari (Eluru)', lat: 16.7107, lon: 81.0952 },
    { name: 'Kurnool', lat: 15.8281, lon: 78.0373 },
    { name: 'Anantapur', lat: 14.6819, lon: 77.6006 },
    { name: 'Chittoor / Tirupati', lat: 13.2172, lon: 79.1003 },
    { name: 'Prakasam (Ongole)', lat: 15.5057, lon: 80.0499 },
    { name: 'Nellore', lat: 14.4426, lon: 79.9865 },
    { name: 'Visakhapatnam', lat: 17.6868, lon: 83.2185 },
  ],
  'Telangana': [
    { name: 'Warangal', lat: 17.9689, lon: 79.5941 },
    { name: 'Karimnagar', lat: 18.4386, lon: 79.1288 },
    { name: 'Nizamabad', lat: 18.6725, lon: 78.0941 },
    { name: 'Nalgonda', lat: 17.0577, lon: 79.2684 },
    { name: 'Khammam', lat: 17.2473, lon: 80.1514 },
    { name: 'Mahabubnagar', lat: 16.7488, lon: 77.9869 },
    { name: 'Sangareddy (Medak)', lat: 17.6190, lon: 78.0818 },
    { name: 'Siddipet', lat: 18.1018, lon: 78.8520 },
    { name: 'Adilabad', lat: 19.6641, lon: 78.5320 },
  ],
  'Tamil Nadu': [
    { name: 'Thanjavur', lat: 10.7870, lon: 79.1378 },
    { name: 'Coimbatore', lat: 11.0168, lon: 76.9558 },
    { name: 'Madurai', lat: 9.9252, lon: 78.1198 },
    { name: 'Salem', lat: 11.6643, lon: 78.1460 },
    { name: 'Tiruchirappalli (Trichy)', lat: 10.7905, lon: 78.7047 },
    { name: 'Erode', lat: 11.3410, lon: 77.7172 },
    { name: 'Tirunelveli', lat: 8.7139, lon: 77.7567 },
    { name: 'Cuddalore', lat: 11.7480, lon: 79.7714 },
    { name: 'Villupuram', lat: 11.9401, lon: 79.4861 },
    { name: 'Dindigul', lat: 10.3673, lon: 77.9803 },
    { name: 'Tiruppur', lat: 11.1085, lon: 77.3411 },
  ],
  'Bihar': [
    { name: 'Patna', lat: 25.5941, lon: 85.1376 },
    { name: 'Muzaffarpur', lat: 26.1209, lon: 85.3647 },
    { name: 'Gaya', lat: 24.7914, lon: 85.0002 },
    { name: 'Bhagalpur', lat: 25.2425, lon: 86.9842 },
    { name: 'Darbhanga', lat: 26.1542, lon: 85.8918 },
    { name: 'Purnia', lat: 25.7771, lon: 87.4753 },
    { name: 'Rohtas (Sasaram)', lat: 24.9490, lon: 84.0315 },
    { name: 'Samastipur', lat: 25.8629, lon: 85.7811 },
    { name: 'Begusarai', lat: 25.4182, lon: 86.1272 },
    { name: 'Vaishali (Hajipur)', lat: 25.6858, lon: 85.2146 },
    { name: 'Nalanda (Bihar Sharif)', lat: 25.1982, lon: 85.5149 },
  ],
  'West Bengal': [
    { name: 'Purba Bardhaman (Burdwan)', lat: 23.2324, lon: 87.8615 },
    { name: 'Hooghly (Chinsurah)', lat: 22.9031, lon: 88.3968 },
    { name: 'Murshidabad (Baharampur)', lat: 24.0984, lon: 88.2678 },
    { name: 'Nadia (Krishnanagar)', lat: 23.4013, lon: 88.5025 },
    { name: 'Paschim Medinipur', lat: 22.4257, lon: 87.3199 },
    { name: 'Birbhum (Suri)', lat: 23.9054, lon: 87.5246 },
    { name: 'Malda', lat: 25.0108, lon: 88.1411 },
    { name: 'Jalpaiguri', lat: 26.5413, lon: 88.7196 },
    { name: 'Bankura', lat: 23.2319, lon: 87.0784 },
    { name: 'North 24 Parganas (Barasat)', lat: 22.7214, lon: 88.4820 },
  ],
  'Odisha': [
    { name: 'Cuttack', lat: 20.4625, lon: 85.8828 },
    { name: 'Sambalpur', lat: 21.4669, lon: 83.9812 },
    { name: 'Bargarh', lat: 21.3323, lon: 83.6198 },
    { name: 'Balasore', lat: 21.4934, lon: 86.9135 },
    { name: 'Ganjam (Berhampur)', lat: 19.3149, lon: 84.7941 },
    { name: 'Puri', lat: 19.8135, lon: 85.8312 },
    { name: 'Kalahandi (Bhawanipatna)', lat: 19.9075, lon: 83.1759 },
    { name: 'Bolangir', lat: 20.7107, lon: 83.4842 },
    { name: 'Khordha (Bhubaneswar)', lat: 20.2961, lon: 85.8245 },
  ],
  'Kerala': [
    { name: 'Palakkad', lat: 10.7867, lon: 76.6548 },
    { name: 'Wayanad (Kalpetta)', lat: 11.6103, lon: 76.0827 },
    { name: 'Idukki (Painavu)', lat: 9.8500, lon: 76.9700 },
    { name: 'Alappuzha', lat: 9.4981, lon: 76.3388 },
    { name: 'Thrissur', lat: 10.5276, lon: 76.2144 },
    { name: 'Kottayam', lat: 9.5916, lon: 76.5222 },
    { name: 'Malappuram', lat: 11.0732, lon: 76.0740 },
    { name: 'Kozhikode', lat: 11.2588, lon: 75.7804 },
  ],
  'Assam': [
    { name: 'Nagaon', lat: 26.3463, lon: 92.6840 },
    { name: 'Sonitpur (Tezpur)', lat: 26.6528, lon: 92.7926 },
    { name: 'Dibrugarh', lat: 27.4728, lon: 94.9120 },
    { name: 'Kamrup Rural (Amingaon)', lat: 26.1806, lon: 91.6885 },
    { name: 'Cachar (Silchar)', lat: 24.8333, lon: 92.7789 },
    { name: 'Golaghat', lat: 26.5167, lon: 93.9667 },
    { name: 'Barpeta', lat: 26.3200, lon: 91.0000 },
    { name: 'Jorhat', lat: 26.7509, lon: 94.2037 },
  ],
  'Himachal Pradesh': [
    { name: 'Kangra (Dharamshala)', lat: 32.2190, lon: 76.3234 },
    { name: 'Mandi', lat: 31.7082, lon: 76.9318 },
    { name: 'Shimla', lat: 31.1048, lon: 77.1734 },
    { name: 'Kullu', lat: 31.9579, lon: 77.1095 },
    { name: 'Solan', lat: 30.9045, lon: 77.0967 },
    { name: 'Una', lat: 31.4685, lon: 76.2708 },
  ],
  'Uttarakhand': [
    { name: 'Dehradun', lat: 30.3165, lon: 78.0322 },
    { name: 'Haridwar', lat: 29.9457, lon: 78.1642 },
    { name: 'Udham Singh Nagar (Rudrapur)', lat: 28.9800, lon: 79.4000 },
    { name: 'Nainital', lat: 29.3919, lon: 79.4542 },
  ],
  'Jammu & Kashmir': [
    { name: 'Anantnag', lat: 33.7311, lon: 75.1522 },
    { name: 'Baramulla', lat: 34.1980, lon: 74.3636 },
    { name: 'Jammu', lat: 32.7266, lon: 74.8570 },
    { name: 'Kathua', lat: 32.3716, lon: 75.5186 },
    { name: 'Pulwama', lat: 33.8711, lon: 74.8967 },
    { name: 'Srinagar', lat: 34.0837, lon: 74.7973 },
  ],
  'Chhattisgarh': [
    { name: 'Raipur', lat: 21.2514, lon: 81.6296 },
    { name: 'Durg', lat: 21.1904, lon: 81.2849 },
    { name: 'Bilaspur', lat: 22.0797, lon: 82.1409 },
    { name: 'Rajnandgaon', lat: 21.0970, lon: 81.0370 },
    { name: 'Janjgir-Champa', lat: 22.0090, lon: 82.5714 },
  ],
  'Jharkhand': [
    { name: 'Ranchi', lat: 23.3441, lon: 85.3096 },
    { name: 'Hazaribagh', lat: 23.9937, lon: 85.3623 },
    { name: 'Dhanbad', lat: 23.7957, lon: 86.4304 },
    { name: 'Bokaro', lat: 23.6693, lon: 86.1511 },
    { name: 'Dumka', lat: 24.2686, lon: 87.2486 },
  ],
  'Goa': [
    { name: 'North Goa (Panaji)', lat: 15.4909, lon: 73.8278 },
    { name: 'South Goa (Margao)', lat: 15.2832, lon: 73.9862 },
  ],
};

/**
 * Returns list of supported Indian states
 */
export function getIndianStates(): string[] {
  return Object.keys(INDIAN_STATES_AND_DISTRICTS);
}

/**
 * Returns list of district names for a given Indian state
 */
export function getDistrictsByState(state: string): string[] {
  const match = Object.keys(INDIAN_STATES_AND_DISTRICTS).find(
    (s) => s.toLowerCase() === state.toLowerCase().trim()
  );
  if (!match) return [];
  return INDIAN_STATES_AND_DISTRICTS[match].map((d) => d.name);
}

/**
 * Returns central coordinates for a State + District
 */
export function getDistrictCoordinates(state: string, district: string): { lat: number; lon: number } {
  const stateMatch = Object.keys(INDIAN_STATES_AND_DISTRICTS).find(
    (s) => s.toLowerCase() === state.toLowerCase().trim()
  );
  if (stateMatch) {
    const dList = INDIAN_STATES_AND_DISTRICTS[stateMatch];
    const distMatch = dList.find(
      (d) => d.name.toLowerCase().includes(district.toLowerCase().trim()) ||
             district.toLowerCase().includes(d.name.toLowerCase().trim())
    );
    if (distMatch) {
      return { lat: distMatch.lat, lon: distMatch.lon };
    }
    // Return first district of the state as centroid fallback
    if (dList.length > 0) {
      return { lat: dList[0].lat, lon: dList[0].lon };
    }
  }

  // Fallback: Punjab, Ludhiana
  return { lat: 30.9010, lon: 75.8573 };
}

/**
 * Haversine distance in kilometers
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Matches coordinates to nearest district in dataset
 */
export function findNearestDistrict(lat: number, lon: number): { state: string; district: string; distanceKm: number } {
  let closestState = 'Punjab';
  let closestDistrict = 'Ludhiana';
  let minDistance = Infinity;

  for (const [state, districts] of Object.entries(INDIAN_STATES_AND_DISTRICTS)) {
    for (const dist of districts) {
      const distKm = calculateDistanceKm(lat, lon, dist.lat, dist.lon);
      if (distKm < minDistance) {
        minDistance = distKm;
        closestState = state;
        closestDistrict = dist.name;
      }
    }
  }

  return { state: closestState, district: closestDistrict, distanceKm: Number(minDistance.toFixed(1)) };
}

/**
 * Format coordinates for agricultural cards e.g. "30.9010° N, 75.8573° E"
 */
export function formatCoordinates(lat?: number, lon?: number): string {
  if (typeof lat !== 'number' || typeof lon !== 'number' || isNaN(lat) || isNaN(lon)) {
    return 'Coordinates Pending';
  }
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}`;
}

/**
 * Validates coordinate bounding box for agricultural use
 */
export function validateCoordinates(lat: number, lon: number): boolean {
  if (isNaN(lat) || isNaN(lon)) return false;
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

/**
 * Reverse Geocode latitude and longitude to determine Village/District/State
 * Uses:
 * 1. Google Maps Geocoding API if key is present
 * 2. Open-Meteo / Nominatim public reverse geocode API
 * 3. Nearest district centroid matching fallback
 */
export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<FarmLocationDetails & { source: string }> {
  if (!validateCoordinates(lat, lon)) {
    const safeLat = lat || 20.5937;
    const safeLon = lon || 78.9629;
    const nearest = findNearestDistrict(safeLat, safeLon);
    return {
      country: 'India',
      state: nearest.state,
      district: nearest.district,
      latitude: safeLat,
      longitude: safeLon,
      formattedAddress: `${nearest.district}, ${nearest.state}`,
      source: 'fallback',
    };
  }

  // 1. Check if Google Maps API key is configured
  const googleApiKey = typeof window !== 'undefined'
    ? (window as any).NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    : process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (googleApiKey && typeof window !== 'undefined' && (window as any).google?.maps?.Geocoder) {
    try {
      const geocoder = new (window as any).google.maps.Geocoder();
      const response = await new Promise<any>((resolve, reject) => {
        geocoder.geocode({ location: { lat, lng: lon } }, (results: any, status: any) => {
          if (status === 'OK' && results?.[0]) {
            resolve(results[0]);
          } else {
            reject(new Error(`Google Geocoder status: ${status}`));
          }
        });
      });

      if (response) {
        let country = 'India';
        let state = '';
        let district = '';
        let subDistrict = '';
        let village = '';

        for (const comp of response.address_components || []) {
          if (comp.types.includes('country')) country = comp.long_name;
          if (comp.types.includes('administrative_area_level_1')) state = comp.long_name;
          if (comp.types.includes('administrative_area_level_2') || comp.types.includes('administrative_area_level_3')) {
            if (!district) district = comp.long_name;
          }
          if (comp.types.includes('sublocality') || comp.types.includes('locality') || comp.types.includes('neighborhood')) {
            if (!village) village = comp.long_name;
            else if (!subDistrict) subDistrict = comp.long_name;
          }
        }

        const nearest = findNearestDistrict(lat, lon);
        const resolvedState = state || nearest.state;
        const resolvedDistrict = district || village || nearest.district;
        const address = response.formatted_address || `${resolvedDistrict}, ${resolvedState}`;
        return {
          country: country || 'India',
          state: resolvedState,
          district: resolvedDistrict,
          subDistrict: subDistrict || undefined,
          village: village || undefined,
          latitude: lat,
          longitude: lon,
          formattedAddress: address,
          source: 'google-maps',
        };
      }
    } catch (gErr) {
      console.warn('Google Maps reverse geocoding error:', gErr);
    }
  }

  // 2. Open-Meteo / Nominatim reverse geocode fetch
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=14&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const country = addr.country || 'India';
      const nearest = findNearestDistrict(lat, lon);
      const state = addr.state || addr.province || nearest.state;
      const district = addr.state_district || addr.county || addr.district || addr.city || addr.town || nearest.district;
      const subDistrict = addr.suburb || addr.municipality || addr.taluk || addr.tehsil;
      const village = addr.village || addr.hamlet || addr.neighbourhood || addr.suburb;

      const formatted = [village, district, state].filter(Boolean).join(', ');

      return {
        country,
        state,
        district,
        subDistrict,
        village,
        latitude: lat,
        longitude: lon,
        formattedAddress: formatted || `${district}, ${state}`,
        source: 'nominatim-osm',
      };
    }
  } catch (osmErr) {
    console.warn('Nominatim reverse geocoding unavailable, using local centroid match:', osmErr);
  }

  // 3. Fallback to closest district centroid
  const nearest = findNearestDistrict(lat, lon);
  return {
    country: 'India',
    state: nearest.state,
    district: nearest.district,
    latitude: lat,
    longitude: lon,
    formattedAddress: `${nearest.district}, ${nearest.state}`,
    source: 'nearest-centroid',
  };
}
