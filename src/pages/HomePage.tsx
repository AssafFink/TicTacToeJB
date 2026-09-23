import { Link } from 'react-router';
import BrandTitle from '../components/BrandTitle';
import NeonBoardArt from '../components/NeonBoardArt';
import { InfoIcon, PlayIcon } from '../components/icons';

export default function HomePage() {
  return (
    <section className="page">
      <NeonBoardArt className="home__art" />
      <h1 className="home__title">
        <BrandTitle />
      </h1>
      <p className="home__tagline">משחק קלאסי. בכל זמן. בכל מקום.</p>
      <div className="home__actions">
        <Link to="/game" className="btn btn--primary">
          התחל לשחק
          <PlayIcon />
        </Link>
        <Link to="/about" className="btn btn--secondary">
          אודות
          <InfoIcon />
        </Link>
      </div>
    </section>
  );
}
