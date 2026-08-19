@echo off
REM ============================================================
REM QMS Workbench ???????????
REM ??????? / ????????????SSOT ?????
REM ????? = ?? _auto_push.ps1 -ForceWithLease -PauseOnEnd
REM ============================================================
setlocal
set "PS1=%~dp0_auto_push.ps1"
if not exist "%PS1%" (
  echo [FATAL] _auto_push.ps1 not found in same directory as auto-push-force.bat
  timeout /t 3 >nul
  exit /b 99
)
echo.
echo Launching PowerShell (bypass ExecutionPolicy):
echo   powershell -NoProfile -ExecutionPolicy Bypass -File "%PS1%" -ForceWithLease -PauseOnEnd
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%PS1%" -ForceWithLease -PauseOnEnd
set EXITCODE=%ERRORLEVEL%
echo.
if %EXITCODE% EQU 0 (echo [DONE] Push success! Exit code = 0) else (echo [FAILED] Exit code = %EXITCODE%)
timeout /t 5 >nul
exit /b %EXITCODE%
