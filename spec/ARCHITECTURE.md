# ARCHITECTURE — איקס עיגול

## 1. מטרת המסמך

מסמך זה מגדיר את הארכיטקטורה הטכנית של אפליקציית **"איקס עיגול"** בהתאם ל־PRD ול־Technology Stack שנבחר.

מטרת הארכיטקטורה היא לספק תכנון טכני ברור, פשוט, אמין וקל לתחזוקה, אשר מתאים לאפליקציית Web/PWA קטנה הפועלת כולה בצד הלקוח.

המערכת תיבנה כאפליקציית Frontend סטטית, ללא Backend, ללא מסד נתונים, ללא Authentication וללא APIs חיצוניים.

---

# 2. עקרונות ארכיטקטוניים

הארכיטקטורה תתבסס על העקרונות הבאים:

- **Frontend בלבד** — כל הלוגיקה רצה בדפדפן.
- **Static Web Application** — תוצר ה־Build הוא קבצים סטטיים.
- **PWA** — האפליקציה ניתנת להתקנה ותומכת בעבודה Offline.
- **ללא Backend** — אין שרת אפליקטיבי.
- **ללא Database** — אין צורך בשמירת נתונים.
- **ללא Authentication** — אין משתמשים רשומים.
- **ללא APIs חיצוניים** — האפליקציה עצמאית לחלוטין בזמן ריצה.
- **ללא Persistent State** — מצב המשחק והגדרות השמע נשמרים בזיכרון בלבד.
- **פשטות לפני מורכבות** — אין להוסיף שכבות או שירותים שאינם נדרשים ישירות על ידי ה־PRD.
- **הפרדת אחריות** — UI, לוגיקת המשחק, לוגיקת המחשב, Audio ו־PWA יהיו מופרדים לרכיבים ומודולים ברורים.
- **Deterministic Core Logic** — חוקי המשחק עצמם יהיו פונקציות טהורות ככל האפשר, כדי לאפשר בדיקה קלה ואמינה.

---

# 3. Technology Stack

## Frontend

- React
- TypeScript
- Vite
- React Router
- CSS רגיל

## PWA

- vite-plugin-pwa
- Workbox באמצעות vite-plugin-pwa

## Game Logic

- TypeScript מקומי
- ללא ספריות חיצוניות ללוגיקת המשחק

## Computer Player

- Rule-based algorithm
- מעט אקראיות במהלכים שאינם קריטיים

## Audio

- Web Audio API

## State

- React State בלבד
- ללא Redux
- ללא Zustand
- ללא Context גלובלי אלא אם מתברר שהוא נחוץ לניהול מצב משותף קטן

## Testing

- Vitest עבור Unit Tests
- Playwright אופציונלי עבור E2E

## Hosting

- Cloudflare static hosting באמצעות Workers Static Assets או פתרון Static Hosting מקביל של Cloudflare

## Source Control

- Git
- GitHub

---

# 4. מבנה המערכת

המערכת מורכבת משכבת Frontend אחת בלבד.

מבנה לוגי:

```text
Browser / Installed PWA
│
├── React Application
│   ├── Routing
│   ├── Pages
│   ├── Shared UI Components
│   ├── Game UI
│   ├── Game State
│   ├── Game Rules
│   ├── Computer Player Logic
│   ├── Audio Engine
│   └── PWA Integration
│
├── Service Worker
│   └── Offline Cache
│
└── Static Assets
```

אין שכבת Backend, אין API Server ואין Database.

---

# 5. מבנה Frontend

## 5.1 App Shell

רכיב האפליקציה הראשי יהיה אחראי על:

- אתחול האפליקציה.
- הגדרת Router.
- הצגת Layout משותף.
- הצגת תפריט הניווט.
- ניהול מצב Mute/Unmute ברמת Session.
- טעינת המסך המתאים לפי Route.

מבנה מומלץ:

