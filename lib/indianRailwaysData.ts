/**
 * Comprehensive Indian Railways Dataset & Generator
 * Covers stations across all 17 railway zones and realistic train schedules.
 */

export interface StationData {
  code: string;
  name: string;
  city: string;
  state: string;
  zone: string;
}

export const INDIAN_STATIONS: StationData[] = [
  // Northern Railway (NR) & NCR
  { code: "NDLS", name: "New Delhi", city: "Delhi", state: "Delhi", zone: "NR" },
  { code: "DLI", name: "Old Delhi", city: "Delhi", state: "Delhi", zone: "NR" },
  { code: "NZM", name: "Hazrat Nizamuddin", city: "Delhi", state: "Delhi", zone: "NR" },
  { code: "ANVT", name: "Anand Vihar Terminal", city: "Delhi", state: "Delhi", zone: "NR" },
  { code: "GZB", name: "Ghaziabad Junction", city: "Ghaziabad", state: "Uttar Pradesh", zone: "NR" },
  { code: "LKO", name: "Lucknow Charbagh", city: "Lucknow", state: "Uttar Pradesh", zone: "NR" },
  { code: "BSB", name: "Varanasi Junction", city: "Varanasi", state: "Uttar Pradesh", zone: "NR" },
  { code: "PRYJ", name: "Prayagraj Junction", city: "Prayagraj", state: "Uttar Pradesh", zone: "NCR" },
  { code: "CNB", name: "Kanpur Central", city: "Kanpur", state: "Uttar Pradesh", zone: "NCR" },
  { code: "AGC", name: "Agra Cantt", city: "Agra", state: "Uttar Pradesh", zone: "NCR" },
  { code: "GWL", name: "Gwalior Junction", city: "Gwalior", state: "Madhya Pradesh", zone: "NCR" },
  { code: "VGLJ", name: "V Lakshmibai Jhansi", city: "Jhansi", state: "Uttar Pradesh", zone: "NCR" },
  { code: "CDG", name: "Chandigarh Junction", city: "Chandigarh", state: "Chandigarh", zone: "NR" },
  { code: "ASR", name: "Amritsar Junction", city: "Amritsar", state: "Punjab", zone: "NR" },
  { code: "LDH", name: "Ludhiana Junction", city: "Ludhiana", state: "Punjab", zone: "NR" },
  { code: "JAT", name: "Jammu Tawi", city: "Jammu", state: "Jammu & Kashmir", zone: "NR" },
  { code: "SVDK", name: "Shri Mata Vaishno Devi Katra", city: "Katra", state: "Jammu & Kashmir", zone: "NR" },
  { code: "HW", name: "Haridwar Junction", city: "Haridwar", state: "Uttarakhand", zone: "NR" },
  { code: "DDN", name: "Dehradun Terminal", city: "Dehradun", state: "Uttarakhand", zone: "NR" },

  // Western Railway (WR) & WCR
  { code: "MMCT", name: "Mumbai Central", city: "Mumbai", state: "Maharashtra", zone: "WR" },
  { code: "BDTS", name: "Bandra Terminus", city: "Mumbai", state: "Maharashtra", zone: "WR" },
  { code: "ST", name: "Surat", city: "Surat", state: "Gujarat", zone: "WR" },
  { code: "BRC", name: "Vadodara Junction", city: "Vadodara", state: "Gujarat", zone: "WR" },
  { code: "ADI", name: "Ahmedabad Junction", city: "Ahmedabad", state: "Gujarat", zone: "WR" },
  { code: "RJT", name: "Rajkot Junction", city: "Rajkot", state: "Gujarat", zone: "WR" },
  { code: "BVC", name: "Bhavnagar Terminus", city: "Bhavnagar", state: "Gujarat", zone: "WR" },
  { code: "INDB", name: "Indore Junction", city: "Indore", state: "Madhya Pradesh", zone: "WR" },
  { code: "RTM", name: "Ratlam Junction", city: "Ratlam", state: "Madhya Pradesh", zone: "WR" },
  { code: "UJN", name: "Ujjain Junction", city: "Ujjain", state: "Madhya Pradesh", zone: "WR" },
  { code: "KOTA", name: "Kota Junction", city: "Kota", state: "Rajasthan", zone: "WCR" },
  { code: "BPL", name: "Bhopal Junction", city: "Bhopal", state: "Madhya Pradesh", zone: "WCR" },
  { code: "RKMP", name: "Rani Kamlapati", city: "Bhopal", state: "Madhya Pradesh", zone: "WCR" },
  { code: "JBP", name: "Jabalpur Junction", city: "Jabalpur", state: "Madhya Pradesh", zone: "WCR" },
  { code: "ET", name: "Itarsi Junction", city: "Itarsi", state: "Madhya Pradesh", zone: "WCR" },

  // Central Railway (CR)
  { code: "CSMT", name: "Mumbai CSMT", city: "Mumbai", state: "Maharashtra", zone: "CR" },
  { code: "LTT", name: "Lokmanya Tilak Terminus", city: "Mumbai", state: "Maharashtra", zone: "CR" },
  { code: "DR", name: "Dadar Central", city: "Mumbai", state: "Maharashtra", zone: "CR" },
  { code: "TNA", name: "Thane", city: "Thane", state: "Maharashtra", zone: "CR" },
  { code: "KYN", name: "Kalyan Junction", city: "Kalyan", state: "Maharashtra", zone: "CR" },
  { code: "PUNE", name: "Pune Junction", city: "Pune", state: "Maharashtra", zone: "CR" },
  { code: "NGP", name: "Nagpur Junction", city: "Nagpur", state: "Maharashtra", zone: "CR" },
  { code: "SUR", name: "Solapur Junction", city: "Solapur", state: "Maharashtra", zone: "CR" },
  { code: "NK", name: "Nashik Road", city: "Nashik", state: "Maharashtra", zone: "CR" },
  { code: "BSL", name: "Bhusawal Junction", city: "Bhusawal", state: "Maharashtra", zone: "CR" },
  { code: "CSN", name: "Chhatrapati Sambhajinagar", city: "Aurangabad", state: "Maharashtra", zone: "CR" },
  { code: "KOP", name: "Kolhapur CSMT", city: "Kolhapur", state: "Maharashtra", zone: "CR" },

  // Eastern & South Eastern Railway (ER, SER, ECoR)
  { code: "HWH", name: "Howrah Junction", city: "Kolkata", state: "West Bengal", zone: "ER" },
  { code: "SDAH", name: "Sealdah", city: "Kolkata", state: "West Bengal", zone: "ER" },
  { code: "KOAA", name: "Kolkata Chitpur", city: "Kolkata", state: "West Bengal", zone: "ER" },
  { code: "ASN", name: "Asansol Junction", city: "Asansol", state: "West Bengal", zone: "ER" },
  { code: "MLDT", name: "Malda Town", city: "Malda", state: "West Bengal", zone: "ER" },
  { code: "TATA", name: "Tatanagar Junction", city: "Jamshedpur", state: "Jharkhand", zone: "SER" },
  { code: "RNC", name: "Ranchi Junction", city: "Ranchi", state: "Jharkhand", zone: "SER" },
  { code: "DHN", name: "Dhanbad Junction", city: "Dhanbad", state: "Jharkhand", zone: "ECR" },
  { code: "KGP", name: "Kharagpur Junction", city: "Kharagpur", state: "West Bengal", zone: "SER" },
  { code: "ROU", name: "Rourkela Junction", city: "Rourkela", state: "Odisha", zone: "SER" },
  { code: "BBS", name: "Bhubaneswar", city: "Bhubaneswar", state: "Odisha", zone: "ECoR" },
  { code: "PURI", name: "Puri Terminus", city: "Puri", state: "Odisha", zone: "ECoR" },
  { code: "CTC", name: "Cuttack Junction", city: "Cuttack", state: "Odisha", zone: "ECoR" },
  { code: "VSKP", name: "Visakhapatnam Junction", city: "Visakhapatnam", state: "Andhra Pradesh", zone: "ECoR" },

  // Southern Railway (SR) & SWR
  { code: "MAS", name: "Chennai Central", city: "Chennai", state: "Tamil Nadu", zone: "SR" },
  { code: "MS", name: "Chennai Egmore", city: "Chennai", state: "Tamil Nadu", zone: "SR" },
  { code: "CBE", name: "Coimbatore Junction", city: "Coimbatore", state: "Tamil Nadu", zone: "SR" },
  { code: "MDU", name: "Madurai Junction", city: "Madurai", state: "Tamil Nadu", zone: "SR" },
  { code: "TPJ", name: "Tiruchirappalli Junction", city: "Trichy", state: "Tamil Nadu", zone: "SR" },
  { code: "TVC", name: "Thiruvananthapuram Central", city: "Trivandrum", state: "Kerala", zone: "SR" },
  { code: "ERS", name: "Ernakulam Junction (Kochi)", city: "Kochi", state: "Kerala", zone: "SR" },
  { code: "CLT", name: "Kozhikode", city: "Calicut", state: "Kerala", zone: "SR" },
  { code: "MAQ", name: "Mangaluru Central", city: "Mangaluru", state: "Karnataka", zone: "SR" },
  { code: "SBC", name: "KSR Bengaluru City", city: "Bengaluru", state: "Karnataka", zone: "SWR" },
  { code: "YPR", name: "Yesvantpur Junction", city: "Bengaluru", state: "Karnataka", zone: "SWR" },
  { code: "MYS", name: "Mysuru Junction", city: "Mysuru", state: "Karnataka", zone: "SWR" },
  { code: "UBL", name: "SSS Hubballi Junction", city: "Hubli", state: "Karnataka", zone: "SWR" },
  { code: "BGM", name: "Belagavi", city: "Belgaum", state: "Karnataka", zone: "SWR" },

  // South Central Railway (SCR)
  { code: "SC", name: "Secunderabad Junction", city: "Hyderabad", state: "Telangana", zone: "SCR" },
  { code: "HYB", name: "Hyderabad Deccan", city: "Hyderabad", state: "Telangana", zone: "SCR" },
  { code: "BZA", name: "Vijayawada Junction", city: "Vijayawada", state: "Andhra Pradesh", zone: "SCR" },
  { code: "TPTY", name: "Tirupati", city: "Tirupati", state: "Andhra Pradesh", zone: "SCR" },
  { code: "WL", name: "Warangal", city: "Warangal", state: "Telangana", zone: "SCR" },

  // North Western Railway (NWR)
  { code: "JP", name: "Jaipur Junction", city: "Jaipur", state: "Rajasthan", zone: "NWR" },
  { code: "JU", name: "Jodhpur Junction", city: "Jodhpur", state: "Rajasthan", zone: "NWR" },
  { code: "BKN", name: "Bikaner Junction", city: "Bikaner", state: "Rajasthan", zone: "NWR" },
  { code: "AII", name: "Ajmer Junction", city: "Ajmer", state: "Rajasthan", zone: "NWR" },
  { code: "UDZ", name: "Udaipur City", city: "Udaipur", state: "Rajasthan", zone: "NWR" },

  // East Central & Northeast Frontier (ECR, NFR, NER)
  { code: "PNBE", name: "Patna Junction", city: "Patna", state: "Bihar", zone: "ECR" },
  { code: "GAYA", name: "Gaya Junction", city: "Gaya", state: "Bihar", zone: "ECR" },
  { code: "MFP", name: "Muzaffarpur Junction", city: "Muzaffarpur", state: "Bihar", zone: "ECR" },
  { code: "GKP", name: "Gorakhpur Junction", city: "Gorakhpur", state: "Uttar Pradesh", zone: "NER" },
  { code: "GHY", name: "Guwahati", city: "Guwahati", state: "Assam", zone: "NFR" },
  { code: "NJP", name: "New Jalpaiguri", city: "Siliguri", state: "West Bengal", zone: "NFR" },
  { code: "DBRG", name: "Dibrugarh", city: "Dibrugarh", state: "Assam", zone: "NFR" },

  // SECR & Central
  { code: "R", name: "Raipur Junction", city: "Raipur", state: "Chhattisgarh", zone: "SECR" },
  { code: "BSP", name: "Bilaspur Junction", city: "Bilaspur", state: "Chhattisgarh", zone: "SECR" },
  { code: "MAO", name: "Madgaon Junction (Goa)", city: "Goa", state: "Goa", zone: "KR" },
];

