import { Icon } from '../icons';
import { nextSunEvent } from '../sun';
import { durationLabel } from '../time';

export function Footer() {
  const sun = nextSunEvent();
  return (
    <footer>
      <span>Andrew Young · {new Date().getFullYear()}</span>
      <span className="sun">
        {sun.kind} in San Francisco in {durationLabel(sun.minutesAway)}
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
