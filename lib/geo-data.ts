/**
 * India Geographic Dataset based on official Local Government Directory (LGD).
 * Reference: Local Government Directory (LGD) - Ministry of Panchayati Raj, Govt of India (lgdirectory.gov.in)
 * 
 * Provides authentic administrative cascading:
 * India -> State / UT (28 States + 8 UTs) -> District -> Taluk / Sub-District (Tehsil)
 */

export interface GeoDistrict {
  name: string;
  taluks: string[];
}

export interface GeoState {
  name: string;
  type: "state" | "union_territory";
  districts: GeoDistrict[];
}

export const GEO_HIERARCHY: GeoState[] = [
  // ==========================================
  // STATES (28)
  // ==========================================
  {
    name: "Karnataka",
    type: "state",
    districts: [
      {
        name: "Dakshina Kannada",
        taluks: [
          "Puttur",
          "Mangaluru",
          "Bantwal",
          "Belthangady",
          "Sullia",
          "Kadaba",
          "Moodabidri",
        ],
      },
      {
        name: "Bengaluru Urban",
        taluks: [
          "Bengaluru North",
          "Bengaluru South",
          "Bengaluru East",
          "Anekal",
          "Yelahanka",
        ],
      },
      {
        name: "Bengaluru Rural",
        taluks: ["Devanahalli", "Doddaballapura", "Hosakote", "Nelamangala"],
      },
      {
        name: "Mysuru",
        taluks: [
          "Mysuru",
          "Hunsur",
          "Nanjangud",
          "T. Narasipura",
          "K.R. Nagar",
          "Heggadadevankote",
          "Periyapatna",
          "Saragur",
        ],
      },
      {
        name: "Udupi",
        taluks: [
          "Udupi",
          "Kundapura",
          "Karkala",
          "Byndoor",
          "Brahmavara",
          "Kaup",
          "Hebri",
        ],
      },
      {
        name: "Belagavi",
        taluks: [
          "Belagavi",
          "Gokak",
          "Chikkodi",
          "Athani",
          "Bailhongal",
          "Hukkeri",
          "Ramdurg",
          "Raybag",
          "Saundatti",
          "Khanapur",
          "Kagawad",
          "Kittur",
          "Mudalgi",
          "Nippani",
        ],
      },
      {
        name: "Dharwad",
        taluks: [
          "Dharwad",
          "Hubballi Urban",
          "Hubballi Rural",
          "Kalghatgi",
          "Kundgol",
          "Navalgund",
          "Alnavar",
          "Annigeri",
        ],
      },
      {
        name: "Shivamogga",
        taluks: [
          "Shivamogga",
          "Bhadravathi",
          "Sagar",
          "Shikaripura",
          "Soraba",
          "Thirthahalli",
          "Hosanagara",
        ],
      },
      {
        name: "Hassan",
        taluks: [
          "Hassan",
          "Alur",
          "Arkalgud",
          "Arsikere",
          "Belur",
          "Channarayapatna",
          "Holenarasipura",
          "Sakleshpur",
        ],
      },
      {
        name: "Tumakuru",
        taluks: [
          "Tumakuru",
          "Chiknayakanhalli",
          "Gubbi",
          "Koratagere",
          "Kunigal",
          "Madhugiri",
          "Pavagada",
          "Sira",
          "Tiptur",
          "Turuvekere",
        ],
      },
      {
        name: "Uttara Kannada",
        taluks: [
          "Karwar",
          "Ankola",
          "Kumta",
          "Honnavar",
          "Bhatkal",
          "Sirsi",
          "Siddapur",
          "Yellapur",
          "Mundgod",
          "Haliyal",
          "Joida",
          "Dandeli",
        ],
      },
      {
        name: "Ballari",
        taluks: ["Ballari", "Kampli", "Kurugodu", "Sanduru", "Siruguppa"],
      },
      {
        name: "Bidar",
        taluks: ["Bidar", "Basavakalyan", "Bhalki", "Homnabad", "Aurad"],
      },
      {
        name: "Chamarajanagar",
        taluks: ["Chamarajanagar", "Gundlupet", "Kollegal", "Yelandur", "Hanur"],
      },
      {
        name: "Chikkamagaluru",
        taluks: [
          "Chikkamagaluru",
          "Kadur",
          "Koppa",
          "Mudigere",
          "Narasimharajapura",
          "Sringeri",
          "Tarikere",
          "Ajjampura",
        ],
      },
      {
        name: "Chikkaballapura",
        taluks: ["Chikkaballapura", "Bagepalli", "Chintamani", "Gauribidanur", "Gudibanda", "Sidlaghatta"],
      },
      {
        name: "Chitradurga",
        taluks: ["Chitradurga", "Challakere", "Hiriyur", "Holalkere", "Hosadurga", "Molakalmuru"],
      },
      {
        name: "Davanagere",
        taluks: ["Davanagere", "Harihara", "Honnali", "Channagiri", "Jagalur", "Nyamathi"],
      },
      {
        name: "Gadag",
        taluks: ["Gadag", "Nargund", "Ron", "Shirhatti", "Mundargi", "Gajendragad", "Lakshmeshwar"],
      },
      {
        name: "Kalaburagi",
        taluks: ["Kalaburagi", "Afzalpur", "Aland", "Chincholi", "Chitapur", "Jevargi", "Sedam", "Kamalapur"],
      },
      {
        name: "Kodagu",
        taluks: ["Madikeri", "Somwarpet", "Virajpet", "Kushalnagar", "Ponnampet"],
      },
      {
        name: "Kolar",
        taluks: ["Kolar", "Bangarapet", "Malur", "Mulbagal", "Srinivaspur"],
      },
      {
        name: "Koppal",
        taluks: ["Koppal", "Gangavathi", "Kushtagi", "Yelburga", "Karatagi", "Kukanoor"],
      },
      {
        name: "Mandya",
        taluks: ["Mandya", "Maddur", "Malavalli", "Nagamangala", "Pandavapura", "Krishnarajpet", "Srirangapatna"],
      },
      {
        name: "Raichur",
        taluks: ["Raichur", "Devadurga", "Lingsugur", "Manvi", "Sindhanur", "Maski", "Sirwar"],
      },
      {
        name: "Ramanagara",
        taluks: ["Ramanagara", "Channapatna", "Kanakapura", "Magadi"],
      },
      {
        name: "Vijayapura",
        taluks: ["Vijayapura", "Basavana Bagewadi", "Indi", "Muddebihal", "Sindagi", "Bableshwar", "Chadchan", "Tikota"],
      },
      {
        name: "Yadgir",
        taluks: ["Yadgir", "Shahapur", "Shorapur", "Gurmatkal", "Hunsagi", "Vadagera"],
      },
      {
        name: "Bagalkote",
        taluks: ["Bagalkote", "Badami", "Bilgi", "Hunagund", "Jamkhandi", "Mudhol", "Guledgudda", "Rabkavi Banhatti"],
      },
      {
        name: "Haveri",
        taluks: ["Haveri", "Byadgi", "Hangal", "Hirekerur", "Ranebennur", "Savanur", "Shiggaon", "Rattihalli"],
      },
      {
        name: "Vijayanagara",
        taluks: ["Hosapete", "Hagaribommanahalli", "Harapanahalli", "Hoovina Hadagali", "Kotturu", "Kudligi"],
      },
    ],
  },
  {
    name: "Maharashtra",
    type: "state",
    districts: [
      {
        name: "Mumbai Suburban",
        taluks: ["Andheri", "Bandra", "Kurla", "Borivali"],
      },
      {
        name: "Mumbai City",
        taluks: ["Colaba", "Fort", "Dadar", "Byculla", "Malabar Hill"],
      },
      {
        name: "Pune",
        taluks: [
          "Haveli",
          "Pune City",
          "Baramati",
          "Shirur",
          "Maval",
          "Khed",
          "Daund",
          "Junnar",
          "Ambegaon",
          "Indapur",
          "Purandar",
          "Bhor",
          "Mulshi",
          "Velhe",
        ],
      },
      {
        name: "Thane",
        taluks: ["Thane", "Kalyan", "Murbad", "Bhiwandi", "Shahapur", "Ulhasnagar", "Ambarnath"],
      },
      {
        name: "Nagpur",
        taluks: ["Nagpur Urban", "Nagpur Rural", "Kamptee", "Hingna", "Katol", "Narkhed", "Savner", "Ramtek", "Umred"],
      },
      {
        name: "Nashik",
        taluks: ["Nashik", "Sinnar", "Dindori", "Igatpuri", "Malegaon", "Niphad", "Yeola", "Satana"],
      },
      {
        name: "Chhatrapati Sambhajinagar",
        taluks: ["Aurangabad", "Paithan", "Gangapur", "Vaijapur", "Kannad", "Khuldabad", "Sillod", "Soegaon"],
      },
      {
        name: "Kolhapur",
        taluks: ["Karvir", "Panhala", "Hatkanangale", "Shirol", "Kagal", "Gadhinglaj", "Chandgad", "Radhanagari"],
      },
      {
        name: "Solapur",
        taluks: ["Solapur North", "Solapur South", "Barshi", "Pandharpur", "Malshiras", "Karmala", "Madha", "Sangola", "Mangalwedha", "Mohol", "Akkalkot"],
      },
      {
        name: "Satara",
        taluks: ["Satara", "Karad", "Wai", "Mahabaleshwar", "Phaltan", "Khandala", "Khatav", "Koregaon", "Patan", "Jaoli", "Man"],
      },
      {
        name: "Raigad",
        taluks: ["Alibag", "Panvel", "Pen", "Uran", "Karjat", "Khalapur", "Mangaon", "Mahad", "Roha", "Murud", "Shrivardhan"],
      },
      {
        name: "Palghar",
        taluks: ["Palghar", "Vasai", "Dahanu", "Talasari", "Jawhar", "Mokhada", "Wada", "Vikramgad"],
      },
      {
        name: "Amravati",
        taluks: ["Amravati", "Achalpur", "Chandur Bazar", "Morshi", "Warud", "Daryapur", "Anjangaon Surji"],
      },
      {
        name: "Nanded",
        taluks: ["Nanded", "Biloli", "Deglur", "Hadgaon", "Kinwat", "Kandhar", "Loha", "Mudkhed", "Mukhed"],
      },
      {
        name: "Sangli",
        taluks: ["Miraj", "Tasgaon", "Walwa", "Shirala", "Khanapur", "Atpadi", "Jat", "Kavathe Mahankal", "Palus", "Kadegaon"],
      },
      {
        name: "Ahmednagar",
        taluks: ["Nagar", "Rahuri", "Shrirampur", "Sangamner", "Kopargaon", "Akole", "Nevasa", "Shevgaon", "Parner", "Pathardi", "Jamkhed", "Karjat", "Shrigonda"],
      },
      {
        name: "Jalgaon",
        taluks: ["Jalgaon", "Bhusawal", "Chalisgaon", "Amalner", "Pachora", "Jamner", "Raver", "Yawal", "Erandol", "Parola", "Chopda", "Bhadgaon", "Bodwad", "Dharangaon", "Muktainagar"],
      },
      {
        name: "Akola",
        taluks: ["Akola", "Akot", "Balapur", "Barshitakli", "Murtizapur", "Patur", "Telhara"],
      },
      {
        name: "Latur",
        taluks: ["Latur", "Ausa", "Ahmadpur", "Nilanga", "Udgir", "Chakur", "Deoni", "Jalkot", "Renapur", "Shirur Anantpal"],
      },
      {
        name: "Dhule",
        taluks: ["Dhule", "Sakri", "Sindkheda", "Shirpur"],
      },
      {
        name: "Chandrapur",
        taluks: ["Chandrapur", "Warora", "Bhadravati", "Ballarpur", "Rajura", "Chimur", "Nagbhid", "Sindewahi", "Bramhapuri", "Mul", "Gondpipri", "Pombhurna", "Saoli", "Korpurna", "Jiwati"],
      },
      {
        name: "Parbhani",
        taluks: ["Parbhani", "Gangakhed", "Jintur", "Manwath", "Palam", "Pathri", "Purna", "Sailu", "Sonpeth"],
      },
      {
        name: "Gondia",
        taluks: ["Gondia", "Tirora", "Goregaon", "Arjuni Morgaon", "Deori", "Amgaon", "Salekasa", "Sadak Arjuni"],
      },
      {
        name: "Jalna",
        taluks: ["Jalna", "Ambad", "Bhokardan", "Badnapur", "Ghansawangi", "Jafrabad", "Mantha", "Partur"],
      },
      {
        name: "Yavatmal",
        taluks: ["Yavatmal", "Arni", "Babhulgaon", "Darwha", "Digras", "Ghatanji", "Kalamb", "Kelapur", "Mahagaon", "Maregaon", "Ner", "Pusad", "Ralegaon", "Umarkhed", "Wani", "Zari-Jamani"],
      },
      {
        name: "Beed",
        taluks: ["Beed", "Ashti", "Georai", "Ambajogai", "Kaij", "Majalgaon", "Parli", "Patoda", "Shirur Kasar", "Wadwani", "Dharur"],
      },
      {
        name: "Bhandara",
        taluks: ["Bhandara", "Tumsar", "Pauni", "Mohadi", "Sakoli", "Lakhani", "Lakhandur"],
      },
      {
        name: "Gadchiroli",
        taluks: ["Gadchiroli", "Aheri", "Armori", "Chamorshi", "Desaiganj", "Dhanora", "Etapalli", "Korchi", "Kurkheda", "Mulchera", "Sironcha", "Bhamragad"],
      },
      {
        name: "Hingoli",
        taluks: ["Hingoli", "Aundha Nagnath", "Basmath", "Kalamnuri", "Sengaon"],
      },
      {
        name: "Nandurbar",
        taluks: ["Nandurbar", "Navapur", "Shahada", "Taloda", "Akkalkuwa", "Dhadgaon"],
      },
      {
        name: "Osmanabad",
        taluks: ["Osmanabad", "Tuljapur", "Omerga", "Lohara", "Kalamb", "Bhum", "Paranda", "Washi"],
      },
      {
        name: "Ratnagiri",
        taluks: ["Ratnagiri", "Chiplun", "Dapoli", "Guhagar", "Khed", "Lanja", "Mandangad", "Rajapur", "Sangameshwar"],
      },
      {
        name: "Sindhudurg",
        taluks: ["Kankavli", "Kudal", "Malvan", "Sawantwadi", "Devgad", "Dodamarg", "Vaibhavwadi", "Vengurla"],
      },
      {
        name: "Wardha",
        taluks: ["Wardha", "Arvi", "Ashti", "Deoli", "Hinganghat", "Karanja", "Samudrapur", "Seloo"],
      },
      {
        name: "Washim",
        taluks: ["Washim", "Karanja", "Malegaon", "Mangrulpir", "Manora", "Risod"],
      },
      {
        name: "Buldhana",
        taluks: ["Buldhana", "Chikhli", "Deulgaon Raja", "Jalgaon Jamod", "Khamgaon", "Malkapur", "Mehkar", "Motala", "Nandura", "Sangrampur", "Shegaon", "Sindkhed Raja"],
      },
    ],
  },
  {
    name: "Tamil Nadu",
    type: "state",
    districts: [
      {
        name: "Chennai",
        taluks: ["Mylapore", "T. Nagar", "Guindy", "Velachery", "Egmore", "Aminjikarai", "Ayanavaram", "Mambalam", "Alandur", "Perambur", "Purasawalkam", "Tondiarpet", "Thiruvottiyur", "Sholinganallur"],
      },
      {
        name: "Coimbatore",
        taluks: ["Coimbatore North", "Coimbatore South", "Pollachi", "Mettupalayam", "Sulur", "Annur", "Valparai", "Kinathukadavu", "Madukkarai", "Perur", "Anaimalai"],
      },
      {
        name: "Madurai",
        taluks: ["Madurai North", "Madurai South", "Madurai East", "Madurai West", "Melur", "Thirumangalam", "Vadipatti", "Peraiyur", "Usilampatti"],
      },
      {
        name: "Tiruchirappalli",
        taluks: ["Tiruchirappalli West", "Tiruchirappalli East", "Srirangam", "Lalgudi", "Manapparai", "Musiri", "Thuraiyur"],
      },
      {
        name: "Salem",
        taluks: ["Salem", "Salem West", "Salem South", "Attur", "Mettur", "Omalur", "Sankari", "Yercaud"],
      },
      {
        name: "Chengalpattu",
        taluks: ["Chengalpattu", "Tambaram", "Pallavaram", "Vandalur", "Madurantakam", "Cheyyur", "Thiruporur"],
      },
      {
        name: "Kanchipuram",
        taluks: ["Kanchipuram", "Sriperumbudur", "Kundrathur", "Uthiramerur", "Walajabad"],
      },
      {
        name: "Tirunelveli",
        taluks: ["Tirunelveli", "Palayamkottai", "Ambasamudram", "Cheranmahadevi", "Nanguneri", "Radhapuram"],
      },
      {
        name: "Erode",
        taluks: ["Erode", "Bhavani", "Gobichettipalayam", "Perundurai", "Sathyamangalam", "Anthiyur", "Modakkurichi", "Kodumudi", "Thalavadi"],
      },
      {
        name: "Tiruppur",
        taluks: ["Tiruppur North", "Tiruppur South", "Avinashi", "Dharapuram", "Kangeyam", "Madathukulam", "Palladam", "Udumalaipettai", "Uthukuli"],
      },
      {
        name: "Vellore",
        taluks: ["Vellore", "Katpadi", "Anaicut", "Gudiyatham", "Pernambut", "K.V. Kuppam"],
      },
      {
        name: "Thanjavur",
        taluks: ["Thanjavur", "Kumbakonam", "Papanasam", "Pattukkottai", "Orathanadu", "Peravurani", "Thiruvaiyaru", "Budalur", "Thiruvidaimarudur"],
      },
      {
        name: "Kanniyakumari",
        taluks: ["Agastheeswaram", "Thovalai", "Kalkulam", "Vilavancode", "Killiyoor", "Thiruvattar"],
      },
      {
        name: "Dindigul",
        taluks: ["Dindigul East", "Dindigul West", "Athoor", "Kodaikanal", "Natham", "Nilakottai", "Oddanchatram", "Palani", "Vedasandur"],
      },
      {
        name: "Cuddalore",
        taluks: ["Cuddalore", "Chidambaram", "Panruti", "Vriddhachalam", "Bhuvanagiri", "Kattumannarkoil", "Kurinjipadi", "Srimushnam", "Tittakudi", "Veppur"],
      },
      {
        name: "Dharmapuri",
        taluks: ["Dharmapuri", "Harur", "Palacode", "Pennagaram", "Pappireddipatti", "Karimangalam", "Nallampalli"],
      },
      {
        name: "Karur",
        taluks: ["Karur", "Aravakurichi", "Kulithalai", "Krishnarayapuram", "Kadavur", "Manmangalam", "Pugalur"],
      },
      {
        name: "Krishnagiri",
        taluks: ["Krishnagiri", "Hosur", "Pochampalli", "Uthangarai", "Denkanikottai", "Bargur", "Shoolagiri", "Anchetty"],
      },
      {
        name: "Nagapattinam",
        taluks: ["Nagapattinam", "Kilvelur", "Thirukkuvalai", "Vedaranyam"],
      },
      {
        name: "Namakkal",
        taluks: ["Namakkal", "Rasipuram", "Tiruchengode", "Paramathi Velur", "Kolli Hills", "Sendamangalam", "Kumarapalayam", "Mohanur"],
      },
      {
        name: "Perambalur",
        taluks: ["Perambalur", "Kunnam", "Veppanthattai", "Alathur"],
      },
      {
        name: "Pudukkottai",
        taluks: ["Pudukkottai", "Alangudi", "Aranthangi", "Avudiyarkoil", "Gandarvakottai", "Iluppur", "Karambakkudi", "Kulathur", "Manamelkudi", "Ponnamaravathi", "Thirumayam", "Viralimalai"],
      },
      {
        name: "Ramanathapuram",
        taluks: ["Ramanathapuram", "Kadaladi", "Kamuthi", "Mudukulathur", "Paramakudi", "Rajasingamangalam", "Rameswaram", "Tiruvadanai", "Keelakarai"],
      },
      {
        name: "Ranipet",
        taluks: ["Ranipet", "Walajah", "Arcot", "Arakkonam", "Nemili", "Kalavai"],
      },
      {
        name: "Sivaganga",
        taluks: ["Sivaganga", "Karaikudi", "Devakottai", "Manamadurai", "Ilayangudi", "Kalaiyarkoil", "Singampunari", "Tirupathur", "Tirupuvanam"],
      },
      {
        name: "Tenkasi",
        taluks: ["Tenkasi", "Sankarankovil", "Ambasamudram", "Kadayanallur", "Shenkottai", "Sivagiri", "Thiruvengadam", "Alangulam", "Veerakeralampudur"],
      },
      {
        name: "The Nilgiris",
        taluks: ["Udhagamandalam", "Coonoor", "Kotagiri", "Gudalur", "Kundah", "Pandalur"],
      },
      {
        name: "Theni",
        taluks: ["Theni", "Bodinayakanur", "Periyakulam", "Uthamapalayam", "Aundipatti"],
      },
      {
        name: "Thiruvallur",
        taluks: ["Thiruvallur", "Avadi", "Ponneri", "Gummidipoondi", "Poonamallee", "Tiruttani", "Uthukkottai", "Pallipattu", "R.K. Pet"],
      },
      {
        name: "Thiruvarur",
        taluks: ["Thiruvarur", "Kudavasal", "Mannargudi", "Nannilam", "Needamangalam", "Thiruthuraipoondi", "Valangaiman", "Koothanallur"],
      },
      {
        name: "Thoothukudi",
        taluks: ["Thoothukudi", "Kovilpatti", "Tiruchendur", "Ettayapuram", "Ottapidaram", "Srivaikuntam", "Vilathikulam", "Kayathar", "Eral", "Sathankulam"],
      },
      {
        name: "Tirupathur",
        taluks: ["Tirupathur", "Ambur", "Vaniyambadi", "Natrampalli"],
      },
      {
        name: "Tiruvannamalai",
        taluks: ["Tiruvannamalai", "Arani", "Cheyyar", "Polur", "Chengam", "Vandavasi", "Kalasapakkam", "Kilpennathur", "Chetpet", "Jamunamarathur", "Thandrampet", "Vembakkam"],
      },
      {
        name: "Viluppuram",
        taluks: ["Viluppuram", "Gingee", "Tindivanam", "Vanur", "Vikravandi", "Kandachipuram", "Marakkanam", "Melmalayanur", "Thiruvennainallur"],
      },
      {
        name: "Virudhunagar",
        taluks: ["Virudhunagar", "Aruppukkottai", "Kariapatti", "Rajapalayam", "Sathur", "Sivakasi", "Srivilliputhur", "Tiruchuli", "Vembakottai", "Watrap"],
      },
      {
        name: "Kallakurichi",
        taluks: ["Kallakurichi", "Chinnasalem", "Kalvarayan Hills", "Sankarapuram", "Tirukoilur", "Ulundurpet"],
      },
      {
        name: "Mayiladuthurai",
        taluks: ["Mayiladuthurai", "Kuthalam", "Sirkazhi", "Tharangambadi"],
      },
    ],
  },
  {
    name: "Kerala",
    type: "state",
    districts: [
      {
        name: "Thiruvananthapuram",
        taluks: ["Thiruvananthapuram", "Neyyattinkara", "Nedumangad", "Chirayinkeezhu", "Varkala", "Kattakkada"],
      },
      {
        name: "Ernakulam",
        taluks: ["Kochi", "Kanayannur", "Aluva", "Paravur", "Kunnathunad", "Muvattupuzha", "Kothamangalam"],
      },
      {
        name: "Kozhikode",
        taluks: ["Kozhikode", "Vadakara", "Quilandy", "Thamarassery"],
      },
      {
        name: "Thrissur",
        taluks: ["Thrissur", "Chalakudy", "Chavakkad", "Kodungallur", "Mukundapuram", "Thalapilly"],
      },
      {
        name: "Kollam",
        taluks: ["Kollam", "Karunagappally", "Kunnathur", "Kottarakkara", "Pathanapuram", "Punalur"],
      },
      {
        name: "Alappuzha",
        taluks: ["Ambalappuzha", "Chengannur", "Cherthala", "Karthikappally", "Kuttanad", "Mavelikkara"],
      },
      {
        name: "Kottayam",
        taluks: ["Kottayam", "Changanassery", "Kanjirappally", "Meenachil", "Vaikom"],
      },
      {
        name: "Idukki",
        taluks: ["Devikulam", "Peermade", "Udumbanchola", "Thodupuzha", "Idukki"],
      },
      {
        name: "Palakkad",
        taluks: ["Palakkad", "Alathur", "Chittur", "Mannarkkad", "Ottappalam", "Pattambi"],
      },
      {
        name: "Malappuram",
        taluks: ["Eranad", "Kondotty", "Nilambur", "Perinthalmanna", "Ponnani", "Tirur", "Tirurangadi"],
      },
      {
        name: "Wayanad",
        taluks: ["Mananthavady", "Sultan Bathery", "Vythiri"],
      },
      {
        name: "Kannur",
        taluks: ["Kannur", "Taliparamba", "Thalassery", "Iritty", "Payyanur"],
      },
      {
        name: "Kasaragod",
        taluks: ["Kasaragod", "Hosdurg", "Manjeshwaram", "Vellarikundu"],
      },
      {
        name: "Pathanamthitta",
        taluks: ["Adoor", "Konni", "Kozhencherry", "Mallappally", "Ranni", "Thiruvalla"],
      },
    ],
  },
  {
    name: "Gujarat",
    type: "state",
    districts: [
      {
        name: "Ahmedabad",
        taluks: ["Ahmedabad City", "Daskroi", "Dholka", "Sanand", "Bavla", "Dhandhuka", "Mandal", "Detroj-Rampura", "Viramgam"],
      },
      {
        name: "Surat",
        taluks: ["Surat City", "Chorasi", "Bardoli", "Kamrej", "Olpad", "Mangrol", "Mahuva", "Mandvi", "Palsana", "Umarpada"],
      },
      {
        name: "Vadodara",
        taluks: ["Vadodara", "Padra", "Karjan", "Savli", "Vaghodia", "Dabhoi", "Sinor", "Desar"],
      },
      {
        name: "Rajkot",
        taluks: ["Rajkot", "Gondal", "Jetpur", "Dhoraji", "Upleta", "Kotda Sangani", "Lodhika", "Paddhari", "Jasdan", "Vinchhiya"],
      },
      {
        name: "Gandhinagar",
        taluks: ["Gandhinagar", "Kalol", "Dehgam", "Mansa"],
      },
      {
        name: "Bhavnagar",
        taluks: ["Bhavnagar", "Sihor", "Palitana", "Talaja", "Mahuva", "Gariadhar", "Vallabhipur", "Umrala", "Jesar"],
      },
      {
        name: "Jamnagar",
        taluks: ["Jamnagar", "Dhrol", "Jodiya", "Kalavad", "Lalpur", "Jamjodhpur"],
      },
      {
        name: "Junagadh",
        taluks: ["Junagadh City", "Junagadh Rural", "Keshod", "Mangrol", "Manavadar", "Malia Hatina", "Bhesan", "Visavadar", "Mendarda"],
      },
      {
        name: "Kachchh",
        taluks: ["Bhuj", "Anjar", "Gandhidham", "Mandvi", "Mundra", "Nakhatrana", "Abdasa", "Lakhpat", "Rapar", "Bhachau"],
      },
      {
        name: "Anand",
        taluks: ["Anand", "Borsad", "Khambhat", "Petlad", "Sojitra", "Tarapur", "Umreth", "Anklav"],
      },
    ],
  },
  {
    name: "Uttar Pradesh",
    type: "state",
    districts: [
      {
        name: "Lucknow",
        taluks: ["Lucknow Sadar", "Bakshi Ka Talab", "Malihabad", "Mohanlalganj", "Sarojini Nagar"],
      },
      {
        name: "Kanpur Nagar",
        taluks: ["Kanpur Sadar", "Bilhaur", "Ghatampur", "Narwal"],
      },
      {
        name: "Varanasi",
        taluks: ["Varanasi Sadar", "Pindra", "Raja Talab"],
      },
      {
        name: "Gautam Buddha Nagar",
        taluks: ["Noida", "Greater Noida / Dadri", "Jewar"],
      },
      {
        name: "Ghaziabad",
        taluks: ["Ghaziabad Sadar", "Modinagar", "Loni"],
      },
      {
        name: "Agra",
        taluks: ["Agra Sadar", "Etmadpur", "Fatehabad", "Kheragarh", "Bah"],
      },
      {
        name: "Prayagraj",
        taluks: ["Sadar", "Phulpur", "Koraon", "Meja", "Bara", "Karchhana", "Soraon", "Handia"],
      },
      {
        name: "Meerut",
        taluks: ["Meerut Sadar", "Mawana", "Sardhana"],
      },
      {
        name: "Gorakhpur",
        taluks: ["Gorakhpur Sadar", "Bansgaon", "Campierganj", "Chauri Chaura", "Gola", "Khajani", "Sahjanwa"],
      },
      {
        name: "Bareilly",
        taluks: ["Bareilly Sadar", "Aonla", "Baheri", "Faridpur", "Meerganj", "Nawabganj"],
      },
      {
        name: "Aligarh",
        taluks: ["Koil / Aligarh Sadar", "Atrauli", "Khair", "Iglas", "Gabhana"],
      },
    ],
  },
  {
    name: "Rajasthan",
    type: "state",
    districts: [
      {
        name: "Jaipur",
        taluks: ["Jaipur", "Amber", "Sanganer", "Bassí", "Chaksu", "Chomu", "Phulera", "Kotputli", "Shahpura", "Viratnagar"],
      },
      {
        name: "Jodhpur",
        taluks: ["Jodhpur", "Bilara", "Bhopalgarh", "Luni", "Osian", "Phalodi", "Shergarh", "Balesar"],
      },
      {
        name: "Udaipur",
        taluks: ["Girwa / Udaipur", "Badgaon", "Gogunda", "Kotra", "Jhadol", "Kherwara", "Mavli", "Salumbar", "Vallabhnagar"],
      },
      {
        name: "Kota",
        taluks: ["Ladpura / Kota", "Digod", "Itawa", "Kanwas", "Pipalda", "Ramganj Mandi"],
      },
      {
        name: "Ajmer",
        taluks: ["Ajmer", "Beawar", "Kekri", "Kishangarh", "Nasirabad", "Peesangan", "Sarwar"],
      },
      {
        name: "Bikaner",
        taluks: ["Bikaner", "Kolayat", "Lunkaransar", "Nokha", "Poogal", "Khajuwala", "Dungargarh"],
      },
    ],
  },
  {
    name: "Telangana",
    type: "state",
    districts: [
      {
        name: "Hyderabad",
        taluks: ["Secunderabad", "Khairatabad", "Charminar", "Golconda", "Musheerabad", "Asifnagar", "Shaikpet", "Nampally"],
      },
      {
        name: "Medchal-Malkajgiri",
        taluks: ["Malkajgiri", "Alwal", "Kukatpally", "Medchal", "Quthbullapur", "Ghatkesar", "Keesara"],
      },
      {
        name: "Rangareddy",
        taluks: ["Rajendranagar", "Serilingampally", "Saroornagar", "Ibrahimpatnam", "Maheshwaram", "Chevella", "Shadnagar"],
      },
      {
        name: "Warangal",
        taluks: ["Warangal", "Khila Warangal", "Narsampet", "Wardhannapet"],
      },
      {
        name: "Karimnagar",
        taluks: ["Karimnagar", "Huzurabad", "Jammikunta", "Manakondur", "Choppadandi"],
      },
    ],
  },
  {
    name: "Andhra Pradesh",
    type: "state",
    districts: [
      {
        name: "Visakhapatnam",
        taluks: ["Visakhapatnam Urban", "Visakhapatnam Rural", "Bheemunipatnam", "Gajuwaka", "Anandapuram"],
      },
      {
        name: "NTR (Vijayawada)",
        taluks: ["Vijayawada Urban", "Vijayawada Rural", "Ibrahimpatnam", "Jaggayyapeta", "Nandigama", "Tiruvuru"],
      },
      {
        name: "Guntur",
        taluks: ["Guntur Urban", "Guntur Rural", "Tenali", "Mangalagiri", "Tadikonda", "Ponnur"],
      },
      {
        name: "Tirupati",
        taluks: ["Tirupati Urban", "Tirupati Rural", "Chandragiri", "Srikalahasti", "Gudur", "Sullurpeta"],
      },
    ],
  },
  {
    name: "West Bengal",
    type: "state",
    districts: [
      {
        name: "Kolkata",
        taluks: ["Kolkata North", "Kolkata South", "Kolkata Central", "Jadavpur", "Behala", "Port"],
      },
      {
        name: "North 24 Parganas",
        taluks: ["Barasat", "Barrackpore", "Bidhannagar", "Basirhat", "Bangaon"],
      },
      {
        name: "South 24 Parganas",
        taluks: ["Alipore", "Baruipur", "Canning", "Diamond Harbour", "Kakdwip"],
      },
      {
        name: "Howrah",
        taluks: ["Howrah Sadar", "Uluberia"],
      },
      {
        name: "Darjeeling",
        taluks: ["Darjeeling Sadar", "Kurseong", "Mirik", "Siliguri"],
      },
    ],
  },
  {
    name: "Madhya Pradesh",
    type: "state",
    districts: [
      { name: "Bhopal", taluks: ["Bhopal City", "Huzur", "Berasia", "Kolar"] },
      { name: "Indore", taluks: ["Indore City", "Sanwer", "Depalpur", "Mhow", "Hatod"] },
      { name: "Gwalior", taluks: ["Gwalior", "Dabra", "Bhitarwar", "Chinour"] },
      { name: "Jabalpur", taluks: ["Jabalpur", "Sihora", "Patan", "Panagar", "Kundam", "Shahpura"] },
    ],
  },
  {
    name: "Bihar",
    type: "state",
    districts: [
      { name: "Patna", taluks: ["Patna Sadar", "Danapur", "Barh", "Masaurhi", "Paliganj", "Bikram"] },
      { name: "Gaya", taluks: ["Gaya Sadar", "Tekari", "Sherghati", "Neemchak Bathani"] },
      { name: "Muzaffarpur", taluks: ["Muzaffarpur East", "Muzaffarpur West", "Kanti", "Motipur", "Paroo"] },
      { name: "Bhagalpur", taluks: ["Bhagalpur Sadar", "Kahalgaon", "Naugachhia", "Sultanganj"] },
    ],
  },
  {
    name: "Punjab",
    type: "state",
    districts: [
      { name: "Ludhiana", taluks: ["Ludhiana East", "Ludhiana West", "Jagraon", "Khanna", "Samrala", "Payal", "Raikot"] },
      { name: "Amritsar", taluks: ["Amritsar-I", "Amritsar-II", "Ajnala", "Baba Bakala", "Majitha"] },
      { name: "Jalandhar", taluks: ["Jalandhar-I", "Jalandhar-II", "Nakodar", "Phillaur", "Shahkot"] },
      { name: "Patiala", taluks: ["Patiala", "Nabha", "Rajpura", "Samana", "Patran", "Dudhan Sadhan"] },
    ],
  },
  {
    name: "Haryana",
    type: "state",
    districts: [
      { name: "Gurugram", taluks: ["Gurugram", "Sohna", "Pataudi", "Badshahpur", "Manesar", "Wazirabad"] },
      { name: "Faridabad", taluks: ["Faridabad", "Ballabgarh", "Badkhal", "Dhauj", "Mohna", "Tigaon"] },
      { name: "Panchkula", taluks: ["Panchkula", "Kalka", "Raipur Rani"] },
      { name: "Karnal", taluks: ["Karnal", "Assandh", "Gharaunda", "Indri", "Nilokheri"] },
    ],
  },
  {
    name: "Odisha",
    type: "state",
    districts: [
      { name: "Khurda (Bhubaneswar)", taluks: ["Bhubaneswar", "Khurda", "Jatni", "Banapur", "Begunia", "Bolagarh", "Tangi", "Chilika"] },
      { name: "Cuttack", taluks: ["Cuttack Sadar", "Choudwar", "Athagarh", "Banki", "Salepur", "Baramba", "Niali"] },
      { name: "Puri", taluks: ["Puri Sadar", "Konark", "Pipili", "Nimapada", "Kakatpur", "Brahmagiri", "Krushnaprasad"] },
    ],
  },
  {
    name: "Assam",
    type: "state",
    districts: [
      { name: "Kamrup Metropolitan (Guwahati)", taluks: ["Guwahati", "Dispur", "Sonapur", "Azara", "Chandrapur"] },
      { name: "Dibrugarh", taluks: ["Dibrugarh West", "Dibrugarh East", "Chabua", "Naharkatia", "Tingkhong", "Moran"] },
      { name: "Cachar (Silchar)", taluks: ["Silchar", "Sonai", "Katigorah", "Lakhipur", "Udarbond"] },
    ],
  },
  {
    name: "Chhattisgarh",
    type: "state",
    districts: [
      { name: "Raipur", taluks: ["Raipur", "Arang", "Abhanpur", "Tilda Newra"] },
      { name: "Durg", taluks: ["Durg", "Bhilai", "Patan", "Dhamdha"] },
      { name: "Bilaspur", taluks: ["Bilaspur", "Bilha", "Kota", "Masturi", "Takhatpur"] },
    ],
  },
  {
    name: "Jharkhand",
    type: "state",
    districts: [
      { name: "Ranchi", taluks: ["Ranchi Sadar", "Kanke", "Namkum", "Ormanjhi", "Ratu", "Bundu", "Silli"] },
      { name: "East Singhbhum (Jamshedpur)", taluks: ["Jamshedpur / Golmuri", "Ghatshila", "Potka", "Patamda", "Baharagora", "Chakulia"] },
      { name: "Dhanbad", taluks: ["Dhanbad", "Jharia", "Baghmara", "Nirsa", "Govindpur", "Tundi", "Baliapur"] },
    ],
  },
  {
    name: "Uttarakhand",
    type: "state",
    districts: [
      { name: "Dehradun", taluks: ["Dehradun Sadar", "Rishikesh", "Vikasnagar", "Chakrata", "Kalsi", "Doiwala"] },
      { name: "Haridwar", taluks: ["Haridwar", "Roorkee", "Laksar", "Bhagwanpur"] },
      { name: "Nainital", taluks: ["Nainital", "Haldwani", "Ramnagar", "Kaladhungi", "Kosiya Kutauli", "Dhari"] },
    ],
  },
  {
    name: "Himachal Pradesh",
    type: "state",
    districts: [
      { name: "Shimla", taluks: ["Shimla Urban", "Shimla Rural", "Theog", "Rampur", "Rohru", "Chopal", "Jubbal", "Kotkhai"] },
      { name: "Kangra (Dharamshala)", taluks: ["Dharamshala", "Kangra", "Palampur", "Nurpur", "Dehra Gopipur", "Jawalamukhi", "Baijnath"] },
      { name: "Kullu", taluks: ["Kullu", "Manali", "Banjar", "Anni", "Nirmand"] },
    ],
  },
  {
    name: "Goa",
    type: "state",
    districts: [
      { name: "North Goa", taluks: ["Tiswadi (Panaji)", "Bardez (Mapusa)", "Pernem", "Bicholim", "Sattari"] },
      { name: "South Goa", taluks: ["Salcete (Margao)", "Mormugao (Vasco)", "Ponda", "Quepem", "Canacona", "Sanguem", "Dharbandora"] },
    ],
  },
  {
    name: "Tripura",
    type: "state",
    districts: [
      { name: "West Tripura", taluks: ["Agartala / Sadar", "Mohanpur", "Jirania", "Mandai"] },
      { name: "Gomati", taluks: ["Udaipur", "Amarpur", "Karbook"] },
      { name: "Dhalai", taluks: ["Ambassa", "Kamalpur", "Gandacherra", "Longtharai Valley"] },
    ],
  },
  {
    name: "Meghalaya",
    type: "state",
    districts: [
      { name: "East Khasi Hills (Shillong)", taluks: ["Mylliem (Shillong)", "Mawphlang", "Sohra (Cherrapunji)", "Pynursla", "Mawsynram"] },
      { name: "West Garo Hills (Tura)", taluks: ["Tura / Rongram", "Dalu", "Gambegre", "Tikrikilla"] },
    ],
  },
  {
    name: "Manipur",
    type: "state",
    districts: [
      { name: "Imphal West", taluks: ["Imphal", "Lamphelpat", "Patsoi", "Wangoi"] },
      { name: "Imphal East", taluks: ["Porompat", "Keirao Bitra", "Sawombung"] },
    ],
  },
  {
    name: "Nagaland",
    type: "state",
    districts: [
      { name: "Kohima", taluks: ["Kohima Sadar", "Sechu-Zubza", "Chiephobozou", "Jakhama"] },
      { name: "Dimapur", taluks: ["Dimapur Sadar", "Chumukedima", "Niuland", "Medziphema"] },
    ],
  },
  {
    name: "Mizoram",
    type: "state",
    districts: [
      { name: "Aizawl", taluks: ["Aizawl Sadar", "Tlangnuam", "Thingsulthliah", "Darlawn"] },
      { name: "Lunglei", taluks: ["Lunglei", "Hnahthial", "Bunghmun", "Lungsen"] },
    ],
  },
  {
    name: "Arunachal Pradesh",
    type: "state",
    districts: [
      { name: "Papum Pare (Itanagar)", taluks: ["Itanagar", "Naharlagun", "Doimukh", "Balijan", "Sagalee"] },
      { name: "Changlang", taluks: ["Changlang", "Miao", "Jairampur", "Bordumsa"] },
    ],
  },
  {
    name: "Sikkim",
    type: "state",
    districts: [
      { name: "East Sikkim (Gangtok)", taluks: ["Gangtok", "Pakyong", "Rongli"] },
      { name: "West Sikkim (Gyalshing)", taluks: ["Gyalshing", "Soreng", "Yuksom"] },
    ],
  },

  // ==========================================
  // UNION TERRITORIES (8)
  // ==========================================
  {
    name: "Delhi",
    type: "union_territory",
    districts: [
      {
        name: "New Delhi",
        taluks: ["Connaught Place", "Chanakyapuri", "Parliament Street"],
      },
      {
        name: "Central Delhi",
        taluks: ["Karol Bagh", "Kotwali", "Civil Lines"],
      },
      {
        name: "South Delhi",
        taluks: ["Hauz Khas", "Saket", "Mehrauli"],
      },
      {
        name: "South West Delhi",
        taluks: ["Dwarka", "Najafgarh", "Kapashera", "Delhi Cantonment"],
      },
      {
        name: "South East Delhi",
        taluks: ["Defense Colony", "Kalkaji", "Sarita Vihar"],
      },
      {
        name: "North Delhi",
        taluks: ["Model Town", "Alipur", "Narela"],
      },
      {
        name: "North West Delhi",
        taluks: ["Rohini", "Kanjhawala", "Saraswati Vihar"],
      },
      {
        name: "West Delhi",
        taluks: ["Patel Nagar", "Punjabi Bagh", "Rajouri Garden"],
      },
      {
        name: "East Delhi",
        taluks: ["Gandhi Nagar", "Mayur Vihar", "Preet Vihar"],
      },
      {
        name: "Shahdara",
        taluks: ["Shahdara", "Seemapuri", "Vivek Vihar"],
      },
      {
        name: "North East Delhi",
        taluks: ["Karawal Nagar", "Seelampur", "Yamuna Vihar"],
      },
    ],
  },
  {
    name: "Chandigarh",
    type: "union_territory",
    districts: [
      {
        name: "Chandigarh",
        taluks: ["Chandigarh Sector 1-30", "Chandigarh Sector 31-60", "Manimajra"],
      },
    ],
  },
  {
    name: "Jammu and Kashmir",
    type: "union_territory",
    districts: [
      { name: "Srinagar", taluks: ["Srinagar South", "Srinagar North", "Pantha Chowk", "Khanyar", "Eidgah"] },
      { name: "Jammu", taluks: ["Jammu", "Jammu South", "Jammu West", "Bahu", "R.S. Pura", "Bishnah", "Akhnoor"] },
      { name: "Anantnag", taluks: ["Anantnag", "Bijbehara", "Dooru", "Kokernag", "Pahalgam", "Shangus"] },
      { name: "Baramulla", taluks: ["Baramulla", "Sopore", "Pattan", "Tangmarg", "Uri", "Kreeri"] },
    ],
  },
  {
    name: "Ladakh",
    type: "union_territory",
    districts: [
      { name: "Leh", taluks: ["Leh", "Nubra", "Khaltse", "Nyoma", "Durbuk", "Kharu"] },
      { name: "Kargil", taluks: ["Kargil", "Zanskar", "Sankoo", "Drass", "Shakar Chiktan"] },
    ],
  },
  {
    name: "Puducherry",
    type: "union_territory",
    districts: [
      { name: "Puducherry", taluks: ["Puducherry", "Oulgaret", "Villianur", "Bahour"] },
      { name: "Karaikal", taluks: ["Karaikal", "Thirunallar", "Nedungadu", "Kottucherry"] },
      { name: "Mahe", taluks: ["Mahe"] },
      { name: "Yanam", taluks: ["Yanam"] },
    ],
  },
  {
    name: "Andaman and Nicobar Islands",
    type: "union_territory",
    districts: [
      { name: "South Andaman", taluks: ["Port Blair", "Ferrargunj", "Little Andaman"] },
      { name: "North and Middle Andaman", taluks: ["Diglipur", "Mayabunder", "Rangat"] },
      { name: "Nicobar", taluks: ["Car Nicobar", "Nancowry", "Great Nicobar"] },
    ],
  },
  {
    name: "Dadra and Nagar Haveli and Daman and Diu",
    type: "union_territory",
    districts: [
      { name: "Dadra and Nagar Haveli", taluks: ["Silvassa", "Khanvel"] },
      { name: "Daman", taluks: ["Daman"] },
      { name: "Diu", taluks: ["Diu"] },
    ],
  },
  {
    name: "Lakshadweep",
    type: "union_territory",
    districts: [
      { name: "Lakshadweep", taluks: ["Kavaratti", "Agatti", "Amini", "Andrott", "Minicoy", "Kalpeni"] },
    ],
  },
];

