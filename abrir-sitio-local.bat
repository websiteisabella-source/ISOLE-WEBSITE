@echo off
cd /d "%~dp0"
start "Isole local server" /min "C:\Python313\python.exe" -m http.server 4173 --bind 127.0.0.1 --directory "%~dp0out"
timeout /t 2 >nul
start "" "http://127.0.0.1:4173/"