```text
App
├── AppLayout
│   ├── Navigation
│   └── Page Content
│
├── HomePage
├── GamePage
└── AboutPage
```

---

# 6. Routing

יש שלושה Routes עיקריים:

```text
/        -> HomePage
/game    -> GamePage
/about   -> AboutPage
```

הניווט יתבצע באמצעות React Router.

דרישות:

- תפריט הניווט זמין בכל המסכים.
- מעבר מ־GamePage ל־Route אחר מאפס את המשחק.
- חזרה ל־GamePage מתחילה משחק חדש.
- אין צורך לשמור מצב משחק בין Routes.
- יש להגדיר fallback מתאים ל־SPA בעת Hosting כך ש־Routes ישירים לא יחזירו 404.

---

# 7. מסכי האפליקציה

## 7.1 HomePage

אחריות:

- הצגת שם המשחק.
- הצגת תיאור קצר.
- הצגת ניווט לכל הדפים.

המסך אינו שומר מצב עסקי.

---

## 7.2 GamePage

זהו המסך המרכזי במערכת.

אחריות:

- יצירת משחק חדש.
- החזקת מצב המשחק הנוכחי.
- הצגת לוח 3×3.
- קליטת מהלך המשתמש.
- חסימת הלוח בזמן תור המחשב.
- הפעלת השהיה של כחצי שנייה לפני מהלך המחשב.
- הפעלת לוגיקת המחשב.
- בדיקת ניצחון, הפסד או תיקו.
- הצגת תוצאה.
- הדגשת רצף מנצח.
- הפעלת אפקטים קוליים.
- התחלת משחק חדש.

---

## 7.3 AboutPage

אחריות:

- הצגת טקסט האודות:

> פותח על ידי תלמידי ג'ון ברייס התותחים

- הצגת ניווט כללי.

---

# 8. מודל מצב המשחק

מצב המשחק יישמר בזיכרון באמצעות React State בלבד.

מבנה מומלץ:

```ts
type Player = 'X' | 'O';

type CellValue = Player | null;

type GameResult =
  | 'playing'
  | 'player-won'
  | 'computer-won'
  | 'draw';

interface GameState {
  board: CellValue[];
  result: GameResult;
  isComputerTurn: boolean;
  winningCells: number[];
}
```

הלוח יכיל 9 תאים לפי אינדקסים 0–8.

לדוגמה:

```text
0 | 1 | 2
---------
3 | 4 | 5
---------
6 | 7 | 8
```

המשתמש תמיד משחק כ־X.

המחשב תמיד משחק כ־O.

המשתמש תמיד מתחיל.

---

# 9. לוגיקת המשחק

לוגיקת חוקי המשחק תופרד מ־React ותמומש כפונקציות TypeScript טהורות.

מודול מומלץ:

```text
game/
├── gameTypes.ts
├── gameRules.ts
└── computerPlayer.ts
```

## 9.1 gameRules.ts

יכלול פונקציות כגון:

```ts
getWinner(board)
getWinningCells(board)
isBoardFull(board)
getGameResult(board)
getAvailableMoves(board)
isValidMove(board, cellIndex)
```

הפונקציות לא יכילו UI ולא ישנו State ישירות.

---

# 10. רצפי ניצחון

יש להגדיר את שמונת צירופי הניצחון הקלאסיים:

```ts
[
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]
```

אותו מקור נתונים ישמש גם לזיהוי המנצח וגם למציאת התאים שיש להדגיש.

---

# 11. לוגיקת שחקן המחשב

אין להשתמש ב־AI חיצוני ואין צורך ב־Minimax מושלם.

המטרה היא מחשב חכם אך ניתן לניצחון.

האלגוריתם יהיה Rule-Based.

סדר החלטות מומלץ:

1. אם קיימת אפשרות לנצח במהלך הנוכחי — בצע אותה.
2. אם המשתמש יכול לנצח במהלך הבא — חסום אותו.
3. העדף את התא המרכזי אם הוא פנוי.
4. העדף פינה פנויה.
5. בחר מהלך חוקי אחר.
6. במצבים שאינם קריטיים ניתן להשתמש באקראיות כדי למנוע התנהגות זהה בכל משחק.

