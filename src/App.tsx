import { useEffect, useState } from 'react';
import { Sky } from './sky';

const jobs = [
 {name:'Notability', logo:'/notability.svg', role:'Software Engineering Co-op', dates:'Jul 2026 — Present', place:'San Francisco, CA', outcome:'A new home for 25k+ weekly users', tags:'React · TypeScript · Electron · Redux', summary:'Building the desktop experience for the way people actually take notes.', bullets:[
 'Built the meetings-first home screen for the Electron desktop launch. It now serves 25k+ weekly active users and accounts for nearly a third of desktop note creation, covered by 80+ automated tests.',
 'Shipped an upcoming-meetings card with six calendar connection states: 100k+ impressions, 15k+ users, and 1,000+ meeting notes started in its first month.',
 'Rebuilt recent notes around last-opened ordering, driving 45k+ note opens. Consolidated study-surface preferences into a persisted setting shared with iOS and Android.',
 'Migrated web support to Intercom with a safe rollback path; it now handles 400+ conversations weekly. Set up a product-video sign-in experiment with Mixpanel funnel tracking.' ]},
 {name:'Strella', logo:'/strella.avif', role:'Software Engineer Co-op', dates:'Jun — Dec 2025', place:'New York, NY · Remote', outcome:'Research tools, from playback to CRM', tags:'TypeScript · Video · HubSpot · Mixpanel', summary:'Making AI-powered customer research easier to watch, share, and act on.', bullets:[
 'Rebuilt the shared video player with draggable Picture-in-Picture, VTT subtitles, cached seek previews, and nested playback settings across web and mobile.',
 'Built the HubSpot integration end to end, including whitelist-based access control, sync debugging, in-app entry points, documentation, and a launch demo.',
 'Instrumented 40+ Mixpanel events and built four dashboards used daily by sales, product, and customer success. Shipped AI-generated interview summaries to Slack.',
 'Audited routes, added missing session checks through shared authentication middleware, removed unused endpoints, and repaired a failing production cron job.' ]},
 {name:'Lola Dating', logo:'/lola.jpeg', role:'Software Engineer Intern', dates:'Apr — Aug 2024', place:'Concord, MA', outcome:'200+ profile shares in the first week', tags:'Vue.js · Go · SQL · PostgreSQL', summary:'Connecting people, and building the tools behind those connections.', bullets:[
 'Built profile sharing end to end with a Vue.js page and Go backend, reaching 200+ shares in its first week on a 10k-user app.',
 'Paginated the past-matches endpoint and wired SMS opt-in through Klaviyo and Postgres.',
 'Expanded the support console with ticket categories, market filters, and the daily metrics the team used each morning.' ]}
];
function sfMinutes() { const p = new Intl.DateTimeFormat('en-US',{timeZone:'America/Los_Angeles',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());return Number(p.find(x=>x.type==='hour')?.value)*60+Number(p.find(x=>x.type==='minute')?.value); }
function timeLabel(n:number) { return `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`; }
export default function Home(){
 const [now,setNow]=useState<number|null>(null);const [manual,setManual]=useState<number|null>(null); const [open,setOpen]=useState<number|null>(null);
 useEffect(()=>{setNow(sfMinutes());const timer=setInterval(()=>setNow(sfMinutes()),15000);return()=>clearInterval(timer)},[]);
 const minutes=manual??now??1320; const hour=minutes/60; const light=hour>=7.5&&hour<18; const phase=hour<5?'Night':hour<7.5?'Dawn':hour<11?'Morning fog':hour<16?'Clear skies':hour<18?'Late light':hour<20.5?'Dusk':'Night';
 return <div className={`site ${light?'day':'night'}`}>
  <Sky hour={hour}/><div className="veil"/>
  <main>
   <header className="masthead"><a className="monogram" href="#top" aria-label="Andrew Young home">ay.</a><span className="location">SAN FRANCISCO <span className="clock">{now===null?'—':timeLabel(now)} PT</span></span><span className="phase">{phase}</span></header>
   <section id="top" className="hero" aria-labelledby="name"><p className="eyebrow">SOFTWARE ENGINEER</p><h1 id="name">Andrew <em>Young</em><span className="period">.</span></h1><div className="intro"><p>I build thoughtful software.<br/>Currently at <a href="https://notability.com">Notability</a>, making room for better notes.</p><nav aria-label="Contact"><a href="mailto:andrewy445@gmail.com">Email</a><a href="https://github.com/andrewd-young" target="_blank" rel="noreferrer">GitHub</a><a href="https://www.linkedin.com/in/andrew-young-99b2a220b" target="_blank" rel="noreferrer">LinkedIn</a></nav></div></section>
   <section className="experience" aria-labelledby="experience"><div className="section-label"><h2 id="experience">SELECTED EXPERIENCE</h2><span>2024 — NOW</span></div><div className="table-head" aria-hidden="true"><span>COMPANY</span><span>ROLE / YEARS</span><span>THE WORK</span><span/></div>
   {jobs.map((job,i)=><article className={`job ${open===i?'expanded':''}`} key={job.name}><button className="job-row" onClick={()=>setOpen(open===i?null:i)} aria-expanded={open===i} aria-controls={`job-${i}`}><span className="company"><span className="logo"><img src={job.logo} alt=""/></span><span>{job.name}</span></span><span className="job-role">{job.role}<small>{job.dates}</small></span><span className="outcome">{job.outcome}</span><span className="expand" aria-hidden="true">{open===i?'−':'+'}</span></button><div id={`job-${i}`} hidden={open!==i} className="job-detail"><div><p className="detail-lead">{job.summary}</p><p className="meta">{job.place}</p><p className="meta">{job.tags}</p></div><ul>{job.bullets.map(b=><li key={b}>{b}</li>)}</ul></div></article>)}
   </section>
   <section className="about"><div><h2 className="eyebrow">A LITTLE CONTEXT</h2><p className="about-copy">Computer science.<br/>A little finance.<br/><em>A lot of curiosity.</em></p></div><div className="about-text"><p>I’m studying Computer Science and Finance at Northeastern’s Khoury College, graduating in August 2027. My work spans interfaces, integrations, and the systems behind them.</p><p>Beyond the classroom: Skateboarding Club, apparel chair at Phi Gamma Delta, and semesters abroad in London and Sydney.</p><a className="resume" href="/Andrew_Young_Resume.pdf" target="_blank" rel="noreferrer">Read my résumé <span>PDF</span></a></div></section>
   <footer><span>Andrew Young</span><span>Somewhere between the fog and the code.</span><a href="mailto:andrewy445@gmail.com">Say hello</a></footer>
  </main>
  <aside className="sky-control" aria-label="Sky appearance"><div className="control-heading"><label htmlFor="sky-hour">A day in San Francisco</label><button className={manual===null?'live active':'live'} onClick={()=>setManual(null)} aria-pressed={manual===null}><span/>Live</button></div><div className="range-row"><span aria-hidden="true">☾</span><input id="sky-hour" type="range" min="0" max="1439" step="1" value={minutes} onChange={e=>setManual(Number(e.target.value))} aria-valuetext={`${timeLabel(minutes)}, ${phase}`}/><span aria-hidden="true">☀</span><output htmlFor="sky-hour">{timeLabel(minutes)}</output></div><p>{manual===null?'The sky follows Pacific time.':'Your own little time machine.'}</p></aside>
 </div>
}
