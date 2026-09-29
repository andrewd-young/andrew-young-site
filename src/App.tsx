import { useEffect, useState } from 'react';
import { Sky } from './sky';
import { nextSunEvent } from './sun';
import { useScrollAnchor } from './useScrollAnchor';

type Job = {
  name: string;
  logo: string;
  role: string;
  years: string;
  city: string;
  tags: string;
  bullets: string[];
};

const jobs: Job[] = [
  {
    name: 'Notability',
    logo: '/logos/notability.jpg',
    role: 'Software Engineer Co-op',
    years: '2026 — Now',
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

function sfMinutes() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return get('hour') * 60 + get('minute');
}

function timeLabel(n: number) {
  return `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
}

function durationLabel(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function phaseFor(hour: number) {
  if (hour < 5) return 'Night';
  if (hour < 7.5) return 'Dawn';
  if (hour < 11) return 'Morning fog';
  if (hour < 16) return 'Clear skies';
  if (hour < 18) return 'Late light';
  if (hour < 20.5) return 'Dusk';
  return 'Night';
}

export default function App() {
  const [now, setNow] = useState(sfMinutes);
  const [manual, setManual] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [controlOpen, setControlOpen] = useState(false);

  // Opening a row can close a taller row above it. Keep the tapped row in place so the
  // new content expands downward.
  const holdRow = useScrollAnchor(open);

  useEffect(() => {
    const timer = setInterval(() => setNow(sfMinutes()), 15000);
    return () => clearInterval(timer);
  }, []);

  const minutes = manual ?? now;
  const hour = minutes / 60;
  const light = hour >= 7.5 && hour < 18;
  const phase = phaseFor(hour);
  const previewed = hovered ?? open;
  // `now` changes every 15 seconds, so this stays current.
  const sun = nextSunEvent();

  return (
    <div className={`site ${light ? 'day' : 'night'}`}>
      <Sky hour={hour} />
      <div className="veil" />
      <main>
        <header className="masthead">
          <a className="monogram" href="#top" aria-label="Andrew Young home">
            ay.
          </a>
          <span className="location">
            San Francisco <span className="clock">{timeLabel(now)} PT</span>
          </span>
          <span className="phase">{phase}</span>
        </header>

        <section id="top" className="hero" aria-labelledby="name">
          <p className="eyebrow">Software engineer</p>
          <h1 id="name">
            Andrew Young<span className="period">.</span>
          </h1>
          <div className="intro">
            <p>
              Building the <a href="https://notability.com">Notability</a> desktop app.
              <br />
              Studying computer science and finance at Northeastern.
            </p>
            <nav aria-label="Contact">
              <a href="mailto:andrewy445@gmail.com">Email</a>
              <a href="https://github.com/andrewd-young" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/andrew-young-99b2a220b"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <a href="/Andrew_Young_Resume.pdf" target="_blank" rel="noreferrer">
                Résumé
              </a>
            </nav>
          </div>
        </section>

        <section className="experience" aria-labelledby="experience">
          <div className="section-label">
            <h2 id="experience">Experience</h2>
          </div>
          <div className="work">
            <div className="rows" onMouseLeave={() => setHovered(null)}>
              <div className="table-head" aria-hidden="true">
                <span>Company</span>
                <span>Role</span>
                <span>Years</span>
                <span>City</span>
                <span />
              </div>
              {jobs.map((job, i) => (
                <article className={`job ${open === i ? 'expanded' : ''}`} key={job.name}>
                  <button
                    className="job-row"
                    onClick={(e) => {
                      holdRow(e.currentTarget);
                      setOpen(open === i ? null : i);
                    }}
                    onMouseEnter={() => setHovered(i)}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(null)}
                    aria-expanded={open === i}
                    aria-controls={`job-${i}`}
                  >
                    <span className="company">{job.name}</span>
                    <span className="job-role">{job.role}</span>
                    <span className="job-years">{job.years}</span>
                    <span className="job-city">{job.city}</span>
                    <span className="expand" aria-hidden="true">
                      {open === i ? '−' : '+'}
                    </span>
                  </button>
                  <div id={`job-${i}`} hidden={open !== i} className="job-detail">
                    <img className="detail-image" src={job.logo} alt="" />
                    <p className="meta">{job.tags}</p>
                    <ul>
                      {job.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
            <aside className={`preview ${previewed === null ? '' : 'visible'}`} aria-hidden="true">
              <div className="preview-label">
                <span>{String((previewed ?? 0) + 1).padStart(2, '0')}</span>
                <span>{jobs[previewed ?? 0].name}</span>
              </div>
              <div className="preview-frame">
                {jobs.map((job, i) => (
                  <img
                    key={job.name}
                    src={job.logo}
                    alt=""
                    className={previewed === i ? 'shown' : ''}
                  />
                ))}
              </div>
              <p className="meta">{jobs[previewed ?? 0].tags}</p>
            </aside>
          </div>
        </section>
        <footer>
          <span>© {new Date().getFullYear()} Andrew Young</span>
          <span className="sun">
            {sun.kind} in San Francisco in {durationLabel(sun.minutesAway)}
          </span>
          <a
            href="https://github.com/andrewd-young/andrew-young-site"
            target="_blank"
            rel="noreferrer"
          >
            Source
          </a>
        </footer>
      </main>

      <aside className={`sky-control ${controlOpen ? 'open' : ''}`} aria-label="Sky time">
        {controlOpen && (
          <div className="range-row">
            <input
              id="sky-hour"
              type="range"
              min="0"
              max="1439"
              step="1"
              value={minutes}
              // The 16px thumb stops 8px from each end, so the fill follows its center.
              style={
                { '--fill': `calc(8px + (100% - 16px) * ${minutes / 1439})` } as React.CSSProperties
              }
              onChange={(e) => setManual(Number(e.target.value))}
              aria-label="Time of day"
              aria-valuetext={`${timeLabel(minutes)}, ${phase}`}
            />
            <button
              className={manual === null ? 'live active' : 'live'}
              onClick={() => setManual(null)}
              aria-pressed={manual === null}
            >
              <span />
              Live
            </button>
          </div>
        )}
        <button
          className="sky-toggle"
          onClick={() => setControlOpen(!controlOpen)}
          aria-expanded={controlOpen}
          aria-label={controlOpen ? 'Close sky time control' : 'Change sky time'}
        >
          <span aria-hidden="true">{light ? '☀' : '☾'}</span>
          <output htmlFor="sky-hour">{timeLabel(minutes)}</output>
        </button>
      </aside>
    </div>
  );
}