יש לשמור על כך שהמחשב:

- לא יבצע מהלך לא חוקי.
- לא יבחר תא תפוס.
- לא יבצע מהלך לאחר שהמשחק הסתיים.
- לא יהיה בלתי מנוצח באופן מכוון.

---

# 12. זרימת מהלך

## מהלך המשתמש

1. המשתמש לוחץ על תא.
2. המערכת בודקת:
   - שהמשחק פעיל.
   - שלא מתבצע תור מחשב.
   - שהתא פנוי.
3. מוצב X.
4. מושמע אפקט X.
5. מתבצעת בדיקת תוצאה.
6. אם המשחק הסתיים:
   - ה־State מתעדכן.
   - הלוח ננעל.
   - מוצגת הודעה.
   - מופעל אפקט סיום.
7. אם המשחק ממשיך:
   - `isComputerTurn = true`
   - הלוח נחסם.

## מהלך המחשב

1. מופעל Timer של כ־500ms.
2. לאחר ההשהיה:
   - האלגוריתם בוחר תא.
   - מוצב O.
   - מושמע אפקט O.
3. מתבצעת בדיקת תוצאה.
4. אם המשחק הסתיים:
   - ה־State מתעדכן.
   - מופעל אפקט מתאים.
5. אחרת:
   - `isComputerTurn = false`
   - הלוח חוזר להיות פעיל.

---

# 13. מניעת Race Conditions

מכיוון שקיימת השהיה לפני מהלך המחשב, יש לטפל בזהירות ב־Timer.

יש לוודא:

- שלא ניתן ללחוץ פעמיים לפני תור המחשב.
- שלא יבוצע מהלך מחשב לאחר שהמשתמש לחץ "משחק חדש".
- שלא יבוצע מהלך מחשב לאחר יציאה מ־GamePage.

יש לשמור reference ל־timer ולבטל אותו בעת:

- Reset Game.
- Unmount של GamePage.
- שינוי Route.

---

# 14. רכיבי UI מרכזיים

מבנה מומלץ:

```text
components/
├── Navigation
├── MuteButton
├── GameBoard
├── GameCell
├── ResultMessage
└── NewGameButton
```

## GameBoard

אחריות:

- הצגת 9 תאים.
- העברת אירועי click ל־GamePage.
- הצגת מצב disabled.
- העברת מידע על winning cells.

## GameCell

אחריות:

- הצגת X / O.
- אנימציית הופעה.
- מצב selected / empty.
- מצב winning.
- מצב disabled.

אין להכניס לתוך GameCell את לוגיקת המשחק.

---

# 15. Styling ו־Responsive Design

ה־UI ייכתב באמצעות CSS רגיל.

עקרונות:

- Mobile First.
- RTL מלא.
- שימוש ב־CSS Grid עבור לוח המשחק.
- הלוח תמיד יהיה ריבועי.
- גודל הלוח יתאים לרוחב המסך.
- ב־Desktop יש להגדיר רוחב מקסימלי כדי למנוע לוח גדול מדי.
- כל תא יהיה נוח ללחיצה במובייל.
- אנימציות קצרות ולא מכבידות.
- אין תלות ב־UI framework.

ניתן להשתמש ב־CSS Custom Properties עבור:

- צבעים.
- spacing.
- border radius.
- font sizes.
- animation durations.

---

# 16. אנימציות

האנימציות יבוצעו באמצעות CSS ככל האפשר.

נדרשות לפחות:

- אנימציית הופעת X.
- אנימציית הופעת O.
- הדגשת שלושת התאים המנצחים.

אין צורך בספריית Animation חיצונית.

יש להעדיף אנימציות CSS כדי לשמור על:

- Bundle קטן.
- ביצועים טובים.
- קוד פשוט.
- פחות dependencies.

