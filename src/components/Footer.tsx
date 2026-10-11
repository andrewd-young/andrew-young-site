import { Icon, SkyIllustration } from '../icons';
import { nextSunEvent } from '../sun';
import { durationLabel } from '../time';

export function Footer({ hour }: { hour: number }) {
  const sun = nextSunEvent();
  return (
    <footer>
      <span>Andrew Young · {new Date().getFullYear()}</span>
      <span className="sun">
        <SkyIllustration hour={hour} />
        <span className="sun-copy">
          <span className="sun-event">
            {sun.kind} in {durationLabel(sun.minutesAway)}
          </span>
          <span className="sun-location">San Francisco</span>
        </span>
      </span>

      <a
        className="source-link"
        href="https://github.com/andrewd-young/andrew-young-site"
        target="_blank"
        rel="noreferrer"
      >
        <Icon name="tool" />
        <span className="text-link">Source</span>
      </a>
    </footer>
  );
}
