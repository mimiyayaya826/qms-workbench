@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"
echo ============================================
echo QMS Workbench - Pre-publish Regression Check
echo ============================================
set "NODE_BIN=node"
where node >nul 2>nul || set "NODE_BIN=C:\Users\1\.workbuddy\binaries\node\versions\22.22.2\node.exe"
if not exist "%NODE_BIN%" (
  echo [ERROR] node not found. Install Node.js or fix the managed node path below.
  echo         managed: C:\Users\1\.workbuddy\binaries\node\versions\22.22.2\node.exe
  pause
  exit /b 1
)
"%NODE_BIN%" qa/run-tests.js
if errorlevel 1 (
  echo.
  echo [FAIL] Regression tests did NOT pass. Publish aborted.
  echo        Fix the red cases shown above, then re-run this script.
  pause
  exit /b 1
)
echo.
echo [PASS] All regression cases passed (see qa/last-report.txt).
echo.
echo Next steps (this script does NOT auto-push):
echo   1) git add index.html qa
echo   2) git commit -m "fix: ..."
echo   3) git push   (or use GitHub Desktop / gh)
echo.
pause