---

# 17. Audio Architecture

האפקטים הקוליים ימומשו באמצעות Web Audio API.

אין צורך בקובצי MP3/WAV.

מודול מומלץ:

```text
audio/
└── audioEngine.ts
```

המודול יהיה אחראי על:

```ts
playXSound()
playOSound()
playWinSound()
playLoseSound()
playDrawSound()
setMuted()
```

ניתן להשתמש ב:

- `AudioContext`
- `OscillatorNode`
- `GainNode`

ליצירת צלילים מסונתזים.

יש לקחת בחשבון שדפדפנים עשויים לחסום AudioContext עד לאינטראקציה ראשונה של המשתמש.

לכן יצירת או הפעלת AudioContext צריכה להתבצע בעקבות User Gesture ראשון.

---

# 18. ניהול Mute

מצב Mute יישמר בזיכרון האפליקציה בלבד.

אין להשתמש ב:

- localStorage
- IndexedDB
- cookies

בעת Refresh או פתיחה מחדש, מצב ברירת המחדל יהיה שמע פעיל.

מאחר שכפתור Mute קיים במספר מסכים, ניתן לנהל את מצב השמע:

- ברמת `App`
- או באמצעות Context קטן

אין צורך ב־State Management Library.

---

# 19. PWA Architecture

האפליקציה תוגדר כ־Progressive Web App.

נדרש:

- Web App Manifest.
- Service Worker.
- App Icons.
- Cache עבור קובצי האפליקציה.
- Offline loading.
- Installability ב־Chrome.

היישום יתבצע באמצעות `vite-plugin-pwa`.

---

# 20. Web App Manifest

ה־Manifest יכלול לפחות:

```text
name
short_name
start_url
display
background_color
theme_color
icons
lang
dir
```

ערכים עקרוניים:

```text
name: "איקס עיגול"
lang: "he"
dir: "rtl"
display: "standalone"
```

אין צורך בכפתור Install ייעודי בממשק.

---

# 21. Service Worker ו־Offline

ה־Service Worker ישמש אך ורק לצורך:

- caching של קובצי ה־Frontend.
- caching של CSS/JS/icons.
- טעינת האפליקציה כאשר אין חיבור לאינטרנט.

מכיוון שאין API ואין נתונים דינמיים, אסטרטגיית ה־Offline פשוטה.

יש לבצע precache עבור קבצי ה־build.

לא נדרש runtime caching מורכב.

---

# 22. עדכוני PWA

מכיוון שאין מידע משתמש לשמור, ניתן להשתמש במדיניות עדכון פשוטה.

המלצה:

- גרסה חדשה של האפליקציה תחליף את ה־Service Worker הקיים.
- אין צורך במנגנון migration.
- אין צורך בסנכרון נתונים.
- אין צורך ב־background sync.

---

# 23. Backend

אין Backend.

לא יפותחו:

- Node.js server.
- Express API.
- REST API.
- GraphQL API.
- Serverless Functions.
- Cloud Functions.

כל התנהגות המוצר קיימת ב־Frontend.

---

# 24. APIs

אין API פנימי ואין API חיצוני.

האפליקציה אינה שולחת בקשות לצורך:

- משחק.
- משתמשים.
- ניקוד.
- הגדרות.
- Audio.
- AI.

בזמן משחק ניתן לפעול לחלוטין Offline.

---

# 25. Database

אין Database.

אין צורך ב:

- PostgreSQL.
- MySQL.
- MongoDB.
- Firestore.
- Supabase.
- SQLite.
- IndexedDB.

המערכת אינה שומרת מידע בין Sessions.

---

# 26. Authentication ו־Authorization

אין Authentication.

אין:

- Register.
- Login.
- JWT.
- OAuth.
- Roles.
- Permissions.
- Sessions.

כל המשתמשים אנונימיים.

אין צורך ב־Authorization מכיוון שאין פעולות מוגנות או מידע פרטי.

