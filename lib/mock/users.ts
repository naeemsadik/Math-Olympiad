import type { Tier, InstitutionType } from "@/types";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  dept: string;
  institute: string;
  tier: Tier;
  level: string;
  xp: number;
  streak: number;
  testsTaken: number;
  avgScore: number;
  joinedAt: string;
  status: "active" | "inactive";
  institutionType?: InstitutionType;
  classYear?: string;
  whatsapp?: string;
  password?: string;
}

export const mockUsers: AdminUser[] = [
  // ── Advanced — University students ──────────────────────────────────
  { id: "u1",  name: "Adnan Chowdhury",   email: "adnan.cse@uiu.ac.bd",     dept: "CSE",  institute: "UIU",                       tier: "Advanced",     level: "Grandmaster",  xp: 5120, streak: 42, testsTaken: 98, avgScore: 91, joinedAt: "Jan 2024", status: "active",   institutionType: "University", classYear: "3rd Year" },
  { id: "u2",  name: "Sarah Jubaida",     email: "sarah.eee@buet.ac.bd",    dept: "EEE",  institute: "BUET",                      tier: "Advanced",     level: "Grandmaster",  xp: 4984, streak: 38, testsTaken: 87, avgScore: 89, joinedAt: "Jan 2024", status: "active",   institutionType: "University", classYear: "4th Year" },
  { id: "u3",  name: "Rahat Khan",        email: "rahat.cse@uiu.ac.bd",     dept: "CSE",  institute: "UIU",                       tier: "Advanced",     level: "Prime Master", xp: 4701, streak: 30, testsTaken: 76, avgScore: 85, joinedAt: "Feb 2024", status: "active",   institutionType: "University", classYear: "2nd Year" },
  { id: "u4",  name: "Nadia Islam",       email: "nadia.math@du.ac.bd",     dept: "Math", institute: "DU",                        tier: "Advanced",     level: "Prime Master", xp: 4520, streak: 27, testsTaken: 71, avgScore: 83, joinedAt: "Feb 2024", status: "active",   institutionType: "University", classYear: "4th Year" },
  { id: "u13", name: "Arman Hossain",     email: "arman.cse@kuet.ac.bd",    dept: "CSE",  institute: "KUET",                      tier: "Advanced",     level: "Expert",       xp: 4350, streak: 25, testsTaken: 68, avgScore: 82, joinedAt: "Feb 2024", status: "active",   institutionType: "University", classYear: "3rd Year" },
  { id: "u14", name: "Priya Chowdhury",   email: "priya.eee@cuet.ac.bd",    dept: "EEE",  institute: "CUET",                      tier: "Advanced",     level: "Expert",       xp: 4210, streak: 20, testsTaken: 61, avgScore: 80, joinedAt: "Mar 2024", status: "active",   institutionType: "University", classYear: "2nd Year" },
  { id: "u15", name: "Zafar Iqbal",       email: "zafar.math@sust.edu",     dept: "Math", institute: "SUST",                      tier: "Advanced",     level: "Advanced",     xp: 4050, streak: 17, testsTaken: 55, avgScore: 78, joinedAt: "Mar 2024", status: "active",   institutionType: "University", classYear: "1st Year" },
  { id: "u21", name: "Imtiaz Ahmed",      email: "imtiaz.cse@ruet.ac.bd",   dept: "CSE",  institute: "RUET",                      tier: "Advanced",     level: "Advanced",     xp: 3920, streak: 14, testsTaken: 50, avgScore: 76, joinedAt: "Mar 2024", status: "active",   institutionType: "University", classYear: "3rd Year" },
  { id: "u22", name: "Tania Sultana",     email: "tania.eee@aust.edu.bd",   dept: "EEE",  institute: "AUST",                      tier: "Advanced",     level: "Advanced",     xp: 3780, streak: 12, testsTaken: 46, avgScore: 74, joinedAt: "Apr 2024", status: "active",   institutionType: "University", classYear: "2nd Year" },
  { id: "u23", name: "Riyadh Islam",      email: "riyadh.math@iub.edu.bd",  dept: "Math", institute: "IUB",                       tier: "Advanced",     level: "Intermediate", xp: 3550, streak: 9,  testsTaken: 39, avgScore: 70, joinedAt: "Apr 2024", status: "active",   institutionType: "University", classYear: "1st Year" },
  // ── Intermediate — College students ─────────────────────────────────
  { id: "u5",  name: "Fahim Hossain",     email: "fahim.hossain@gmail.com", dept: "CSE",  institute: "Dhaka City College",         tier: "Intermediate", level: "Expert",       xp: 4310, streak: 22, testsTaken: 65, avgScore: 80, joinedAt: "Mar 2024", status: "active",   institutionType: "College",    classYear: "Class 12" },
  { id: "u6",  name: "Lamia Akter",       email: "lamia.akter@gmail.com",   dept: "EEE",  institute: "Notre Dame College",         tier: "Intermediate", level: "Expert",       xp: 4198, streak: 19, testsTaken: 59, avgScore: 78, joinedAt: "Mar 2024", status: "active",   institutionType: "College",    classYear: "Class 12" },
  { id: "u7",  name: "Tahmid Reza",       email: "tahmid.reza@gmail.com",   dept: "CSE",  institute: "Rajshahi College",           tier: "Intermediate", level: "Advanced",     xp: 3975, streak: 15, testsTaken: 52, avgScore: 75, joinedAt: "Mar 2024", status: "active",   institutionType: "College",    classYear: "Class 11" },
  { id: "u8",  name: "Rifat Ahmed",       email: "rifat.ahmed@gmail.com",   dept: "Math", institute: "Dhaka College",              tier: "Intermediate", level: "Advanced",     xp: 3820, streak: 12, testsTaken: 44, avgScore: 72, joinedAt: "Apr 2024", status: "active",   institutionType: "College",    classYear: "Class 12" },
  { id: "u16", name: "Sumaiya Begum",     email: "sumaiya.begum@gmail.com", dept: "Math", institute: "Adamjee Cantonment College", tier: "Intermediate", level: "Advanced",     xp: 3680, streak: 11, testsTaken: 40, avgScore: 71, joinedAt: "Apr 2024", status: "active",   institutionType: "College",    classYear: "Class 11" },
  { id: "u17", name: "Zarif Hasan",       email: "zarif.hasan@gmail.com",   dept: "CSE",  institute: "Comilla Victoria College",   tier: "Intermediate", level: "Intermediate", xp: 3500, streak: 8,  testsTaken: 35, avgScore: 69, joinedAt: "Apr 2024", status: "active",   institutionType: "College",    classYear: "Class 12" },
  { id: "u18", name: "Mehzabin Rahman",   email: "mehzabin.r@gmail.com",    dept: "EEE",  institute: "BAF Shaheen College",        tier: "Intermediate", level: "Intermediate", xp: 3340, streak: 6,  testsTaken: 28, avgScore: 66, joinedAt: "May 2024", status: "inactive", institutionType: "College",    classYear: "Class 11" },
  { id: "u24", name: "Nazmul Karim",      email: "nazmul.karim@gmail.com",  dept: "CSE",  institute: "Sylhet Govt College",        tier: "Intermediate", level: "Intermediate", xp: 3180, streak: 5,  testsTaken: 24, avgScore: 64, joinedAt: "May 2024", status: "active",   institutionType: "College",    classYear: "Class 12" },
  { id: "u25", name: "Jeba Akter",        email: "jeba.akter@gmail.com",    dept: "Math", institute: "Khulna BL College",          tier: "Intermediate", level: "Beginner",     xp: 2950, streak: 4,  testsTaken: 19, avgScore: 61, joinedAt: "May 2024", status: "active",   institutionType: "College",    classYear: "Class 11" },
  { id: "u26", name: "Kabir Hossain",     email: "kabir.hossain@gmail.com", dept: "EEE",  institute: "Birshreshtha Noor M College",tier: "Intermediate", level: "Beginner",     xp: 2700, streak: 3,  testsTaken: 14, avgScore: 58, joinedAt: "Jun 2024", status: "inactive", institutionType: "College",    classYear: "Class 12" },
  // ── Beginner — School students ───────────────────────────────────────
  { id: "u9",  name: "Maliha Sultana",    email: "maliha.sultana@gmail.com",dept: "CSE",  institute: "Viqarunnisa Noon School",    tier: "Beginner",     level: "Intermediate", xp: 3650, streak: 9,  testsTaken: 38, avgScore: 68, joinedAt: "Apr 2024", status: "inactive", institutionType: "School",     classYear: "Class 10" },
  { id: "u10", name: "Arif Hasan",        email: "arif.hasan@gmail.com",    dept: "EEE",  institute: "Rajuk Uttara Model College", tier: "Beginner",     level: "Intermediate", xp: 3401, streak: 7,  testsTaken: 31, avgScore: 65, joinedAt: "Apr 2024", status: "active",   institutionType: "School",     classYear: "Class 9"  },
  { id: "u11", name: "Tasnim Rahman",     email: "tasnim.rahman@gmail.com", dept: "Math", institute: "BAF Shaheen College",        tier: "Beginner",     level: "Beginner",     xp: 2100, streak: 4,  testsTaken: 20, avgScore: 58, joinedAt: "May 2024", status: "active",   institutionType: "School",     classYear: "Class 10" },
  { id: "u12", name: "Jubayer Siddique",  email: "jubayer.sid@gmail.com",   dept: "CSE",  institute: "Mymensingh Zilla School",    tier: "Beginner",     level: "Beginner",     xp: 1540, streak: 2,  testsTaken: 12, avgScore: 50, joinedAt: "May 2024", status: "inactive", institutionType: "School",     classYear: "Class 8"  },
  { id: "u19", name: "Afsana Khan",       email: "afsana.khan@gmail.com",   dept: "Math", institute: "Motijheel Model School",     tier: "Beginner",     level: "Beginner",     xp: 1820, streak: 3,  testsTaken: 15, avgScore: 54, joinedAt: "May 2024", status: "active",   institutionType: "School",     classYear: "Class 9"  },
  { id: "u20", name: "Rafiq Molla",       email: "rafiq.molla@gmail.com",   dept: "EEE",  institute: "Faujdarhat Cadet College",   tier: "Beginner",     level: "Beginner",     xp: 1210, streak: 1,  testsTaken: 8,  avgScore: 47, joinedAt: "Jun 2024", status: "inactive", institutionType: "School",     classYear: "Class 8"  },
  { id: "u27", name: "Nusrat Jahan",      email: "nusrat.jahan@gmail.com",  dept: "Math", institute: "Udayan Higher Sec School",   tier: "Beginner",     level: "Beginner",     xp: 1480, streak: 2,  testsTaken: 11, avgScore: 51, joinedAt: "Jun 2024", status: "active",   institutionType: "School",     classYear: "Class 10" },
  { id: "u28", name: "Shahriar Hasan",    email: "shahriar.h@gmail.com",    dept: "CSE",  institute: "St. Joseph Higher Sec Sch",  tier: "Beginner",     level: "Beginner",     xp: 1650, streak: 3,  testsTaken: 13, avgScore: 53, joinedAt: "Jun 2024", status: "active",   institutionType: "School",     classYear: "Class 9"  },
  { id: "u29", name: "Farhana Akter",     email: "farhana.akter@gmail.com", dept: "EEE",  institute: "Birdemoshi Govt High School",tier: "Beginner",     level: "Beginner",     xp: 980,  streak: 1,  testsTaken: 6,  avgScore: 44, joinedAt: "Jun 2024", status: "inactive", institutionType: "School",     classYear: "Class 8"  },
  { id: "u30", name: "Rezaul Karim",      email: "rezaul.karim@gmail.com",  dept: "Math", institute: "Netrokona Govt High School",  tier: "Beginner",     level: "Beginner",     xp: 820,  streak: 0,  testsTaken: 4,  avgScore: 40, joinedAt: "Jul 2024", status: "inactive", institutionType: "School",     classYear: "Class 7"  },
];
