import { useState } from 'react';
import { jobs } from '../data/jobs';
import { useScrollAnchor } from '../useScrollAnchor';

export function Experience() {
  const [open, setOpen] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  // Keep the tapped row in place when a taller row above it closes.
  const holdRow = useScrollAnchor(open);
  const previewed = hovered ?? open;
  return (
    <section className="experience" aria-label="Experience">
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
                <ul>
                  {job.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <div className="detail-summary">
                  <img className="detail-image" src={job.logo} alt="" />
                  <p className="meta">{job.tags}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <aside className={`preview ${previewed === null ? '' : 'visible'}`} aria-hidden="true">
          <div className="preview-label">
            <span>{String(jobs.length - (previewed ?? 0)).padStart(2, '0')}</span>
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
  );
}
