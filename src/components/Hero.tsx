export function Hero() {
  return (
    <section id="top" className="hero" aria-labelledby="name">
      <h1 id="name">
        Andrew Young<span className="period">.</span>
      </h1>
      <div className="intro">
        <p>
          Building the{' '}
          <a className="text-link" href="https://notability.com">
            Notability
          </a>{' '}
          desktop app.
          <br />
          Studying computer science and finance at Northeastern.
        </p>
        <nav aria-label="Contact">
          <a className="text-link" href="mailto:andrewy445@gmail.com">
            Email
          </a>
          <a
            className="text-link"
            href="https://github.com/andrewd-young"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            className="text-link"
            href="https://www.linkedin.com/in/andrew-young-99b2a220b"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a className="text-link" href="/Andrew_Young_Resume.pdf" target="_blank" rel="noreferrer">
            Resume
          </a>
        </nav>
      </div>
    </section>
  );
}
