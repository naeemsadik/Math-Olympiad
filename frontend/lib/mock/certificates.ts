export type CertStatus = "valid" | "revoked";

export interface Certificate {
  id: string;
  studentName: string;
  studentId: string;
  dept: string;
  institute: string;
  achievement: string;
  event: string;
  eventType: string;
  issuedAt: string;
  issuedBy: string;
  tier: string;
  status: CertStatus;
  description: string;
  signatoryName: string;
  signatoryTitle: string;
}

export const mockCertificates: Certificate[] = [
  {
    id: "UIU-CMOR-2025-001",
    studentName: "Arif Hossain",
    studentId: "011241001",
    dept: "CSE",
    institute: "UIU",
    achievement: "1st Place — UIU Internal Math Olympiad 2025",
    event: "UIU Internal Math Olympiad 2025",
    eventType: "Competition",
    issuedAt: "2025-05-20",
    issuedBy: "UIU Centre for Math Olympiad and Research",
    tier: "Advanced",
    status: "valid",
    description:
      "This certifies that the above-named student has achieved 1st place in the UIU Internal Math Olympiad 2025, demonstrating exceptional mathematical aptitude and problem-solving ability.",
    signatoryName: "Prof. Dr. Mohammed Hossain",
    signatoryTitle: "Director, UIU Centre for Math Olympiad and Research",
  },
  {
    id: "UIU-CMOR-2025-002",
    studentName: "Nusrat Jahan",
    studentId: "011241022",
    dept: "Math",
    institute: "UIU",
    achievement: "2nd Place — UIU Internal Math Olympiad 2025",
    event: "UIU Internal Math Olympiad 2025",
    eventType: "Competition",
    issuedAt: "2025-05-20",
    issuedBy: "UIU Centre for Math Olympiad and Research",
    tier: "Advanced",
    status: "valid",
    description:
      "This certifies that the above-named student has achieved 2nd place in the UIU Internal Math Olympiad 2025, demonstrating outstanding mathematical reasoning and analytical skills.",
    signatoryName: "Prof. Dr. Mohammed Hossain",
    signatoryTitle: "Director, UIU Centre for Math Olympiad and Research",
  },
  {
    id: "UIU-CMOR-2025-003",
    studentName: "Shahriar Noman",
    studentId: "011241253",
    dept: "CSE",
    institute: "UIU",
    achievement: "3rd Place — UIU Internal Math Olympiad 2025",
    event: "UIU Internal Math Olympiad 2025",
    eventType: "Competition",
    issuedAt: "2025-05-20",
    issuedBy: "UIU Centre for Math Olympiad and Research",
    tier: "Advanced",
    status: "valid",
    description:
      "This certifies that the above-named student has achieved 3rd place in the UIU Internal Math Olympiad 2025, demonstrating remarkable mathematical talent and perseverance.",
    signatoryName: "Prof. Dr. Mohammed Hossain",
    signatoryTitle: "Director, UIU Centre for Math Olympiad and Research",
  },
  {
    id: "UIU-CMOR-2025-004",
    studentName: "Fatema Khatun",
    studentId: "011241106",
    dept: "BBA",
    institute: "UIU",
    achievement: "Completion — BdMO Pre-Training Camp 2025",
    event: "BdMO Pre-Training Camp",
    eventType: "Training",
    issuedAt: "2025-04-25",
    issuedBy: "UIU Centre for Math Olympiad and Research",
    tier: "Intermediate",
    status: "valid",
    description:
      "This certifies that the above-named student has successfully completed the BdMO Pre-Training Camp 2025, covering advanced topics in Number Theory, Algebra, and Geometry.",
    signatoryName: "Prof. Dr. Mohammed Hossain",
    signatoryTitle: "Director, UIU Centre for Math Olympiad and Research",
  },
  {
    id: "UIU-CMOR-2025-005",
    studentName: "Imran Hossain",
    studentId: "011241211",
    dept: "CSE",
    institute: "UIU",
    achievement: "Completion — BdMO Pre-Training Camp 2025",
    event: "BdMO Pre-Training Camp",
    eventType: "Training",
    issuedAt: "2025-04-25",
    issuedBy: "UIU Centre for Math Olympiad and Research",
    tier: "Intermediate",
    status: "valid",
    description:
      "This certifies that the above-named student has successfully completed the BdMO Pre-Training Camp 2025, covering advanced topics in Number Theory, Algebra, and Geometry.",
    signatoryName: "Prof. Dr. Mohammed Hossain",
    signatoryTitle: "Director, UIU Centre for Math Olympiad and Research",
  },
  {
    id: "UIU-CMOR-2025-006",
    studentName: "Sumaiya Akter",
    studentId: "011241148",
    dept: "Math",
    institute: "UIU",
    achievement: "Completion — Olympiad Geometry Workshop",
    event: "Olympiad Geometry Workshop",
    eventType: "Workshop",
    issuedAt: "2025-06-15",
    issuedBy: "UIU Centre for Math Olympiad and Research",
    tier: "Beginner",
    status: "valid",
    description:
      "This certifies that the above-named student has successfully completed the Olympiad Geometry Workshop, gaining proficiency in synthetic geometry, angle chasing, and circle theorems.",
    signatoryName: "Prof. Dr. Mohammed Hossain",
    signatoryTitle: "Director, UIU Centre for Math Olympiad and Research",
  },
  {
    id: "UIU-CMOR-2024-018",
    studentName: "Rahat Khan",
    studentId: "011181045",
    dept: "CSE",
    institute: "UIU",
    achievement: "1st Place — UIU Internal Math Olympiad 2024",
    event: "UIU Internal Math Olympiad 2024",
    eventType: "Competition",
    issuedAt: "2024-06-20",
    issuedBy: "UIU Centre for Math Olympiad and Research",
    tier: "Advanced",
    status: "valid",
    description:
      "This certifies that the above-named student has achieved 1st place in the UIU Internal Math Olympiad 2024.",
    signatoryName: "Prof. Dr. Mohammed Hossain",
    signatoryTitle: "Director, UIU Centre for Math Olympiad and Research",
  },
  {
    id: "UIU-CMOR-2024-019",
    studentName: "Tanvir Ahmed",
    studentId: "011241043",
    dept: "EEE",
    institute: "UIU",
    achievement: "Completion — BdMO Pre-Training Camp 2024",
    event: "BdMO Pre-Training Camp 2024",
    eventType: "Training",
    issuedAt: "2024-01-20",
    issuedBy: "UIU Centre for Math Olympiad and Research",
    tier: "Intermediate",
    status: "revoked",
    description:
      "This certificate was revoked due to a violation of the participation terms and conditions.",
    signatoryName: "Prof. Dr. Mohammed Hossain",
    signatoryTitle: "Director, UIU Centre for Math Olympiad and Research",
  },
];