const TRAIN_NAME_PREFIXES = [
  "Vande Bharat",
  "Tejas Rajdhani",
  "Shatabdi",
  "Duronto",
  "Superfast",
  "Garib Rath",
  "Jan Shatabdi",
  "Sampark Kranti",
  "Humsafar",
  "Intercity",
  "Mail",
  "Express",
  "Antyodaya",
  "Double Decker",
];

const ICONIC_NAMES = [
  "Karnataka", "Tamil Nadu", "Kerala", "Telangana", "Andhra Pradesh",
  "Ganga Kaveri", "Kashi Vishwanath", "Gitanjali", "Coromandel", "Paschim",
  "Punjab Mail", "Frontier", "Deccan Queen", "Konkan Kanya", "Netravati",
  "Charminar", "Godavari", "Mangala Lakshadweep", "Poorva", "Kalka Mail",
  "Matsyagandha", "Mandovi", "Malwa", "Hemkunt", "Golden Temple",
  "Swarna Jayanti", "Grand Trunk", "Vaigai", "Pallavan", "Brindavan",
  "Lalbagh", "Cheran", "Island", "Sabari", "Udyan",
  "Deccan", "Prashanti", "Dhauli", "Falaknuma", "Pinakini",
  "Navjeevan", "Saryu Yamuna", "Shaheed", "Himgiri", "Gomti",
  "Brahmaputra", "Saraighat", "Padatik", "Kanchankanya", "Darjeeling Mail",
  "Ajanta", "Panchavati", "Tapovan", "Sewagram", "Vidarbha",
  "Mahakoshal", "Shipra", "Narmada", "Amarkantak", "Chambal"
];

