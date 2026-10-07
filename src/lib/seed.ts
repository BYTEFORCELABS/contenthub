import { addDays, today } from "./dates";
import { CHECKLIST_TEMPLATE, STAGE_DONE as DONE } from "./meta";
import type { Asset, Campaign, ContentItem, Format, HubState, MediaRef, Pillar, Platform, Priority, Status } from "./types";

const stamp = (daysAgo: number, hour = 9) => { const d = new Date(); d.setDate(d.getDate() - daysAgo); d.setHours(hour, 15, 0, 0); return d.toISOString(); };

export const PILLARS: Pillar[] = [
  { id: "technology", name: "Technology", tone: "tech", topics: ["Web development", "AI", "Cybersecurity", "Software", "Cloud"] },
  { id: "education", name: "Education", tone: "edu", topics: ["Tutorials", "Business tips", "Digital literacy", "Technology education"] },
  { id: "cyberzik", name: "Cyberzik", tone: "brand", topics: ["Company", "Team", "Behind the scenes", "Projects", "Culture"] },
  { id: "business", name: "Business", tone: "biz", topics: ["Digital transformation", "Entrepreneurship", "Business technology"] },
  { id: "promotion", name: "Promotion", tone: "promo", topics: ["Services", "Case studies", "Testimonials", "Offers", "Calls to action"] },
];

export const CAMPAIGNS: Campaign[] = [
  { id: "brand-awareness", name: "Cyberzik Brand Awareness", description: "Introduce Cyberzik Technologies, our capabilities, services and approach to technology.", goal: "Grow followers and brand recall", startDate: addDays(today(), -12), endDate: addDays(today(), 24) },
  { id: "website-essentials", name: "Website Essentials Series", description: "A practical series on what every business website needs to win trust and customers.", goal: "Drive enquiries for web projects", startDate: addDays(today(), -6), endDate: addDays(today(), 30) },
  { id: "cyber-awareness", name: "Cybersecurity Awareness Month", description: "Plain-language security advice for small businesses, timed to October.", goal: "Position Cyberzik as a security-minded partner", startDate: addDays(today(), -6), endDate: addDays(today(), 24) },
  { id: "ai-business", name: "AI for Business", description: "Where AI genuinely helps a business today, and where it does not.", goal: "Thought leadership on LinkedIn", startDate: addDays(today(), 3), endDate: addDays(today(), 45) },
  { id: "client-stories", name: "Client Stories", description: "Case studies and before and after results from delivered projects.", goal: "Social proof for sales conversations", startDate: addDays(today(), 8), endDate: addDays(today(), 60) },
];

type Row = [title: string, status: Status, pillar: string, campaign: string | null, platforms: Platform[], format: Format, priority: Priority, day: number | null, assignee: string | null, tags: string[], description: string];

