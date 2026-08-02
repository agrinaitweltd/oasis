import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog - Arbor",
  description: "Management Information System (MIS) for schools",
};

const posts = [
  {
    "slug": "blog-how-dartmoor-mat-implements-policies-education-processes-and-procedures",
    "title": "“Lived, not laminated”"
  },
  {
    "slug": "blog-arbor-why-move-school-mis",
    "title": "&#8220;Why my school switched&#8221;"
  },
  {
    "slug": "blog-3-key-aims-from-the-teacher-recruitment-and-retention-strategy",
    "title": "3 key aims from the Teacher Recruitment and Retention Strategy"
  },
  {
    "slug": "blog-4-ways-a-cloud-based-mis-will-change-the-way-you-work-at-school",
    "title": "4 ways a cloud-based MIS will change the way you work at school"
  },
  {
    "slug": "blog-5-easy-steps-to-build-a-bi-dashboard-with-your-arbor-data",
    "title": "5 easy steps to build a BI dashboard with your Arbor data"
  },
  {
    "slug": "blog-easter-de-stress-management-self-care",
    "title": "5 ways to unwind and de-stress during the school holidays"
  },
  {
    "slug": "blog-6-end-of-year-arbor-ai-hacks",
    "title": "6 end-of-year Arbor AI hacks"
  },
  {
    "slug": "blog-arbors-integration-with-hellodata",
    "title": "Announcing Arbor’s integration with helloData"
  },
  {
    "slug": "blog-arbor-finance-offer-for-local-authorities",
    "title": "Announcing Arbor’s MIS and Finance offer for Local Authorities"
  },
  {
    "slug": "blog-arbor-by-numbers",
    "title": "Arbor by numbers"
  },
  {
    "slug": "blog-arbor-ascl-premier-partner",
    "title": "Arbor is an ASCL Premier Partner!"
  },
  {
    "slug": "blog-arbor-labs",
    "title": "Arbor Labs is open!"
  },
  {
    "slug": "blog-arbor-wrapped",
    "title": "Arbor Wrapped 2024"
  },
  {
    "slug": "blog-ask-arbor-ai",
    "title": "Ask Arbor"
  },
  {
    "slug": "blog-building-a-mat-of-the-future",
    "title": "Building a MAT of the future"
  },
  {
    "slug": "blog-cardiff-chooses-arbor-mis-and-arbor-finance",
    "title": "Cardiff chooses Arbor MIS and Arbor Finance"
  },
  {
    "slug": "blog-first-look-at-our-summer-roadmap",
    "title": "First look at our Summer Roadmap!"
  },
  {
    "slug": "blog-join-arbor-sampeople-timetabler-at-bett",
    "title": "Four ways to meet us at BETT"
  },
  {
    "slug": "blog-how-arbor-keeps-your-school-data-safe",
    "title": "How Arbor keeps your school data safe"
  },
  {
    "slug": "blog-four-education-school-leaders-drive-operational-excellence-with-ai",
    "title": "How four education leaders are building operational excellence with AI"
  },
  {
    "slug": "blog-how-greenshaw-learning-trust-plans-to-improve-the-structure-of-its-organisation",
    "title": "How Greenshaw Learning Trust uses the lighthouse model when working with schools"
  },
  {
    "slug": "blog-how-to-use-your-mis-to-reduce-your-workload-this-term",
    "title": "How to use your MIS to reduce your workload this term"
  },
  {
    "slug": "blog-how-to-write-a-good-llm-prompt",
    "title": "How to write a good LLM prompt"
  },
  {
    "slug": "blog-how-we-use-arbor-ai-tips-from-the-school-leaders",
    "title": "How we use Arbor AI: Tips from the school leaders using it every day"
  },
  {
    "slug": "blog-arbors-ofsted-inspection-companion",
    "title": "Introducing: Arbor’s new Ofsted Inspection Companion"
  },
  {
    "slug": "blog-introducing-the-arbor-school-management-suite-and-our-new-look",
    "title": "Introducing: The Arbor School Management Suite"
  },
  {
    "slug": "blog-flexible-working-in-schools-recruitment",
    "title": "Is flexible working in schools necessary for recruitment and retention?"
  },
  {
    "slug": "blog-what-is-an-mis-governors",
    "title": "Making the most of Arbor as a school governor"
  },
  {
    "slug": "blog-saving-time-and-money-with-arbor-mis",
    "title": "Saving time and money with Arbor MIS"
  },
  {
    "slug": "blog-school-attendance-analysis-in-arbor",
    "title": "School attendance analysis in Arbor"
  },
  {
    "slug": "blog-improve-school-attendance-wellbeing-communication-with-parents",
    "title": "School attendance and wellbeing: How can it be improved through communication with parents?"
  },
  {
    "slug": "blog-share-courses-with-arbor-shared-teaching",
    "title": "Share courses between schools"
  },
  {
    "slug": "blog-why-majority-of-schools-have-already-moved-mis",
    "title": "Switch, don’t stick: Why over 50% of schools have already moved MIS"
  },
  {
    "slug": "blog-data-drop-attendance-of-pupil-premium-eligible-sen-students",
    "title": "The Data Drop"
  },
  {
    "slug": "blog-staff-absence-in-schools-data-drop",
    "title": "The Data Drop: Staff absence in schools"
  },
  {
    "slug": "blog-the-data-drop-which-students-go-on-the-most-trips",
    "title": "The Data Drop: Which students go on the most trips?"
  },
  {
    "slug": "blog-the-end-of-sims7-census-what-you-need-to-know",
    "title": "The end of SIMS7 Census: What you need to know"
  },
  {
    "slug": "blog-the-future-of-arbor-and-the-mis-market",
    "title": "The future of Arbor and the MIS market"
  },
  {
    "slug": "blog-ai-mat-leaders-share-their-stories",
    "title": "The impact of Arbor AI: MAT leaders share their stories"
  },
  {
    "slug": "blog-top-five-reasons-schools-reviewing-their-mis",
    "title": "The top five reasons schools are reviewing their MIS options this term"
  },
  {
    "slug": "blog-the-ultimate-guide-to-improving-school-communication-with-parents",
    "title": "The ultimate guide to improving communication with parents"
  },
  {
    "slug": "blog-vale-of-glamorgan-chooses-arbor-mis",
    "title": "The Vale of Glamorgan chooses Arbor MIS for their schools"
  },
  {
    "slug": "blog-the-year-of-ai-in-numbers",
    "title": "The year of AI in numbers"
  },
  {
    "slug": "blog-three-things-you-must-know-when-thinking-about-ai-at-your-school",
    "title": "Three things you must know when thinking about AI at your school"
  },
  {
    "slug": "blog-ai-three-examples-of-ai-in-schools",
    "title": "Three ways schools are using AI to transform the way they work"
  },
  {
    "slug": "blog-mis-should-reduce-teacher-workload-and-improve-wellbeing",
    "title": "Three ways your MIS should reduce teacher workload and improve wellbeing"
  },
  {
    "slug": "blog-moving-mis-data-manager-school",
    "title": "Top five benefits of a cloud MIS for Data Managers in schools"
  },
  {
    "slug": "blog-top-tips-for-managing-your-workload-from-school-business-leaders",
    "title": "Top tips for managing your workload from School Business Leaders"
  },
  {
    "slug": "blog-welcoming-timetabler-to-the-key-group",
    "title": "Welcoming TimeTabler to The Key Group"
  },
  {
    "slug": "blog-what-does-a-school-attendance-officer-do-2",
    "title": "What does a school Attendance Officer do?"
  },
  {
    "slug": "blog-an-mis-all-your-staff-can-fall-in-love-with",
    "title": "What schools and trusts say about Arbor"
  },
  {
    "slug": "blog-whats-new-in-february-2025",
    "title": "What’s new in February?"
  },
  {
    "slug": "blog-whats-new-in-february-2026",
    "title": "What&#8217;s new in February?"
  },
  {
    "slug": "blog-whats-new-in-october-2024",
    "title": "What&#8217;s new in October?"
  },
  {
    "slug": "blog-whats-new-in-september-2025",
    "title": "What&#8217;s new in September?"
  },
  {
    "slug": "blog-whats-next-for-arbor-and-ai",
    "title": "What&#8217;s next for Arbor and AI?"
  }
];

export default function BlogIndexPage() {
  return (
    <div className="wp-block-group is-layout-flow wp-block-group-is-layout-flow has-global-padding" style={{ paddingTop: 64, paddingBottom: 64, maxWidth: 1000, margin: "0 auto" }}>
      <h1>Blog</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {posts.map((p) => (
          <li key={p.slug} style={{ marginBottom: "1em" }}>
            <Link href={`/${p.slug}/`}>{p.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