// Helper Functions
export function getStates(): string[] {
  return GEO_HIERARCHY.map((s) => s.name);
}

export function getDistricts(stateName: string): string[] {
  const state = GEO_HIERARCHY.find(
    (s) => s.name.toLowerCase() === stateName.toLowerCase().trim()
  );
  return state ? state.districts.map((d) => d.name) : [];
}

export function getTaluks(stateName: string, districtName: string): string[] {
  const state = GEO_HIERARCHY.find(
    (s) => s.name.toLowerCase() === stateName.toLowerCase().trim()
  );
  if (!state) return [];
  const district = state.districts.find(
    (d) => d.name.toLowerCase() === districtName.toLowerCase().trim()
  );
  return district ? [...district.taluks] : [];
}

export function isValidTaluk(state: string, district: string, taluk: string): boolean {
  const taluks = getTaluks(state, district);
  return taluks.some((t) => t.toLowerCase() === taluk.toLowerCase().trim());
}

/**
 * Fuzzy match geographic address parts against official LGD directory.
 * Translates Nominatim reverse geocode output into exact LGD selectors.
 */
export function matchAddressToLgd(addressDetails: {
  state?: string;
  county?: string;
  state_district?: string;
  district?: string;
  city?: string;
  town?: string;
  village?: string;
  suburb?: string;
  subdistrict?: string;
}): { state: string; district: string; taluk: string; confidence: "high" | "approximate" | "fallback" } {
  // 1. Match State
  let matchedState = GEO_HIERARCHY.find((s) => {
    if (!addressDetails.state) return false;
    const sName = s.name.toLowerCase();
    const qState = addressDetails.state.toLowerCase();
    return sName === qState || qState.includes(sName) || sName.includes(qState);
  });

  // Default to Karnataka if not matched (primary demo state)
  if (!matchedState) {
    matchedState = GEO_HIERARCHY.find((s) => s.name === "Karnataka")!;
  }

  // 2. Match District within the matched state
  const districtQuery = (
    addressDetails.district ||
    addressDetails.state_district ||
    addressDetails.county ||
    addressDetails.city ||
    ""
  ).toLowerCase();

  let matchedDistrict = matchedState.districts.find((d) => {
    const dName = d.name.toLowerCase();
    return (
      dName === districtQuery ||
      districtQuery.includes(dName) ||
      dName.includes(districtQuery)
    );
  });

  if (!matchedDistrict) {
    matchedDistrict = matchedState.districts[0];
  }

  // 3. Match Taluk within the matched district
  const talukCandidates = [
    addressDetails.subdistrict,
    addressDetails.suburb,
    addressDetails.town,
    addressDetails.village,
    addressDetails.city,
  ].filter(Boolean) as string[];

  let matchedTaluk: string | undefined;

  for (const candidate of talukCandidates) {
    const cLower = candidate.toLowerCase();
    matchedTaluk = matchedDistrict.taluks.find((t) => {
      const tLower = t.toLowerCase();
      return tLower === cLower || cLower.includes(tLower) || tLower.includes(cLower);
    });
    if (matchedTaluk) break;
  }

  // If taluk wasn't matched directly in that district, scan other districts in the state
  if (!matchedTaluk && talukCandidates.length > 0) {
    for (const d of matchedState.districts) {
      for (const candidate of talukCandidates) {
        const cLower = candidate.toLowerCase();
        const found = d.taluks.find((t) => {
          const tLower = t.toLowerCase();
          return tLower === cLower || cLower.includes(tLower) || tLower.includes(cLower);
        });
        if (found) {
          matchedDistrict = d;
          matchedTaluk = found;
          break;
        }
      }
      if (matchedTaluk) break;
    }
  }

  const finalTaluk = matchedTaluk || matchedDistrict.taluks[0] || "Puttur";

  return {
    state: matchedState.name,
    district: matchedDistrict.name,
    taluk: finalTaluk,
    confidence: matchedTaluk ? "high" : "approximate",
  };
}