---

# 27. File Storage

אין שירות File Storage.

אין צורך ב:

- S3.
- Cloudflare R2.
- Firebase Storage.
- Supabase Storage.

כל assets של האפליקציה ייארזו כחלק מה־Frontend.

לדוגמה:

```text
public/
├── icons/
└── manifest assets
```

---

# 28. שירותי AI

אין שירותי AI בזמן ריצה.

אין להשתמש ב:

- OpenAI API.
- Gemini API.
- Claude API.
- Local LLM.

שחקן המחשב מיושם באמצעות אלגוריתם מקומי.

החלטה זו שומרת על:

- עבודה Offline.
- אפס עלויות API.
- latency אפסי כמעט.
- פשטות.
- אמינות.
- היעדר תלות בספק חיצוני.

---

# 29. אבטחה

האפליקציה פשוטה מאוד ואינה מחזיקה מידע רגיש.

עם זאת יש לשמור על מספר עקרונות:

## אין Secrets ב־Frontend

אסור להכניס:

- API Keys.
- Tokens.
- סיסמאות.
- Secrets.

אין כרגע צורך ב־Secrets כלשהם.

## HTTPS

האתר יוגש באמצעות HTTPS.

HTTPS נדרש גם לתפקוד תקין של Service Workers ו־PWA מחוץ ל־localhost.

## Dependencies

יש להשתמש רק ב־dependencies נדרשים.

יש להימנע מספריות מיותרות.

יש לבצע תחזוקת dependencies ועדכוני אבטחה באופן שוטף.

## XSS

מאחר שאין קלט טקסט חופשי מהמשתמש ואין תוכן חיצוני, שטח התקיפה קטן מאוד.

אין להשתמש ב־`dangerouslySetInnerHTML`.

---

# 30. פרטיות

המערכת אינה אוספת מידע אישי.

אין:

- חשבון משתמש.
- Tracking.
- Analytics.
- Database.
- Cookies לצורך זיהוי.
- localStorage.
- API חיצוני.

בהתאם ל־PRD, אין צורך במנגנון Privacy מורכב בתוך ה־MVP.

---

# 31. Cloud Infrastructure

המוצר יוגש כאתר סטטי.

מבנה התשתית:

```text
GitHub Repository
      │
      ▼
Build
Vite
      │
      ▼
Static Assets
HTML / CSS / JS / Icons / Manifest / Service Worker
      │
      ▼
Cloudflare
      │
      ▼
HTTPS + CDN
      │
      ▼
Browser / Installed PWA
```

אין:

- VM.
- Container.
- Kubernetes.
- Docker requirement.
- Database server.
- Application server.

---

# 32. Hosting

Hosting מומלץ:

**Cloudflare static hosting / Workers Static Assets**

דרישות:

- HTTPS.
- CDN.
- תמיכה ב־SPA fallback.
- Deploy מתוך Build של Vite.
- אפשרות חיבור ל־GitHub.
- תמיכה ב־Custom Domain אם יידרש בעתיד.

תיקיית ה־Build צפויה להיות:

```text
dist/
```

---

# 33. Build

פקודת Build טיפוסית:

```bash
npm run build
```

Vite ייצור את קבצי ה־Production תחת:

```text
dist/
```

יש לפרסם את התוכן הסטטי בלבד.

לא נדרש runtime של Node.js ב־Production.

---

# 34. Environment Variables

ל־MVP אין צורך ב־Environment Variables.

אין:

- API URLs.
- API Keys.
- Database URL.
- Secrets.

אם יתווספו בעתיד הגדרות build-time שאינן סודיות, ניתן להשתמש במשתני Vite מסוג:

```text
VITE_*
```

אין להוסיף Secrets למשתני Frontend.

---

# 35. Testing Architecture

## Unit Tests

Vitest ישמש לבדיקת לוגיקה.

בדיקות מרכזיות:

- זיהוי ניצחון X.
- זיהוי ניצחון O.
- זיהוי תיקו.
- זיהוי משחק פעיל.
- זיהוי מהלך חוקי.
- זיהוי תא תפוס.
- בחירת מהלך ניצחון למחשב.
- חסימת ניצחון משתמש.
- המחשב אינו בוחר תא תפוס.

יש לתת עדיפות גבוהה לבדיקת `gameRules.ts` ו־`computerPlayer.ts`.

---

# 36. E2E Tests

Playwright הוא אופציונלי אך מומלץ אם נדרשת בדיקת UI מלאה.

תרחישים אפשריים:

- כניסה לעמוד הבית.
- מעבר למשחק.
- ביצוע מהלך.
- חסימת לחיצות בזמן תור המחשב.
- התחלת משחק חדש.
- מעבר ל־About.
- Reset לאחר עזיבת GamePage.
- Mute/Unmute.

---

# 37. מבנה תיקיות מומלץ

```text
src/
├── app/
│   ├── App.tsx
│   └── router.tsx
│
├── pages/
│   ├── HomePage.tsx
│   ├── GamePage.tsx
│   └── AboutPage.tsx
│
├── components/
│   ├── Navigation.tsx
│   ├── MuteButton.tsx
│   ├── GameBoard.tsx
│   ├── GameCell.tsx
│   ├── ResultMessage.tsx
│   └── NewGameButton.tsx
│
├── game/
│   ├── gameTypes.ts
│   ├── gameRules.ts
│   └── computerPlayer.ts
│
├── audio/
│   └── audioEngine.ts
│
├── styles/
│   ├── global.css
│   └── variables.css
│
├── assets/
│
├── main.tsx
└── vite-env.d.ts

public/
├── icons/
└── ...

tests/
├── gameRules.test.ts
└── computerPlayer.test.ts
```

מבנה זה הוא המלצה ולא דרישה קשיחה, אך יש לשמור על אותה הפרדת אחריות.

---

# 38. Dependencies

יש לשמור על dependency footprint קטן.

Dependencies עיקריים צפויים:

```text
react
react-dom
react-router
```

Dev dependencies עיקריים:

```text
typescript
vite
vite-plugin-pwa
vitest
```

Playwright יתווסף רק אם נבחר לבצע E2E.

אין להוסיף ספרייה חיצונית אם ניתן לפתור את הדרישה באופן פשוט באמצעות Browser API או React.

---

# 39. Error Handling

מכיוון שאין Backend ואין APIs, רוב השגיאות האפשריות הן מקומיות.

יש לטפל ב:

- ניסיון לבחור תא תפוס.
- ניסיון לבצע מהלך כאשר המשחק הסתיים.
- ניסיון לבצע מהלך בזמן תור המחשב.
- Timer פעיל בעת Reset.
- Timer פעיל בעת מעבר Route.
- כשל אפשרי באתחול Web Audio API.
- חוסר תמיכה נקודתי ב־PWA API.

כשל ב־Audio אינו צריך למנוע מהמשחק לפעול.

כשל ביכולת Install אינו צריך למנוע שימוש רגיל באתר.

---

# 40. Performance

האפליקציה קטנה ולכן אין צורך באופטימיזציות מורכבות.

יש לשמור על:

- Bundle קטן.
- מעט dependencies.
- ללא assets כבדים.
- ללא network calls בזמן משחק.
- CSS animations קלות.
- React rendering פשוט.

אין צורך ב:

- SSR.
- code splitting מורכב.
- lazy loading מיוחד.
- caching של API.
- CDN assets חיצוניים.

---

# 41. Browser Support

ה־MVP יתמוך ב־Google Chrome בלבד.

היעדים:

- Chrome Desktop.
- Chrome Android.

אין צורך לבצע התאמות ייעודיות ל:

- Safari.
- Firefox.
- Edge.

עם זאת, אין לכתוב קוד שמונע תאימות לדפדפנים אחרים ללא צורך.

