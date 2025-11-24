Quick setup (Windows PowerShell):

1) Install dependencies

```powershell
npm install
```

2) Create `src/firebaseConfig.ts` from the placeholder and paste your Firebase config.

3) Start dev server

```powershell
npm run dev
```

Notes:
- If TypeScript/linter complains about missing modules, ensure `npm install` completed.
- This scaffold intentionally leaves Firestore rules and auth roles to be configured in the Firebase Console.
- To test Firebase rules locally, install and run the Firebase Emulator Suite (optional).
