import { OMark, XMark } from '../components/Marks';

export default function AboutPage() {
  return (
    <section className="page">
      <svg className="about__art" viewBox="-10 -10 220 120" aria-hidden="true" focusable="false">
        <XMark x={0} y={0} size={100} />
        <OMark x={100} y={0} size={100} />
      </svg>
      <hr className="about__divider" />
      <h1 className="about__title">אודות</h1>
      <div className="about__text">
        <p>איקס עיגול הוא משחק קלאסי ופשוט שאהוב על כולם.</p>
        <p>
          במשחק זה אתה משחק נגד המחשב. המטרה היא לסדר שלושה סימנים רצופים בשורה, בעמודה או
          באלכסון.
        </p>
        <p>תהנה!</p>
      </div>
      <p className="about__credit">פותח על ידי תלמידי ג'ון ברייס התותחים</p>
    </section>
  );
}