---

# 42. RTL ו־Localization

האפליקציה היא בעברית בלבד.

ברמת HTML:

```html
<html lang="he" dir="rtl">
```

אין צורך במערכת i18n.

אין להשתמש בספריית תרגום.

כל הטקסטים יכולים להיות מוגדרים ישירות בקוד או בקובץ constants מרכזי.

---

# 43. State Lifecycle

כל state הוא זמני.

Reset מתרחש בעת:

- לחיצה על "משחק חדש".
- יציאה מ־GamePage.
- Refresh.
- סגירת האפליקציה.
- פתיחה מחדש של PWA.

אין hydration ואין persistence.

---

# 44. החלטות טכניות מרכזיות

## React במקום Vanilla JavaScript

נבחר React כדי לקבל מבנה ברור של Pages ו־Components, ניהול State צפוי ויכולת הרחבה עתידית, תוך שימוש בטכנולוגיה Mainstream ובשלה.

## TypeScript במקום JavaScript

נבחר TypeScript כדי לצמצם שגיאות סביב מצב המשחק, ערכי התאים ותוצאות המשחק.

## Vite במקום Webpack ידני

נבחר Vite כדי לשמור על configuration פשוט, build מהיר וסטנדרטי.

## CSS רגיל במקום UI Framework

הממשק קטן מאוד ואינו מצדיק dependency גדול כמו Material UI או Bootstrap.

## React State במקום State Management Library

כמות ה־State קטנה ומקומית. Redux או Zustand יהיו Overengineering.

## Rule-Based Computer Player במקום Minimax

ה־PRD דורש יריב חכם אך לא בלתי מנוצח. Rule-Based Logic מאפשר לשלוט ברמת הקושי בצורה ישירה ופשוטה.

## Web Audio API במקום Audio Files

ה־PRD דורש אפקטים מסונתזים. Web Audio API מאפשר לייצר אותם ללא assets חיצוניים.

## PWA Cache בלבד במקום Storage

Offline נדרש, אבל אין צורך לשמור מצב משתמש. לכן Service Worker cache מספיק.

## Static Hosting במקום Backend Hosting

אין קוד שרת ולכן Hosting סטטי הוא הפתרון הפשוט, הזול והאמין ביותר.

---

# 45. רכיבים שאינם קיימים בארכיטקטורה

למען הבהירות, אין במערכת:

```text
Backend
Database
Authentication
Authorization
REST API
GraphQL
WebSocket
Cloud Functions
AI API
File Storage
Analytics
Tracking
Cookies
localStorage
IndexedDB
Server-side rendering
Microservices
Message Queue
Containers
Kubernetes
```

אין להוסיף אחד מרכיבים אלו במהלך המימוש אלא אם דרישות המוצר ישתנו.

---

# 46. סיכום הארכיטקטורה

האפליקציה תיבנה כ־Single Page Application מבוססת React + TypeScript, עם Vite כ־Build Tool ו־React Router לניהול שלושת המסכים.

לוגיקת איקס־עיגול ולוגיקת שחקן המחשב יפעלו כולן מקומית בדפדפן ויופרדו משכבת ה־UI.

ה־State יישמר בזיכרון בלבד ולא יישמר בין Sessions.

אפקטי הקול ייווצרו באמצעות Web Audio API.

ה־PWA תמומש באמצעות vite-plugin-pwa ו־Service Worker לצורך Cache ועבודה Offline.

האפליקציה תיפרס כקבצים סטטיים ב־Cloudflare ותוגש ב־HTTPS דרך CDN.

הארכיטקטורה אינה כוללת Backend, Database, Authentication, APIs חיצוניים או שירותי AI, מכיוון שאף אחד מהם אינו נדרש על ידי ה־PRD.

התוצאה היא מערכת פשוטה, קטנה, אמינה, קלה לבדיקה וקלה לתחזוקה, אשר כוללת רק את הרכיבים הדרושים למימוש המוצר.
