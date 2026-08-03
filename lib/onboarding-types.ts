// Data model for the OASIS "Create School Account" onboarding wizard.
// No backend exists yet - submissions are persisted to localStorage only,
// simulating what a real API would eventually store.

export type SchoolTypeOption =
  | "nursery"
  | "primary"
  | "secondary"
  | "nursery_primary"
  | "primary_secondary"
  | "nursery_primary_secondary"
  | "international"
  | "vocational"
  | "faith_based"
  | "special_needs";

export type StudentBand = "50_250" | "250_500" | "500_1000" | "1000_2500" | "2500_plus";

export type CurrentSystem = "paper" | "excel" | "existing_software" | "custom_system";

export type ModuleKey =
  | "admissions"
  | "student_management"
  | "attendance"
  | "finance"
  | "school_fees"
  | "parent_portal"
  | "teacher_portal"
  | "student_portal"
  | "library"
  | "transport"
  | "hostel"
  | "inventory"
  | "medical"
  | "payroll"
  | "hr"
  | "sms"
  | "email"
  | "timetable"
  | "exams"
  | "continuous_assessment"
  | "discipline"
  | "analytics"
  | "reports";

export interface OrganisationDetails {
  companyName: string;
  schoolName: string;
  tradingName?: string;
  schoolEmail: string;
  schoolPhone: string;
  altPhone?: string;
  headTeacherName: string;
  directorName: string;
  website?: string;
}

export interface SchoolTypeDetails {
  schoolType: SchoolTypeOption | "";
}

export interface LocationDetails {
  country: string;
  region: string;
  district: string;
  cityTown: string;
  parish?: string;
  physicalAddress: string;
  mapsLink?: string;
  postalAddress?: string;
}

export interface ProfileDetails {
  yearEstablished: string;
  yearsInOperation: string;
  academicCalendar: string;
  ownership: "government" | "private" | "";
  boarding: "day" | "boarding" | "both" | "";
  gender: "mixed" | "boys" | "girls" | "";
  numCampuses: string;
  annualIntake: string;
}

export interface StudentNumbersDetails {
  currentPopulation: StudentBand | "";
  expectedGrowth: string;
}

export interface StaffDetails {
  teachers: string;
  adminStaff: string;
  financeStaff: string;
  ictStaff: string;
  boardingStaff: string;
  supportStaff: string;
  totalEmployees: string;
}

export interface AcademicDetails {
  curriculum: string;
  otherCurriculum?: string;
  subjectsOffered: string;
  numClasses: string;
  numStreams: string;
  examinationLevels: string;
}

export interface CurrentSystemsDetails {
  currentSystem: CurrentSystem | "";
  currentSoftwareName?: string;
}

export interface ModulesDetails {
  modules: ModuleKey[];
}

export interface OnboardingData {
  organisation: OrganisationDetails;
  schoolType: SchoolTypeDetails;
  location: LocationDetails;
  profile: ProfileDetails;
  studentNumbers: StudentNumbersDetails;
  staff: StaffDetails;
  academic: AcademicDetails;
  currentSystems: CurrentSystemsDetails;
  modules: ModulesDetails;
}

export type ApplicationStatus = "draft" | "pending_review" | "approved" | "rejected" | "more_info_requested" | "suspended";

export interface SchoolApplication {
  id: string;
  data: OnboardingData;
  status: ApplicationStatus;
  submittedAt: string | null;
  updatedAt: string;
  /** Last step the applicant was on, so returning later resumes here instead of restarting. */
  lastStep: number;
}

export const emptyOnboardingData: OnboardingData = {
  organisation: {
    companyName: "",
    schoolName: "",
    tradingName: "",
    schoolEmail: "",
    schoolPhone: "",
    altPhone: "",
    headTeacherName: "",
    directorName: "",
    website: "",
  },
  schoolType: { schoolType: "" },
  location: {
    country: "Uganda",
    region: "",
    district: "",
    cityTown: "",
    parish: "",
    physicalAddress: "",
    mapsLink: "",
    postalAddress: "",
  },
  profile: {
    yearEstablished: "",
    yearsInOperation: "",
    academicCalendar: "",
    ownership: "",
    boarding: "",
    gender: "",
    numCampuses: "",
    annualIntake: "",
  },
  studentNumbers: { currentPopulation: "", expectedGrowth: "" },
  staff: {
    teachers: "",
    adminStaff: "",
    financeStaff: "",
    ictStaff: "",
    boardingStaff: "",
    supportStaff: "",
    totalEmployees: "",
  },
  academic: {
    curriculum: "",
    otherCurriculum: "",
    subjectsOffered: "",
    numClasses: "",
    numStreams: "",
    examinationLevels: "",
  },
  currentSystems: { currentSystem: "", currentSoftwareName: "" },
  modules: { modules: [] },
};

