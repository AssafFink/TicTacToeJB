# CLAUDE.md — איקס עיגול

משחק איקס־עיגול (3×3) לשחקן יחיד מול המחשב. אפליקציית Frontend סטטית בלבד (SPA + PWA), בעברית וב־RTL, מיועדת ל־Chrome במובייל וב־Desktop.

## מסמכי ה־Spec — מקור האמת

כל ההחלטות נגזרות מהמסמכים ב־`spec/`. יש לקרוא את המסמך הרלוונטי לפני מימוש:

- [spec/PRD.md](spec/PRD.md) — דרישות המוצר, מקרי קצה ו־Out of Scope.
- [spec/ARCHITECTURE.md](spec/ARCHITECTURE.md) — Stack, מבנה תיקיות, מודל State, לוגיקת המחשב, Audio, PWA.
- [spec/DESIGN.md](spec/DESIGN.md) — מסכים ו־Style Guide; תמונות ייחוס: `wireframes.png` (פריסה), `mockups.png` (מראה סופי), `style-guide.png` (שפה עיצובית).
- [spec/MILESTONES.md](spec/MILESTONES.md) — סדר העבודה ו־Definition of Done לכל שלב.

אם יש סתירה בין הקוד למסמכים — המסמכים גוברים. אם יש סתירה בין המסמכים או דרישה לא ברורה — לשאול, לא לנחש.

## כלל עבודה מחייב — Milestones

העבודה מתבצעת לפי 4 ה־Milestones ב־`spec/MILESTONES.md`, **בסדר**:

1. מעטפת האפליקציה, המסכים והניווט
2. משחק מלא מול המחשב
3. שמע, אנימציות ופידבק חזותי
4. PWA, Offline וגרסת Production

**בסיום כל Milestone יש לעצור, לדווח מה בוצע מול ה־Definition of Done, ולהמתין לאישור מפורש מהמפתח לפני התחלת ה־Milestone הבא.** אין להתחיל Milestone חדש באופן אוטומטי ואין לממש מראש דברים השייכים ל־Milestone מאוחר יותר.

## Tech Stack

- React + TypeScript + Vite
- React Router (Routes: `/` → HomePage, `/game` → GamePage, `/about` → AboutPage)
- CSS רגיל עם CSS Custom Properties (ללא UI framework, ללא ספריית אנימציות)
- React State בלבד (ללא Redux/Zustand; Context קטן מותר רק למצב Mute אם נחוץ)
- Web Audio API לצלילים מסונתזים (ללא קובצי שמע)
- vite-plugin-pwa (Workbox) ל־Manifest ו־Service Worker
- Vitest ל־Unit Tests; Playwright אופציונלי ל־E2E
- Hosting: Cloudflare Static Assets, תיקיית build: `dist/`
- GitHub Pages: `.github/workflows/deploy-pages.yml` בונה עם `BASE_PATH=/TicTacToeJB/` ופורס בכל push ל־`main`. אין לכתוב נתיבים אבסולוטיים (`/...`) בקוד — להשתמש ב־`import.meta.env.BASE_URL` / `basename` של ה־Router, כדי שהאפליקציה תעבוד גם בשורש (Cloudflare) וגם בתת־נתיב (Pages)

## פקודות

```bash
npm install
npm run dev        # שרת פיתוח
npm run build      # build production ל-dist/
npm run preview    # הרצת ה-build מקומית (נדרש לבדיקת PWA/Offline)
npm test           # הרצת Unit Tests (Vitest, קבצים תחת tests/)
npm run deploy     # build + פריסה ל-Cloudflare (wrangler.jsonc, דורש wrangler login)
npm run generate-icons  # יצירת אייקוני PWA מ-public/icon.svg (pwa-assets.config.ts)
```

## מבנה תיקיות

```text
src/
├── app/          App.tsx, router.tsx
├── pages/        HomePage, GamePage, AboutPage
├── components/   Navigation, MuteButton, GameBoard, GameCell, ResultMessage, NewGameButton
├── game/         gameTypes.ts, gameRules.ts, computerPlayer.ts   ← לוגיקה טהורה, ללא React
├── audio/        audioEngine.ts
├── styles/       global.css, variables.css
└── main.tsx
public/icons/
tests/            gameRules.test.ts, computerPlayer.test.ts
```

## עקרונות ארכיטקטורה

