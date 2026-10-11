import { Sky } from './sky';
import { SkyControl } from './components/SkyControl';
import { Hero } from './components/Hero';
import { Experience } from './components/Experience';
import { Footer } from './components/Footer';
import { useSkyTime } from './hooks/useSkyTime';

export default function App() {
  const skyTime = useSkyTime();

  return (
    <div className={`site ${skyTime.light ? 'day' : 'night'}`}>
      <Sky hour={skyTime.hour} />
      <div className="veil" />
      <main>
        <header className="masthead">
          <a className="monogram" href="#top" aria-label="Andrew Young home">
            ay.
          </a>
          <SkyControl {...skyTime} />
        </header>
        <Hero />
        <Experience />
        <Footer hour={skyTime.hour} />
      </main>
    </div>
  );
}