const ROWS: Row[] = [
  // Brand awareness
  ["Who is Cyberzik?", "published", "cyberzik", "brand-awareness", ["linkedin", "instagram"], "carousel", "high", -9, "Isaac", ["intro", "brand"], "Our story, what we build and who we build it for."],
  ["What we do", "published", "promotion", "brand-awareness", ["instagram", "facebook"], "carousel", "high", -6, "Isaac", ["services"], "A clear walk through Cyberzik's services."],
  ["Behind the Scenes at Cyberzik", "editing", "cyberzik", "brand-awareness", ["instagram", "tiktok"], "reel", "medium", 4, "Tobi", ["bts", "culture"], "A day in the studio: standup, design review, shipping."],
  ["Meet the Team", "review", "cyberzik", "brand-awareness", ["linkedin", "instagram"], "carousel", "medium", 6, "Zainab", ["team"], "Short profiles of the people behind the work."],
  ["Meet the Technology Behind Cyberzik", "production", "technology", "brand-awareness", ["linkedin", "x"], "thread", "medium", null, "Isaac", ["stack"], "The tools and stack we trust, and why."],
  ["Why Businesses Need Digital Transformation", "planned", "business", "brand-awareness", ["linkedin", "website"], "article", "high", null, "Isaac", ["strategy"], "The case for modernising operations, without the buzzwords."],
  ["Client Case Study: Logistics Dashboard", "idea", "promotion", "brand-awareness", ["linkedin"], "article", "medium", null, null, ["case-study"], "How a dashboard cut a client's reporting time."],
  // Website essentials
  ["5 Website Mistakes Businesses Make", "scheduled", "education", "website-essentials", ["instagram", "facebook"], "carousel", "high", 2, "Isaac", ["website", "tips"], "Educational carousel explaining common mistakes businesses make when building websites."],
  ["Why Every Business Needs a Professional Website", "scheduled", "education", "website-essentials", ["linkedin"], "text", "high", 5, "Isaac", ["website"], "Credibility, discoverability and control, in one post."],
  ["Website Before & After", "approved", "promotion", "website-essentials", ["instagram", "facebook", "tiktok"], "reel", "high", null, "Tobi", ["before-after", "design"], "A transformation reveal of a client's redesigned site."],
  ["5 Things Every Business Needs on Its Website", "production", "education", "website-essentials", ["instagram", "linkedin", "x", "website"], "carousel", "high", null, "Isaac", ["website", "checklist"], "The essentials: clear offer, contact, speed, trust signals, mobile layout."],
  ["How Fast Should a Website Load?", "planned", "technology", "website-essentials", ["x", "linkedin"], "thread", "low", null, null, ["performance"], "Page speed targets and what slows sites down."],
  ["Mobile-First: Why Your Site Looks Broken on Phones", "idea", "education", "website-essentials", ["instagram"], "reel", "medium", null, null, ["mobile"], "Quick screen recording of common mobile layout failures."],
  ["Website Launch Checklist", "published", "education", "website-essentials", ["linkedin", "website"], "article", "medium", -3, "Isaac", ["checklist", "launch"], "Everything to verify before going live."],
  // Cyber awareness
  ["Cybersecurity Mistakes Small Businesses Make", "scheduled", "technology", "cyber-awareness", ["linkedin", "instagram"], "carousel", "high", 1, "Isaac", ["security"], "Weak passwords, no backups, shared logins and more."],
  ["Phishing in 60 Seconds", "editing", "education", "cyber-awareness", ["tiktok", "instagram"], "reel", "high", 7, "Tobi", ["phishing", "awareness"], "How to spot a phishing message fast."],
  ["Why You Need Multi-Factor Authentication", "review", "technology", "cyber-awareness", ["linkedin", "facebook"], "text", "medium", 9, "Zainab", ["mfa"], "One extra step that blocks most account takeovers."],
  ["Backups: The 3-2-1 Rule", "production", "education", "cyber-awareness", ["instagram", "x"], "carousel", "medium", null, "Isaac", ["backups"], "Three copies, two media, one offsite."],
  ["Password Managers Explained", "planned", "education", "cyber-awareness", ["youtube"], "video", "low", null, null, ["passwords"], "A calm walkthrough for non-technical staff."],
  ["What To Do in the First Hour After a Breach", "idea", "technology", "cyber-awareness", ["linkedin", "x"], "thread", "high", null, null, ["incident"], "A short incident-response checklist."],
  ["Security Audit: What We Check", "published", "promotion", "cyber-awareness", ["facebook", "linkedin"], "image", "medium", -2, "Zainab", ["services", "security"], "Soft promotion of our security review offer."],
  // AI for business
  ["How AI Is Changing Modern Businesses", "planned", "technology", "ai-business", ["linkedin", "website"], "article", "high", null, "Isaac", ["ai"], "Practical examples across support, sales and operations."],
  ["3 Tasks You Can Automate With AI Today", "idea", "business", "ai-business", ["instagram", "tiktok"], "reel", "high", null, null, ["ai", "automation"], "Quick demos of everyday automations."],
  ["AI Hype vs What Actually Works", "idea", "technology", "ai-business", ["x"], "thread", "medium", null, null, ["ai", "opinion"], "A sober take on where AI pays off."],
  ["Is Your Data Ready for AI?", "idea", "business", "ai-business", ["linkedin"], "text", "medium", null, "Isaac", ["data"], "Data quality as the quiet prerequisite."],
  // Client stories
  ["Client Testimonial: Retail Platform", "planned", "promotion", "client-stories", ["linkedin", "instagram"], "video", "medium", null, "Zainab", ["testimonial"], "A short on-camera testimonial."],
  ["From Spreadsheets to Software: A Case Study", "idea", "promotion", "client-stories", ["website", "linkedin"], "article", "medium", null, null, ["case-study"], "Long-form case study."],
  // No campaign / loose ideas
  ["Founder's Note: Why We Build in Nigeria", "idea", "cyberzik", null, ["linkedin"], "text", "medium", null, "Isaac", ["founder"], "Personal reflection on building a technology company at home."],
  ["Tech Jargon Decoded: API", "idea", "education", null, ["instagram"], "carousel", "low", null, null, ["jargon"], "One term per post, explained in plain English."],
  ["Tech Jargon Decoded: Cloud", "idea", "education", null, ["instagram"], "carousel", "low", null, null, ["jargon"], "What the cloud actually is."],
  ["Office Setup Tour", "idea", "cyberzik", null, ["tiktok", "youtube"], "video", "low", null, "Tobi", ["bts"], "Desk-by-desk tour of the studio."],
  ["Year in Review: What We Shipped", "idea", "cyberzik", null, ["linkedin", "website"], "article", "medium", null, null, ["review"], "End-of-year recap, to be prepared in December."],
  ["Quick Win: Add a WhatsApp Button to Your Site", "idea", "education", null, ["tiktok", "instagram"], "reel", "medium", null, null, ["tutorial", "website"], "A 30-second tutorial."],
  ["Poll: What slows your business down most?", "idea", "business", null, ["linkedin", "x"], "text", "low", null, null, ["engagement"], "An engagement poll to gather topic ideas."],
  ["Open Source Tools We Love", "planned", "technology", null, ["x", "linkedin"], "thread", "low", null, "Isaac", ["tools"], "Our favourite open source projects."],
  ["Weekly Tip: Name Your Files Properly", "published", "education", null, ["facebook"], "image", "low", -5, "Zainab", ["tips"], "A small habit with a big payoff."],
  ["Black Friday Offer: Website Health Check", "planned", "promotion", null, ["instagram", "facebook", "linkedin"], "image", "high", null, "Isaac", ["offer"], "A limited offer on website audits."],
];

