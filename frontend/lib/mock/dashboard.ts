import type { DashboardStats, LeaderboardEntry } from "@/types";
import type { Tier } from "@/types";

export const dashboardStatsByTier: Record<Tier, DashboardStats> = {
  Beginner: {
    testsTaken: 20,
    averageScore: 62,
    bestScore: 78,
    totalTime: "8h 30m",
    topicMastery: [
      { topic: "Algebra",            accuracy: 72, speed: 65 },
      { topic: "Mathematical Logic", accuracy: 60, speed: 52 },
      { topic: "Number Theory",      accuracy: 50, speed: 44 },
    ],
    recentActivity: [
      { type: "test",      title: "Completed: Algebra Fundamentals",        score: "9/12",    time: "1h ago"    },
      { type: "badge",     title: "Earned Badge: First Proof",              xp: 100,          time: "Yesterday" },
      { type: "community", title: 'Posted: "How do I start with proofs?"',                    time: "2 days ago"},
      { type: "test",      title: "Completed: Algebra Sprint #1",           score: "7/10",    time: "3 days ago"},
    ],
    learningPath: [
      { title: "Algebra Basics",      progress: 100, status: "completed"   },
      { title: "Mathematical Logic",  progress: 40,  status: "in_progress" },
      { title: "Number Theory Basics",progress: 0,   status: "locked"      },
    ],
    recommendedNext: {
      title: "Introduction to Proofs",
      topic: "Mathematical Logic",
      level: "Beginner",
    },
  },
  Intermediate: {
    testsTaken: 52,
    averageScore: 76,
    bestScore: 94,
    totalTime: "22h 45m",
    topicMastery: [
      { topic: "Algebra",       accuracy: 85, speed: 78 },
      { topic: "Combinatorics", accuracy: 80, speed: 72 },
      { topic: "Geometry",      accuracy: 74, speed: 66 },
      { topic: "Number Theory", accuracy: 62, speed: 55 },
    ],
    recentActivity: [
      { type: "test",      title: "Completed: Geometry Sprint #1",           score: "84/100",  time: "2h ago"    },
      { type: "badge",     title: "Earned Badge: Circle Master",             xp: 200,          time: "Yesterday" },
      { type: "community", title: 'Replied in "Vieta\'s Formulas help"',                       time: "2 days ago"},
      { type: "test",      title: "Completed: Combinatorics Masterclass #4", score: "78/100", time: "4 days ago"},
    ],
    learningPath: [
      { title: "Geometry Foundations",    progress: 100, status: "completed"   },
      { title: "Combinatorics Mid-Level", progress: 65,  status: "in_progress" },
      { title: "Advanced Combinatorics",  progress: 0,   status: "locked"      },
    ],
    recommendedNext: {
      title: "Combinatorics: Pigeonhole Problems",
      topic: "Combinatorics",
      level: "Intermediate",
    },
  },
  Advanced: {
    testsTaken: 142,
    averageScore: 88,
    bestScore: 99,
    totalTime: "48h 20m",
    topicMastery: [
      { topic: "Algebra",       accuracy: 92, speed: 85 },
      { topic: "Combinatorics", accuracy: 86, speed: 80 },
      { topic: "Number Theory", accuracy: 78, speed: 70 },
      { topic: "Geometry",      accuracy: 64, speed: 60 },
    ],
    recentActivity: [
      { type: "test",      title: "Completed: Advanced Geometry Mock #4",   score: "94/100",  time: "2h ago"    },
      { type: "badge",     title: "Earned Badge: Prime Master",             xp: 250,          time: "Yesterday" },
      { type: "community", title: 'Replied in "BdMO 2022 Problem 5"',                         time: "2 days ago"},
      { type: "test",      title: "Completed: Number Theory Sprint #1",     score: "88/100",  time: "3 days ago"},
    ],
    learningPath: [
      { title: "Advanced Number Theory",  progress: 100, status: "completed"   },
      { title: "Olympiad Inequalities",   progress: 75,  status: "in_progress" },
      { title: "Differential Topology",   progress: 0,   status: "locked"      },
    ],
    recommendedNext: {
      title: "Inequalities Masterclass",
      topic: "Inequalities",
      level: "Advanced",
    },
  },
};

