export type NavLink = { label: string; href: string; external?: boolean };

export const productsLinks: NavLink[] = [
  { label: "Student Information System", href: "/school-mis/" },
  { label: "Multi-Campus & School Groups", href: "/products/group-schools-mis/" },
  { label: "Government Schools MIS", href: "/government-schools-mis/" },
  { label: "Finance & School Fees", href: "/products/finance/" },
  { label: "Workflows & Automation", href: "/workflows/" },
  { label: "Insights & Analytics", href: "/oasis-insights/" },
  { label: "Staff Management", href: "/staff-management/" },
  { label: "Timetable Management", href: "/timetable-management/" },
];

export const schoolTypesLinks: NavLink[] = [
  { label: "Primary Schools", href: "/primary-schools/" },
  { label: "Secondary Schools", href: "/secondary-schools/" },
  { label: "Vocational & Special Institutions", href: "/products/special-school-mis/" },
  { label: "School Groups & Multi-Campus", href: "/multi-campus-schools/" },
  { label: "Government Schools", href: "/government-schools/" },
];

export const resourcesLinks: NavLink[] = [
  { label: "Pricing", href: "/pricing/" },
  { label: "FAQ", href: "/faq/" },
  { label: "Guides & Case Studies", href: "/library/" },
  { label: "Switching to OASIS", href: "/switching-to-oasis/" },
];

export const aboutUsLinks: NavLink[] = [
  { label: "About OASIS", href: "/about-us/" },
  { label: "Become a Partner", href: "/become-a-partner/" },
  { label: "Partners and Integrations", href: "/our-partners-integrations/" },
  { label: "Data Protection & Privacy", href: "/about-us/data-protection-gdpr/" },
  { label: "Contact Us", href: "/contact/" },
];

export const megaMenu = [
  { label: "Products", links: productsLinks },
  { label: "School Types", links: schoolTypesLinks },
  { label: "Resources", links: resourcesLinks },
  { label: "About Us", links: aboutUsLinks },
];

export const footerProductsPrimary: NavLink[] = productsLinks;
export const footerProductsSecondary: NavLink[] = [
  { label: "Training & Onboarding", href: "/training/" },
  { label: "Attendance Tracking", href: "/auto-absence/" },
  { label: "School Analytics", href: "/bi-connector/" },
  { label: "Documents & Data Storage", href: "/custom-data-warehouse/" },
  { label: "School Payments", href: "/school-payments/" },
  { label: "SMS & Email Communication", href: "/sms-subscription/" },
];

export const footerColumns = [
  { title: "Products", primary: footerProductsPrimary, secondary: footerProductsSecondary },
  { title: "School Types", primary: schoolTypesLinks, secondary: [] as NavLink[] },
  { title: "Resources", primary: resourcesLinks, secondary: [] as NavLink[] },
  { title: "About us", primary: aboutUsLinks, secondary: [] as NavLink[] },
];