- **הפרדת אחריות:** חוקי המשחק ולוגיקת המחשב ב־`src/game/` כפונקציות TypeScript טהורות — ללא UI, ללא שינוי State ישיר. רכיבי UI (במיוחד `GameCell`) לא מכילים לוגיקת משחק.
- **מודל State:** `board: CellValue[]` (9 תאים, אינדקסים 0–8), `result: 'playing' | 'player-won' | 'computer-won' | 'draw'`, `isComputerTurn`, `winningCells`. שמונת צירופי הניצחון מוגדרים במקום אחד ומשמשים גם לזיהוי מנצח וגם להדגשה.
- **המשתמש תמיד X ותמיד מתחיל; המחשב תמיד O.**
- **שחקן המחשב — Rule-based, חכם אך לא בלתי מנוצח:** (1) לנצח אם אפשר, (2) לחסום ניצחון של המשתמש, (3) מרכז, (4) פינה, (5) מהלך חוקי אחר, עם מעט אקראיות במצבים לא קריטיים. **לא Minimax מושלם.** רמת קושי אחת קבועה.
- **השהיה של ~500ms לפני מהלך המחשב**, והלוח חסום בזמן הזה.
- **Race conditions:** לשמור ref ל־Timer של המחשב ולבטל אותו ב־"משחק חדש", ב־Unmount של GamePage ובשינוי Route. אסור שמהלך מחשב ישן יתבצע אחרי Reset.
- **יציאה מ־GamePage מאפסת את המשחק**; חזרה אליו מתחילה משחק חדש.
- **Audio:** יצירת/הפעלת `AudioContext` רק אחרי User Gesture. כשל ב־Audio לעולם לא מונע משחק. Mute נשמר בזיכרון בלבד וחוזר ל"שמע פעיל" ב־Refresh.
- **אנימציות ב־CSS בלבד**, קצרות, ולא חוסמות לחיצות או לוגיקה.

## מה אסור להוסיף

אין Backend, Database, Authentication, APIs חיצוניים, שירותי AI, Analytics/Tracking, Cookies, **localStorage / sessionStorage / IndexedDB**, SSR, i18n. אין `dangerouslySetInnerHTML`. אין Secrets או משתני סביבה סודיים.

אין להוסיף גם פיצ'רים שמחוץ לטווח ה־PRD: שני שחקנים, בחירת X/O, בחירת מי מתחיל, רמות קושי, סטטיסטיקות/היסטוריה, כפתור Install ל־PWA, חיווי "התור שלך" / "המחשב חושב".

לשמור על dependency footprint מינימלי (runtime: `react`, `react-dom`, `react-router`). לא להוסיף ספרייה אם Browser API או React פותרים את הבעיה.

## UI, עיצוב ו־RTL

- `<html lang="he" dir="rtl">`; כל הטקסטים בעברית, מוגדרים ישירות בקוד או בקובץ constants.
- Mobile First, לוח ב־CSS Grid, תמיד ריבועי, מתאים לרוחב המסך עם רוחב מקסימלי ב־Desktop, תאים נוחים ללחיצה.
- תפריט ניווט (בית / משחק / אודות) זמין בכל המסכים.
- טקסט האודות המדויק: **"פותח על ידי תלמידי ג'ון ברייס התותחים"**.
- ערכת עיצוב — חלל כהה + ניאון. להגדיר כ־CSS variables ב־`variables.css`:
  - Background `#0B0F1A`, Surface `#111827`
  - Neon Blue (Primary, O, קווי הלוח) `#00D1FF`
  - Neon Red (X) `#FF2D55`
  - Purple (משלים) `#A855F7`
  - Text `#F8FAFC`, Text Secondary `#94A3B8`
- גופן Heebo; כותרת 48px Bold, כותרת משנה 32px Bold, טקסט 18px, עזר 14px.
- גריד מרווחים 8px (8/16/24/32), radius 8–12px, Glow על רכיבים מרכזיים.
- הפריסה צריכה להתאים ל־`spec/wireframes.png` והמראה ל־`spec/mockups.png` ול־`spec/style-guide.png`.

## בדיקות

- Unit Tests (Vitest) הם חובה ל־`gameRules.ts` ול־`computerPlayer.ts`: ניצחון X ו־O בכל 8 הצירופים, תיקו, משחק פעיל, מהלך חוקי/תא תפוס, המחשב בוחר מהלך מנצח, חוסם את המשתמש ולעולם לא בוחר תא תפוס.
- לפני דיווח על סיום Milestone: להריץ את הבדיקות ואת ה־build ולוודא שאין שגיאות.

## PWA (Milestone 4)

Manifest עם `name: "איקס עיגול"`, `lang: "he"`, `dir: "rtl"`, `display: "standalone"`, צבעי theme/background ואייקונים. Precache לכל קבצי ה־build, ללא runtime caching מורכב. SPA fallback ב־Hosting כדי ש־Routes ישירים לא יחזירו 404.
