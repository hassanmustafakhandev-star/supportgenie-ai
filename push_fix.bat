@echo off
git add .
git commit -m "Fix: wrap useSearchParams in Suspense to pass Vercel build"
git push origin main -f
echo Push attempted.
