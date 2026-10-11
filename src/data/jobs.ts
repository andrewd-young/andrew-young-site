type Job = {
  name: string;
  logo: string;
  role: string;
  years: string;
  city: string;
  tags: string;
  bullets: string[];
};

export const jobs: Job[] = [
  {
    name: 'Notability',
    logo: '/logos/notability.jpg',
    role: 'Software Engineer Co-op',
    years: '2026 - Now',
    city: 'San Francisco',
    tags: 'React · TypeScript · Redux · Electron',
    bullets: [
      'Built the meetings-first home screen for the Electron desktop launch. It now serves 25k+ weekly active users and accounts for nearly a third of desktop note creation, covered by 80+ automated tests.',
      'Shipped an upcoming-meetings card with six calendar connection states: 100k+ impressions, 15k+ users, and 1,000+ meeting notes started in its first month.',
      'Rebuilt recent notes around last-opened ordering, driving 45k+ note opens. Consolidated study-surface preferences into a persisted setting shared with iOS and Android.',
      'Migrated web support to Intercom with a safe rollback path; it now handles 400+ conversations weekly. Set up a product-video sign-in experiment with Mixpanel funnel tracking.',
    ],
  },
  {
    name: 'Strella',
    logo: '/logos/strella.jpg',
    role: 'Software Engineer Co-op',
    years: '2025',
    city: 'New York (remote)',
    tags: 'Next.js · TypeScript · Prisma · HubSpot · Mixpanel',
    bullets: [
      'Rebuilt the shared video player with draggable Picture-in-Picture, VTT subtitles, cached seek previews, and nested playback settings across web and mobile.',
      'Built the HubSpot integration end to end, including whitelist-based access control, sync debugging, in-app entry points, documentation, and a launch demo.',
      'Instrumented 40+ Mixpanel events and built four dashboards used daily by sales, product, and customer success. Shipped AI-generated interview summaries to Slack.',
      'Audited routes, added missing session checks through shared authentication middleware, removed unused endpoints, and repaired a failing production cron job.',
    ],
  },
  {
    name: 'Lola',
    logo: '/logos/lola.jpg',
    role: 'Software Engineer Intern',
    years: '2024',
    city: 'Concord, MA',
    tags: 'Vue.js · Go · SQL · PostgreSQL',
    bullets: [
      'Built profile sharing end to end with a Vue.js page and Go backend, reaching 200+ shares in its first week on a 10k-user app.',
      'Paginated the past-matches endpoint and wired SMS opt-in through Klaviyo and Postgres.',
      'Expanded the support console with ticket categories, market filters, and the daily metrics the team used each morning.',
    ],
  },
];
