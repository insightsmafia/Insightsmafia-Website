type LogoProps = {
  size?: 'md' | 'sm';
  showTagline?: boolean;
};

export default function Logo({ size = 'md', showTagline = true }: LogoProps) {
  return (
    <div className={`logo logo-${size}`}>
      <span className="logo-word">
        <span className="logo-insights">insights</span>
        <span className="logo-mafia">mafia</span>
      </span>
      {showTagline && <span className="logo-tagline">You Dream. We Create!</span>}
    </div>
  );
}