const emptyBrief = (title: string, status: Status) => status === "idea" ? { objective: "", audience: "", keyMessage: "", hook: "", cta: "", notes: "" } : {
  objective: `Educate our audience and build trust in Cyberzik through "${title}".`,
  audience: "Small and medium business owners and decision makers.",
  keyMessage: "Good technology decisions are simple when explained clearly.",
  hook: `Most businesses get this wrong. Here's how to get it right.`,
  cta: "Message us to discuss your project.",
  notes: "",
};
const media = (status: Status, format: Format, i: number): MediaRef[] => {
  if (DONE[status] < 3) return [];
  const m: MediaRef[] = [{ id: `m${i}a`, name: format === "reel" || format === "video" ? "rough-cut-v2.mp4" : "cover-design.png", kind: format === "reel" || format === "video" ? "video" : "graphic", size: format === "reel" || format === "video" ? "48 MB" : "1.2 MB" }];
  if (format === "carousel") m.push({ id: `m${i}b`, name: "slides-1-to-6.pdf", kind: "document", size: "3.4 MB" });
  return m;
};

const items: ContentItem[] = ROWS.map(([title, status, pillarId, campaignId, platforms, format, priority, day, assignee, tags, description], i) => ({
  id: `c-${String(i + 1).padStart(2, "0")}`, title, description, status, priority, pillarId, campaignId, platforms, format,
  publishDate: day === null ? null : addDays(today(), day), assignee, tags, notes: "",
  brief: emptyBrief(title, status),
  caption: DONE[status] >= 2 ? `${title}\n\n${description}\n\nSave this for later and share it with someone who needs it.\n\n#Cyberzik #Technology #BusinessGrowth` : "",
  media: media(status, format, i),
  checklist: CHECKLIST_TEMPLATE.map((label, k) => ({ id: `k${k}`, label, done: k < DONE[status] })),
  repurposedFromId: null,
  createdAt: stamp(14 - (i % 12)), updatedAt: stamp(i % 6),
}));