/**
 * Procedurally generates an authentic Indian Railways train document.
 */
export function generateIndianTrainDocument(index: number, specificDate?: string) {
  const stationCount = INDIAN_STATIONS.length;
  // Pick distinct from and to stations deterministically based on index
  const fromIdx = index % stationCount;
  let toIdx = (index * 7 + 13) % stationCount;
  if (toIdx === fromIdx) {
    toIdx = (toIdx + 1) % stationCount;
  }

  const fromStation = INDIAN_STATIONS[fromIdx];
  const toStation = INDIAN_STATIONS[toIdx];

  // Train numbering: Indian Railways passenger train numbers range from 11001 to 25571+
  const trainNumber = (11000 + (index % 14572)).toString();

  // Determine train category
  let trainType = "Superfast Express";
  let classes = [];

  const typeMod = index % 10;
  if (typeMod === 0) {
    trainType = "Vande Bharat Express";
    classes = [
      { classType: "CC", className: "AC Chair Car", price: 1250 + (index % 600), totalSeats: 110, availableSeats: 45 + (index % 50) },
      { classType: "EC", className: "Exec. Chair Car", price: 2350 + (index % 900), totalSeats: 32, availableSeats: 12 + (index % 15) },
    ];
  } else if (typeMod === 1) {
    trainType = "Rajdhani Express";
    classes = [
      { classType: "3A", className: "AC 3 Tier", price: 1850 + (index % 700), totalSeats: 120, availableSeats: 60 + (index % 50) },
      { classType: "2A", className: "AC 2 Tier", price: 2850 + (index % 900), totalSeats: 54, availableSeats: 25 + (index % 20) },
      { classType: "1A", className: "AC First Class", price: 4600 + (index % 1200), totalSeats: 24, availableSeats: 8 + (index % 10) },
    ];
  } else if (typeMod === 2) {
    trainType = "Shatabdi Express";
    classes = [
      { classType: "CC", className: "AC Chair Car", price: 1050 + (index % 500), totalSeats: 120, availableSeats: 70 + (index % 40) },
      { classType: "EC", className: "Exec. Chair Car", price: 1950 + (index % 700), totalSeats: 28, availableSeats: 14 + (index % 10) },
    ];
  } else {
    trainType = index % 3 === 0 ? "Superfast Express" : "Mail Express";
    classes = [
      { classType: "2S", className: "Second Sitting", price: 180 + (index % 120), totalSeats: 140, availableSeats: 65 + (index % 60) },
      { classType: "SL", className: "Sleeper Class", price: 490 + (index % 350), totalSeats: 210, availableSeats: 90 + (index % 100) },
      { classType: "3A", className: "AC 3 Tier", price: 1350 + (index % 650), totalSeats: 96, availableSeats: 40 + (index % 40) },
      { classType: "2A", className: "AC 2 Tier", price: 2150 + (index % 800), totalSeats: 48, availableSeats: 18 + (index % 25) },
    ];
  }

  // Train Name
  const iconicName = ICONIC_NAMES[index % ICONIC_NAMES.length];
  const trainName = `${fromStation.city} - ${toStation.city} ${iconicName} ${trainType.split(" ")[0]}`;

  // Timings
  const depHour = String(index % 24).padStart(2, "0");
  const depMin = String((index * 15) % 60).padStart(2, "0");
  const departureTime = `${depHour}:${depMin}`;

  const durationHours = 4 + (index % 22);
  const durationMins = (index * 10) % 60;
  const arrHour = String((Number(depHour) + durationHours) % 24).padStart(2, "0");
  const arrMin = String((Number(depMin) + durationMins) % 60).padStart(2, "0");
  const arrivalTime = `${arrHour}:${arrMin}`;
  const duration = `${durationHours}h ${String(durationMins).padStart(2, "0")}m`;

  const totalSeats = classes.reduce((sum, c) => sum + c.totalSeats, 0);
  const availableSeats = classes.reduce((sum, c) => sum + c.availableSeats, 0);
  const basePrice = classes[0].price;

  // Intermediate route halts
  const midStation1 = INDIAN_STATIONS[(fromIdx + 3) % stationCount];
  const midStation2 = INDIAN_STATIONS[(toIdx + 5) % stationCount];

  const route = [
    { stationCode: fromStation.code, stationName: fromStation.name, arrivalTime: "Starts", departureTime, haltMinutes: 0, distanceKm: 0 },
    { stationCode: midStation1.code, stationName: midStation1.name, arrivalTime: "11:20", departureTime: "11:25", haltMinutes: 5, distanceKm: 340 },
    { stationCode: midStation2.code, stationName: midStation2.name, arrivalTime: "16:40", departureTime: "16:45", haltMinutes: 5, distanceKm: 780 },
    { stationCode: toStation.code, stationName: toStation.name, arrivalTime, departureTime: "Ends", haltMinutes: 0, distanceKm: 1240 },
  ];

  return {
    trainNumber,
    trainName,
    trainType,
    from: fromStation.name,
    to: toStation.name,
    departureTime,
    arrivalTime,
    duration,
    date: specificDate || new Date().toISOString().split("T")[0],
    runsOn: ["Daily", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    classes,
    route,
    totalSeats,
    availableSeats,
    price: basePrice,
  };
}
