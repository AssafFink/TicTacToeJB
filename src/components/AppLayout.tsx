import { useState } from 'react';
import { Link, Outlet } from 'react-router';
import BrandTitle from './BrandTitle';
import Navigation from './Navigation';

export interface LayoutContext {
  muted: boolean;
  toggleMuted: () => void;
}

export default function AppLayout() {
  // Session-only audio setting; resets to sound-on on every reload.
  const [muted, setMuted] = useState(false);
  const context: LayoutContext = { muted, toggleMuted: () => setMuted((m) => !m) };

  return (
    <div className="app">
      <div className="space-bg" aria-hidden="true">
        <div className="space-bg__stars" />
        <div className="space-bg__planet" />
      </div>
      <header className="app-header">
        <Navigation />
        <Link to="/" className="app-header__title" aria-label="איקס עיגול — עמוד הבית">
          <BrandTitle />
        </Link>
      </header>
      <main className="app-main">
        <Outlet context={context} />
      </main>
    </div>
  );
}