const hero = items.find((c) => c.title === "5 Website Mistakes Businesses Make")!;
hero.brief = {
  objective: "Show that Cyberzik understands why websites fail, and earn enquiries for rebuilds.",
  audience: "Owners of small businesses with a website that is more than three years old.",
  keyMessage: "A website is a sales tool, not a brochure. Fix these five things first.",
  hook: "Your website might be costing you customers. Here are 5 reasons why.",
  cta: "DM us 'AUDIT' for a free website review.",
  notes: "Use the brown and cream template. Slide 6 is the CTA.",
};
hero.caption = "Your website might be costing you customers.\n\nSwipe through the 5 mistakes we see most often, and how to fix each one.\n\nSave this for your next website review.\n\n#WebDesign #SmallBusiness #Cyberzik";

const ACT: [string, number, number][] = [
  ["Post marked as Published: Website Launch Checklist", 3, 11],
  ["Content scheduled: Cybersecurity Mistakes Small Businesses Make", 2, 16],
  ["New content idea created: Black Friday Offer: Website Health Check", 2, 10],
  ["Post moved to Editing: Phishing in 60 Seconds", 1, 15],
  ["Campaign created: AI for Business", 1, 9],
  ["New content idea created: Poll: What slows your business down most?", 0, 8],
];
const activity = ACT.map(([text, ago, h], i) => ({ id: `a${i}`, text, at: stamp(ago, h) })).reverse();

const A = (name: string, kind: Asset["kind"], size: string, tags: string[], hue: number): Omit<Asset, "id" | "addedAt"> => ({ name, kind, size, tags, hue });
const assets: Asset[] = [
  A("cover-5-mistakes.png", "graphic", "1.2 MB", ["website", "carousel"], 28), A("studio-team-photo.jpg", "image", "3.8 MB", ["team"], 40),
  A("office-wide.jpg", "image", "4.1 MB", ["office", "bts"], 36), A("rough-cut-bts-v2.mp4", "video", "48 MB", ["bts", "reel"], 22),
  A("before-after-reveal.mp4", "video", "62 MB", ["before-after"], 30), A("carousel-template.fig", "graphic", "2.2 MB", ["template"], 34),
  A("brand-guidelines-v1.pdf", "document", "6.4 MB", ["brand"], 26), A("content-calendar-q4.pdf", "document", "0.9 MB", ["planning"], 32),
  A("cyberzik-logo-full.png", "brand", "0.2 MB", ["logo"], 24), A("cyberzik-mark.png", "brand", "0.1 MB", ["logo"], 24),
  A("brand-palette.png", "brand", "0.3 MB", ["colour"], 38), A("phishing-explainer.mp4", "video", "31 MB", ["security"], 20),
  A("mfa-diagram.png", "graphic", "0.8 MB", ["security"], 42), A("founder-portrait.jpg", "image", "2.9 MB", ["founder"], 44),
  A("case-study-logistics.pdf", "document", "5.1 MB", ["case-study"], 28), A("story-template.fig", "graphic", "1.7 MB", ["template", "story"], 34),
  A("testimonial-quote-card.png", "graphic", "0.6 MB", ["testimonial"], 30), A("thumbnail-launch-checklist.png", "image", "0.5 MB", ["thumbnail"], 36),
].map((a, i) => ({ ...a, id: `as-${i + 1}`, addedAt: stamp(i + 1) }));

export const seedState = (): HubState => ({
  items, campaigns: CAMPAIGNS, pillars: PILLARS, assets, activity,
  people: [{ id: "Isaac", name: "Isaac" }, { id: "Zainab", name: "Zainab" }, { id: "Tobi", name: "Tobi" }],
});
