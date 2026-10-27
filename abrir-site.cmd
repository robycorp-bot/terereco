@echo off
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  "C:\Users\lucas\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" scripts\serve-local.mjs
) else (
  node scripts\serve-local.mjs
)
