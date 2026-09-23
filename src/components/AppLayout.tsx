import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router';
import { setMuted as setAudioMuted, unlock as unlockAudio } from '../audio/audioEngine';
import BrandTitle from './BrandTitle';
import Navigation from './Navigation';

export interface LayoutContext {
  muted: boolean;
  toggleMuted: () => void;
}

export default function AppLayout() {
  // Session-only audio setting; resets to sound-on on every reload.
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setAudioMuted(muted);
  }, [muted]);

  const context: LayoutContext = {
    muted,
    toggleMuted: () => {
      unlockAudio();
      setMuted((m) => !m);
    },
  };

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