export const dashboardStats: DashboardStats = dashboardStatsByTier.Advanced;

export const leaderboard: LeaderboardEntry[] = [
  // ── Advanced — ranks 1–15 (universities) ────────────────────────────
  { rank: 1,  name: "Adnan Chowdhury",  department: "CSE",  institute: "UIU",                       tier: "Advanced",     rating: 2409, trend: "up"     },
  { rank: 2,  name: "Sarah Jubaida",    department: "EEE",  institute: "BUET",                      tier: "Advanced",     rating: 2382, trend: "up"     },
  { rank: 3,  name: "Rahat Khan",       department: "CSE",  institute: "UIU",                       tier: "Advanced",     rating: 2199, trend: "stable" },
  { rank: 4,  name: "Nadia Islam",      department: "Math", institute: "DU",                        tier: "Advanced",     rating: 2054, trend: "up"     },
  { rank: 5,  name: "Arman Hossain",    department: "CSE",  institute: "KUET",                      tier: "Advanced",     rating: 1987, trend: "up"     },
  { rank: 6,  name: "Priya Chowdhury",  department: "EEE",  institute: "CUET",                      tier: "Advanced",     rating: 1876, trend: "down"   },
  { rank: 7,  name: "Zafar Iqbal",      department: "Math", institute: "SUST",                      tier: "Advanced",     rating: 1754, trend: "up"     },
  { rank: 8,  name: "Sabrina Akter",    department: "Math", institute: "RUET",                      tier: "Advanced",     rating: 1698, trend: "down"   },
  { rank: 9,  name: "Karim Uddin",      department: "CSE",  institute: "JU",                        tier: "Advanced",     rating: 1642, trend: "stable" },
  { rank: 10, name: "Tania Khanam",     department: "EEE",  institute: "IUT",                       tier: "Advanced",     rating: 1589, trend: "up"     },
  { rank: 11, name: "Ismail Hossain",   department: "Math", institute: "AIUB",                      tier: "Advanced",     rating: 1546, trend: "up"     },
  { rank: 12, name: "Sajida Parvin",    department: "CSE",  institute: "UIU",                       tier: "Advanced",     rating: 1498, trend: "stable" },
  { rank: 13, name: "Rana Islam",       department: "EEE",  institute: "RU",                        tier: "Advanced",     rating: 1455, trend: "down"   },
  { rank: 14, name: "Lamia Begum",      department: "Math", institute: "BRAC University",           tier: "Advanced",     rating: 1412, trend: "up"     },
  { rank: 15, name: "Morshed Ahmed",    department: "CSE",  institute: "CU",                        tier: "Advanced",     rating: 1373, trend: "stable" },

  // ── Intermediate — ranks 16–30 (colleges) ───────────────────────────
  { rank: 16, name: "Sabrina Yeasmin",  department: "Math", institute: "Notre Dame College",         tier: "Intermediate", rating: 1340, trend: "up"     },
  { rank: 17, name: "Tanvir Anjum",     department: "CSE",  institute: "Dhaka City College",         tier: "Intermediate", rating: 1302, trend: "stable" },
  { rank: 18, name: "Tasfia Ahmed",     department: "EEE",  institute: "Rajshahi College",           tier: "Intermediate", rating: 1265, trend: "up"     },
  { rank: 19, name: "Samiul Islam",     department: "Math", institute: "Dhaka College",              tier: "Intermediate", rating: 1228, trend: "down"   },
  { rank: 20, name: "Nabila Tabassum",  department: "CSE",  institute: "Adamjee Cantonment College", tier: "Intermediate", rating: 1192, trend: "up"     },
  { rank: 21, name: "Zubair Rahman",    department: "EEE",  institute: "BAF Shaheen College",        tier: "Intermediate", rating: 1158, trend: "stable" },
  { rank: 22, name: "Mehedi Hasan",     department: "Math", institute: "Comilla Victoria College",   tier: "Intermediate", rating: 1124, trend: "up"     },
  { rank: 23, name: "Anika Tahsin",     department: "CSE",  institute: "Sylhet Govt College",        tier: "Intermediate", rating: 1092, trend: "down"   },
  { rank: 24, name: "Sajid Khan",       department: "EEE",  institute: "Notre Dame College",         tier: "Intermediate", rating: 1061, trend: "up"     },
  { rank: 25, name: "Fariha Alam",      department: "Math", institute: "Rajuk Uttara Model College", tier: "Intermediate", rating: 1032, trend: "stable" },
  { rank: 26, name: "Nasrin Akter",     department: "CSE",  institute: "Chittagong College",         tier: "Intermediate", rating: 1005, trend: "up"     },
  { rank: 27, name: "Shuvo Ghosh",      department: "EEE",  institute: "City College Comilla",       tier: "Intermediate", rating: 979,  trend: "down"   },
  { rank: 28, name: "Rima Islam",       department: "Math", institute: "Pabna Edward College",       tier: "Intermediate", rating: 954,  trend: "stable" },
  { rank: 29, name: "Alim Hossain",     department: "CSE",  institute: "Govt. M.M. College",         tier: "Intermediate", rating: 930,  trend: "up"     },
  { rank: 30, name: "Dilruba Begum",    department: "EEE",  institute: "Mymensingh Girls' College",  tier: "Intermediate", rating: 907,  trend: "down"   },

  // ── Beginner — ranks 31–45 (schools) ────────────────────────────────
  { rank: 31, name: "Imtiaz Ahmed",     department: "CSE",  institute: "Viqarunnisa Noon School",    tier: "Beginner",     rating: 885,  trend: "up"     },
  { rank: 32, name: "Ishrat Jahan",     department: "EEE",  institute: "Rajuk Uttara Model College", tier: "Beginner",     rating: 862,  trend: "down"   },
  { rank: 33, name: "Abrar Shakil",     department: "Math", institute: "BRAC CDM School",            tier: "Beginner",     rating: 839,  trend: "up"     },
  { rank: 34, name: "Sumaiya Haque",    department: "CSE",  institute: "Mymensingh Zilla School",    tier: "Beginner",     rating: 817,  trend: "stable" },
  { rank: 35, name: "Rakibul Islam",    department: "EEE",  institute: "BAF Shaheen College",        tier: "Beginner",     rating: 796,  trend: "up"     },
  { rank: 36, name: "Niaz Morshed",     department: "Math", institute: "Sylhet Cadet College",       tier: "Beginner",     rating: 775,  trend: "down"   },
  { rank: 37, name: "Sadia Afrin",      department: "CSE",  institute: "Faujdarhat Cadet College",   tier: "Beginner",     rating: 755,  trend: "up"     },
  { rank: 38, name: "Asif Iqbal",       department: "EEE",  institute: "Chittagong Govt School",     tier: "Beginner",     rating: 736,  trend: "stable" },
  { rank: 39, name: "Tasmia Zaman",     department: "Math", institute: "Sunnydale School",           tier: "Beginner",     rating: 718,  trend: "up"     },
  { rank: 40, name: "Mahmudul Hasan",   department: "CSE",  institute: "Willes Little Flower School",tier: "Beginner",     rating: 701,  trend: "down"   },
  { rank: 41, name: "Afsana Khan",      department: "Math", institute: "Motijheel Model School",     tier: "Beginner",     rating: 685,  trend: "up"     },
  { rank: 42, name: "Rafiq Molla",      department: "EEE",  institute: "Faujdarhat Cadet College",   tier: "Beginner",     rating: 669,  trend: "stable" },
  { rank: 43, name: "Maisha Ferdous",   department: "CSE",  institute: "Mastermind School",          tier: "Beginner",     rating: 654,  trend: "up"     },
  { rank: 44, name: "Sabbir Khan",      department: "Math", institute: "Dhaka Residential Model",    tier: "Beginner",     rating: 640,  trend: "down"   },
  { rank: 45, name: "Laila Hossain",    department: "EEE",  institute: "Ideal School & College",     tier: "Beginner",     rating: 627,  trend: "up"     },
];