export const schoolTypeLabels: Record<SchoolTypeOption, string> = {
  nursery: "Nursery",
  primary: "Primary",
  secondary: "Secondary",
  nursery_primary: "Nursery & Primary",
  primary_secondary: "Primary & Secondary",
  nursery_primary_secondary: "Nursery, Primary & Secondary",
  international: "International School",
  vocational: "Vocational Institution",
  faith_based: "Faith-Based School",
  special_needs: "Special Needs School",
};

export const studentBandLabels: Record<StudentBand, string> = {
  "50_250": "50 – 250",
  "250_500": "250 – 500",
  "500_1000": "500 – 1,000",
  "1000_2500": "1,000 – 2,500",
  "2500_plus": "2,500+",
};

export const currentSystemLabels: Record<CurrentSystem, string> = {
  paper: "Paper Records",
  excel: "Excel",
  existing_software: "Existing School Software",
  custom_system: "Custom System",
};

export const moduleLabels: Record<ModuleKey, string> = {
  admissions: "Admissions",
  student_management: "Student Management",
  attendance: "Attendance",
  finance: "Finance",
  school_fees: "School Fees",
  parent_portal: "Parent Portal",
  teacher_portal: "Teacher Portal",
  student_portal: "Student Portal",
  library: "Library",
  transport: "Transport",
  hostel: "Hostel",
  inventory: "Inventory",
  medical: "Medical",
  payroll: "Payroll",
  hr: "HR",
  sms: "SMS",
  email: "Email",
  timetable: "Timetable",
  exams: "Exams",
  continuous_assessment: "Continuous Assessment",
  discipline: "Discipline",
  analytics: "Analytics",
  reports: "Reports",
};

// --- Required-document stage (post-approval) -------------------------------

export type DocumentKey =
  | "ursb_certificate"
  | "operating_licence"
  | "moe_registration"
  | "tin"
  | "nssf"
  | "trading_licence"
  | "memorandum_articles"
  | "director_id"
  | "head_teacher_id"
  | "proof_of_address"
  | "school_logo"
  | "school_stamp";

export interface DocumentRequirement {
  key: DocumentKey;
  label: string;
  description: string;
  required: boolean;
}

// Admins can configure/extend this list later (no admin UI yet - see
// lib/admin-actions.ts for the stubbed review actions this list feeds into).
export const documentRequirements: DocumentRequirement[] = [
  {
    key: "ursb_certificate",
    label: "URSB Certificate of Registration",
    description: "Certificate of incorporation or business registration from URSB.",
    required: true,
  },
  {
    key: "operating_licence",
    label: "School Operating Licence",
    description: "Your current licence to operate as a school.",
    required: true,
  },
  {
    key: "moe_registration",
    label: "Ministry of Education Registration",
    description: "Ministry of Education registration or approval documents, where applicable.",
    required: false,
  },
  {
    key: "tin",
    label: "Tax Identification Number (TIN)",
    description: "URA TIN certificate for the school or its operating company.",
    required: true,
  },
  {
    key: "nssf",
    label: "NSSF Registration",
    description: "NSSF employer registration certificate, if applicable.",
    required: false,
  },
  {
    key: "trading_licence",
    label: "Trading Licence",
    description: "Local government trading licence, if applicable.",
    required: false,
  },
  {
    key: "memorandum_articles",
    label: "Memorandum & Articles of Association",
    description: "Where the school is operated by a registered company.",
    required: false,
  },
  {
    key: "director_id",
    label: "Company Director Identification",
    description: "National ID or passport of the company director / proprietor.",
    required: true,
  },
  {
    key: "head_teacher_id",
    label: "Head Teacher Identification",
    description: "National ID or passport of the Head Teacher / Principal.",
    required: true,
  },
  {
    key: "proof_of_address",
    label: "Proof of School Address",
    description: "A recent utility bill or local council letter confirming the school's address.",
    required: true,
  },
  {
    key: "school_logo",
    label: "School Logo",
    description: "A high-resolution copy of your school's logo, for use across OASIS.",
    required: false,
  },
  {
    key: "school_stamp",
    label: "School Stamp",
    description: "An image of your official school stamp.",
    required: false,
  },
];
