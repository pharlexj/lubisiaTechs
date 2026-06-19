import { Link } from "wouter";
import { ExternalLink, CheckCircle2, Clock, ArrowRight, Globe, Wifi, Users, Database, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PROJECTS = [
  {
    id: "cpsb-transnzoia-web",
    client: "CPSB Trans Nzoia",
    fullName: "County Public Service Board — Trans Nzoia County",
    title: "Website Modernisation to Modern Stack",
    status: "Completed",
    year: "2024",
    category: "Web Development",
    icon: Globe,
    url: "https://cpsbtransnzoia.co.ke/",
    tags: ["Website Upgrade", "Modern Stack", "Mobile Responsive", "CMS", "Performance"],
    summary:
      "The CPSB Trans Nzoia website was running on an outdated platform that was slow, not mobile-friendly, and difficult to maintain. LubisiaTech Solutions modernised the entire site, delivering a fast, responsive, and content-managed experience for county residents and job applicants.",
    problem:
      "The existing website was built on a legacy stack with no mobile responsiveness, long load times, and an admin interface that required technical knowledge to update — making content management a burden for board staff.",
    solution:
      "We rebuilt the site from the ground up using a modern web stack. The new site loads significantly faster, works across all screen sizes, and includes a straightforward content management system that lets non-technical staff update announcements, job vacancies, and board information without developer involvement.",
    outcomes: [
      "Fully mobile-responsive design across all devices",
      "Significantly reduced page load times",
      "CMS-powered content updates without developer dependency",
      "Improved accessibility and SEO for county residents",
      "Secure, maintainable codebase ready for future expansion",
    ],
    before: {
      label: "Before",
      points: ["Legacy platform, not mobile-friendly", "Slow load times", "Difficult content management", "Outdated design"],
    },
    after: {
      label: "After",
      points: ["Modern responsive design", "Fast, optimised performance", "Easy self-service CMS", "Clean, professional appearance"],
    },
  },
  {
    id: "cpsb-transnzoia-intercom",
    client: "CPSB Trans Nzoia",
    fullName: "County Public Service Board — Trans Nzoia County",
    title: "Intercom System Installation & Configuration",
    status: "Completed",
    year: "2024",
    category: "Hardware & Networking",
    icon: Wifi,
    url: null,
    tags: ["Hardware", "Networking", "Intercom", "Office Infrastructure", "Configuration"],
    summary:
      "LubisiaTech Solutions installed and fully configured a professional intercom communication system at the CPSB Trans Nzoia offices, improving both internal staff communication and the experience of visitors and job applicants at the reception.",
    problem:
      "The board offices lacked a structured internal communication system, creating inefficiencies in routing visitors to the right departments and causing delays in inter-office coordination during busy recruitment periods.",
    solution:
      "We supplied, installed, and configured a modern intercom system throughout the office premises. The setup covers key departments, reception, and secure access points, enabling seamless communication between staff and controlled visitor access.",
    outcomes: [
      "Reduced visitor wait times at reception",
      "Faster inter-department communication",
      "Improved visitor access control and security",
      "Full staff training on system operation",
      "Documented configuration for future maintenance",
    ],
    before: {
      label: "Before",
      points: ["No structured internal communication", "Visitors routed manually", "Slow inter-office coordination", "No access control at entry points"],
    },
    after: {
      label: "After",
      points: ["Connected intercom across departments", "Smooth visitor reception flow", "Instant inter-office calls", "Controlled, professional entry management"],
    },
  },
  {
    id: "cpsb-bungoma-recruitment",
    client: "CPSB Bungoma",
    fullName: "County Public Service Board — Bungoma County",
    title: "Digital Recruitment Management System",
    status: "In Progress",
    year: "2025",
    category: "Web Application",
    icon: Users,
    url: null,
    tags: ["Web App", "Recruitment", "Database", "Workflow Automation", "Government"],
    summary:
      "LubisiaTech Solutions is designing and building a comprehensive digital recruitment system for the Bungoma County Public Service Board. The system will handle the full hiring lifecycle — from job advertisement through application, shortlisting, and appointment.",
    problem:
      "CPSB Bungoma's recruitment process was largely paper-based and manual, leading to administrative bottlenecks, difficulty tracking applications, and a poor experience for applicants who had no way to check their status online.",
    solution:
      "We are building a full-stack recruitment platform tailored to county government requirements. The system includes a public-facing job portal for applicants, an admin dashboard for board staff to manage vacancies and review applications, automated shortlisting tools, and real-time status notifications for candidates.",
    outcomes: [
      "End-to-end digital recruitment workflow",
      "Public job portal for county residents",
      "Admin dashboard for vacancy and applicant management",
      "Automated shortlisting and scoring tools",
      "Applicant status tracking and email notifications",
    ],
    before: {
      label: "Current State",
      points: ["Paper-based application process", "Manual shortlisting and tracking", "No online job listings", "No applicant status visibility"],
    },
    after: {
      label: "Target State",
      points: ["Fully online application portal", "Automated workflow and shortlisting", "Real-time applicant dashboard", "Transparent, auditable process"],
    },
  },
  {
    id: "cpsb-westpokot-recruitment",
    client: "CPSB West Pokot",
    fullName: "County Public Service Board — West Pokot County",
    title: "Digital Recruitment Management System",
    status: "In Progress",
    year: "2025",
    category: "Web Application",
    icon: Database,
    url: null,
    tags: ["Web App", "Recruitment", "Database", "Workflow Automation", "Government"],
    summary:
      "Building a tailored digital recruitment management system for the West Pokot County Public Service Board, streamlining the hiring process for county government positions and making recruitment more accessible to residents across the county.",
    problem:
      "The West Pokot CPSB faced similar challenges to many county boards — reliance on physical application forms, centralised submission points that disadvantaged rural applicants, and a labour-intensive review process for board secretariat staff.",
    solution:
      "We are developing a county-specific recruitment platform that accounts for West Pokot's unique geographic and connectivity needs. The system includes offline-resilient design considerations, SMS-based status notifications for applicants without consistent internet access, and a streamlined admin interface built around the board's specific workflow.",
    outcomes: [
      "Accessible online job portal with offline-friendly design",
      "SMS notifications for applicants with limited internet access",
      "Streamlined admin workflow for board secretariat",
      "Centralised application tracking and reporting",
      "Reduced administrative overhead and paper usage",
    ],
    before: {
      label: "Current State",
      points: ["Physical application forms only", "Centralised drop-off disadvantages rural applicants", "High admin overhead", "No digital records or audit trail"],
    },
    after: {
      label: "Target State",
      points: ["Online + SMS-accessible applications", "Rural-inclusive, accessible portal", "Automated record-keeping", "Full audit trail and reporting"],
    },
  },
];

const TESTIMONIALS = [
  {
    id: "cpsb-tn-web",
    quote:
      "The transformation was remarkable. Our old site was an embarrassment — slow, broken on phones, and our staff dreaded updating it. LubisiaTech delivered a site we're proud to share with the public. Residents can now find vacancies and board information easily, and our team manages content without calling a developer.",
    author: "Board Secretariat",
    role: "County Public Service Board",
    organisation: "CPSB Trans Nzoia County",
    project: "Website Modernisation",
    initials: "TN",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "cpsb-tn-intercom",
    quote:
      "Before the installation, routing visitors was chaotic — staff had to walk across offices to pass messages. Now everything flows through the intercom and our reception is calm and professional. LubisiaTech handled the setup thoroughly and made sure every department was trained before leaving.",
    author: "Office Administrator",
    role: "Administration Department",
    organisation: "CPSB Trans Nzoia County",
    project: "Intercom Installation",
    initials: "OA",
    color: "bg-purple-100 text-purple-700",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Web Development": "bg-blue-100 text-blue-700",
  "Hardware & Networking": "bg-purple-100 text-purple-700",
  "Web Application": "bg-green-100 text-green-700",
};

export function Portfolio() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-foreground text-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold mb-4 uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4" />
              Our Work
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Projects We're Proud Of
            </h1>
            <p className="text-lg text-muted max-w-2xl">
              Real solutions delivered for county government institutions and businesses across Kenya.
              Every project here reflects our commitment to quality, reliability, and results.
            </p>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b bg-muted/50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">4</div>
              <div className="text-sm text-muted-foreground mt-1">Projects Delivered / Active</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">3</div>
              <div className="text-sm text-muted-foreground mt-1">County Government Clients</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">2</div>
              <div className="text-sm text-muted-foreground mt-1">Completed Projects</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">2</div>
              <div className="text-sm text-muted-foreground mt-1">Systems In Progress</div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-16">
        <div className="container mx-auto px-4 space-y-20">
          {PROJECTS.map((project, idx) => {
            const Icon = project.icon;
            return (
              <article
                key={project.id}
                data-testid={`article-project-${project.id}`}
                className="scroll-mt-20"
              >
                {/* Project header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8 pb-6 border-b">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-1">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        {project.fullName} · {project.year}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">{project.title}</h2>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[project.category] ?? "bg-muted text-muted-foreground"}`}>
                          {project.category}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          project.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {project.status === "Completed" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                          {project.status}
                        </span>
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                            data-testid={`link-visit-${project.id}`}
                          >
                            Visit live site <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 md:max-w-xs">
                    {project.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <p className="text-muted-foreground leading-relaxed mb-10 max-w-3xl text-base">
                  {project.summary}
                </p>

                {/* Problem / Solution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                    <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-red-200 text-red-700 flex items-center justify-center text-xs font-bold">!</span>
                      The Challenge
                    </h3>
                    <p className="text-red-900/80 text-sm leading-relaxed">{project.problem}</p>
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
                    <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Our Solution
                    </h3>
                    <p className="text-green-900/80 text-sm leading-relaxed">{project.solution}</p>
                  </div>
                </div>

                {/* Before / After */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <div className="bg-muted/60 rounded-2xl p-6 border border-border">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">{project.before.label}</div>
                    <ul className="space-y-2">
                      {project.before.points.map(p => (
                        <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1 h-2 w-2 rounded-full bg-muted-foreground/50 shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
                    <div className="text-xs font-bold uppercase tracking-wider text-primary mb-4">{project.after.label}</div>
                    <ul className="space-y-2">
                      {project.after.points.map(p => (
                        <li key={p} className="flex items-start gap-2 text-sm text-foreground">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-primary shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Outcomes */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-semibold mb-4">Key Outcomes</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {project.outcomes.map(outcome => (
                      <div key={outcome} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {idx < PROJECTS.length - 1 && (
                  <div className="mt-16 border-t border-dashed border-border" />
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/40 border-y">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold mb-3 uppercase tracking-wider">
              <Quote className="h-4 w-4" />
              Client Voices
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-3">What Our Clients Say</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Feedback from the institutions we've had the privilege of serving.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.id}
                data-testid={`figure-testimonial-${t.id}`}
                className="bg-card border border-border rounded-2xl p-8 shadow-sm flex flex-col gap-6 relative"
              >
                {/* Large decorative quote mark */}
                <span className="absolute top-6 right-7 text-7xl font-serif leading-none text-primary/10 select-none pointer-events-none">
                  &ldquo;
                </span>

                {/* Project tag */}
                <div className="inline-flex items-center gap-1.5 self-start">
                  <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                    {t.project}
                  </span>
                </div>

                {/* Quote body */}
                <blockquote className="text-foreground/90 text-base leading-relaxed italic flex-1">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Attribution */}
                <figcaption className="flex items-center gap-4 pt-4 border-t border-border">
                  <div className={`w-11 h-11 rounded-full shrink-0 flex items-center justify-center font-bold text-sm ${t.color}`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.author}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                    <div className="text-xs text-muted-foreground font-medium mt-0.5">{t.organisation}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-10">
            Testimonials reflect client feedback on completed engagements. Contact us for references.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Have a project in mind?</h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
            We build tailored digital solutions for businesses and government institutions across Kenya.
            Let's talk about what we can create together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="font-semibold px-8 text-primary">
                Start a Conversation
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="font-semibold px-8 border-white/30 text-white hover:bg-white/10">
                View Our Services <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
