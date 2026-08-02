export type NavLink = { label: string; href: string; external?: boolean };

export const productsLinks: NavLink[] = [
  { label: "Arbor School MIS", href: "/school-mis/" },
  { label: "Arbor MAT MIS", href: "/products/group-mat-mis/" },
  { label: "Arbor Local Authority MIS", href: "/local-authority-mis/" },
  { label: "Arbor Finance", href: "/products/arbor-finance/" },
  { label: "Arbor Workflows", href: "/workflows/" },
  { label: "Arbor AI", href: "/arbor-ai/" },
  { label: "SAMpeople", href: "/sampeople/" },
  { label: "TimeTabler", href: "/timetabler/" },
];

export const schoolTypesLinks: NavLink[] = [
  { label: "Arbor for Primary Schools", href: "/primary-schools/" },
  { label: "Arbor for Secondary Schools", href: "/secondary-schools/" },
  { label: "Arbor for Special Schools, APs, and PRUs", href: "/products/special-school-mis/" },
  { label: "Arbor for MATs", href: "/arbor-for-mats/" },
  { label: "Arbor for Local Authorities", href: "/local-authorities/" },
];

export const resourcesLinks: NavLink[] = [
  { label: "Blog", href: "https://arbor-education.com/blog/", external: true },
  { label: "eBooks and Case Studies", href: "/library/" },
  { label: "Webinars", href: "https://www.bigmarker.com/communities/arbor-education-webinars/conferences", external: true },
  { label: "Help Centre", href: "https://support.arbor-education.com/hc/en-us", external: true },
  { label: "Pay-for-One Promise", href: "/pay-for-one-promise/" },
  { label: "Moving to Arbor", href: "/moving-to-arbor/" },
];

export const aboutUsLinks: NavLink[] = [
  { label: "About Arbor", href: "/about-us/" },
  { label: "Careers", href: "https://apply.workable.com/arbor-education-3/?lng=en", external: true },
  { label: "Become a Partner", href: "/become-a-partner/" },
  { label: "Partners and Integrations", href: "/our-partners-integrations/" },
  { label: "Data Protection and GDPR", href: "/about-us/data-protection-gdpr/" },
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
  { label: "Arbor Training", href: "/arbor-training/" },
  { label: "Auto Absence", href: "/auto-absence/" },
  { label: "BI Connector", href: "/bi-connector/" },
  { label: "Custom Data Warehouse", href: "/custom-data-warehouse/" },
  { label: "School Payments", href: "/arbor-payments/" },
  { label: "SMS Subscription", href: "/sms-subscription/" },
];
export const footerProductsWales: NavLink[] = [{ label: "Arbor for Wales", href: "/wales/" }];

export const footerColumns = [
  { title: "Products", primary: footerProductsPrimary, secondary: [...footerProductsSecondary, ...footerProductsWales] },
  { title: "School Types", primary: schoolTypesLinks, secondary: [] as NavLink[] },
  { title: "Resources", primary: resourcesLinks, secondary: [] as NavLink[] },
  { title: "About us", primary: aboutUsLinks, secondary: [] as NavLink[] },
];
