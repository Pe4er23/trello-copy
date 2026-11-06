@echo off
chcp 65001 > nul
echo ======================================================
echo BACKEND
echo Команда запуску: npx json-server db.json watch --port 3001
echo або: start
echo ======================================================
echo.

:loop
set /p user_cmd="%cd%> "

if /i "%user_cmd%"=="start" (
    npx json-server db.json watch --port 3001
    goto loop
)

if /i "%user_cmd%"=="exit" (
    exit
)

%user_cmd%

echo.
goto loop