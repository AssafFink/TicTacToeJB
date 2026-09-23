import { useEffect, useRef, useState, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router';
import { CloseIcon, HomeIcon, InfoIcon, MenuIcon, PlayIcon } from './icons';

const NAV_ITEMS: { to: string; label: string; icon: ReactNode }[] = [
  { to: '/', label: 'בית', icon: <HomeIcon /> },
  { to: '/game', label: 'משחק', icon: <PlayIcon /> },
  { to: '/about', label: 'אודות', icon: <InfoIcon /> },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  // Close the menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      toggleRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="icon-btn icon-btn--plain nav-toggle"
        aria-label="פתח תפריט"
        aria-expanded={open}
        aria-controls="nav-panel"
        onClick={() => setOpen(true)}
      >
        <MenuIcon />
      </button>

      {open && (
        <div className="nav-overlay" onClick={() => setOpen(false)}>
          <nav
            id="nav-panel"
            className="nav-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="nav-panel-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="nav-panel__header">
              <h2 id="nav-panel-title" className="nav-panel__title">
                תפריט
              </h2>
              <button
                ref={closeRef}
                type="button"
                className="icon-btn icon-btn--plain"
                aria-label="סגור תפריט"
                onClick={() => setOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <ul className="nav-panel__list">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end className="nav-link" onClick={() => setOpen(false)}>
                    {item.icon}
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