/**
 * Offline reverse geocoder fallback using coordinate bounding centers.
 * Ensures instant, reliable demonstration even without external internet / rate limits.
 */
export function resolveOfflineLocation(lat: number, lng: number): {
  state: string;
  district: string;
  taluk: string;
  city: string;
  landmark: string;
  address: string;
} {
  // Puttur bounding approximation (Lat ~12.7 to 12.8, Lng ~75.1 to 75.3)
  if (lat >= 12.70 && lat <= 12.82 && lng >= 75.12 && lng <= 75.30) {
    return {
      state: "Karnataka",
      district: "Dakshina Kannada",
      taluk: "Puttur",
      city: "Puttur",
      landmark: "Near Mahalingeshwara Temple / Court Hill",
      address: "Main Market Road, Puttur Town",
    };
  }

  // Mangaluru bounding approximation (Lat ~12.82 to 12.98, Lng ~74.78 to 74.95)
  if (lat >= 12.82 && lat <= 12.98 && lng >= 74.78 && lng <= 74.95) {
    return {
      state: "Karnataka",
      district: "Dakshina Kannada",
      taluk: "Mangaluru",
      city: "Mangaluru",
      landmark: "Near Hampankatta Circle / City Centre",
      address: "K.S. Rao Road, Hampankatta",
    };
  }

  // Bengaluru bounding approximation (Lat ~12.85 to 13.15, Lng ~77.45 to 77.75)
  if (lat >= 12.85 && lat <= 13.15 && lng >= 77.45 && lng <= 77.75) {
    return {
      state: "Karnataka",
      district: "Bengaluru Urban",
      taluk: "Bengaluru South",
      city: "Bengaluru",
      landmark: "Near MG Road / Brigade Junction",
      address: "Residency Road, Ward 111",
    };
  }

  // New Delhi bounding approximation (Lat ~28.50 to 28.75, Lng ~77.10 to 77.30)
  if (lat >= 28.50 && lat <= 28.75 && lng >= 77.10 && lng <= 77.30) {
    return {
      state: "Delhi",
      district: "New Delhi",
      taluk: "Connaught Place",
      city: "New Delhi",
      landmark: "Near Outer Circle / Barakhamba Road",
      address: "Block B, Connaught Place",
    };
  }

  // Mumbai bounding approximation (Lat ~18.90 to 19.30, Lng ~72.75 to 73.05)
  if (lat >= 18.90 && lat <= 19.30 && lng >= 72.75 && lng <= 73.05) {
    return {
      state: "Maharashtra",
      district: "Mumbai Suburban",
      taluk: "Bandra",
      city: "Mumbai",
      landmark: "Near Bandra Railway Station West",
      address: "Hill Road, Bandra West",
    };
  }

  // Default fallback to Puttur (Primary Demo Center)
  return {
    state: "Karnataka",
    district: "Dakshina Kannada",
    taluk: "Puttur",
    city: "Puttur",
    landmark: "Puttur Town Municipality Zone",
    address: "Town Center Road",
  };
}
