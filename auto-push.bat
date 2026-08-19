@echo off
REM ============================================================
REM QMS Workbench ?????????
REM ????? = ?? _auto_push.ps1???PowerShell?????
REM ============================================================
setlocal
set "PS1=%~dp0_auto_push.ps1"
if not exist "%PS1%" (
  echo [FATAL] _auto_push.ps1 not found in same directory as auto-push.bat
  timeout /t 3 >nul
  exit /b 99
)
echo.
echo Launching PowerShell: powershell -NoProfile -ExecutionPolicy Bypass -File "%PS1%" -PauseOnEnd
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%PS1%" -PauseOnEnd
set EXITCODE=%ERRORLEVEL%
echo.
if %EXITCODE% EQU 0 (echo [DONE] Exit code = 0) else (echo [FAILED] Exit code = %EXITCODE%)
timeout /t 5 >nul
exit /b %EXITCODE%
