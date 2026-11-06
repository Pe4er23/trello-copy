@echo off
chcp 65001 > nul
echo ======================================================
echo Команда запуску: npm run dev
echo або: start
echo ======================================================
echo.

:loop
set /p user_cmd="%cd%> "

if /i "%user_cmd%"=="start" (
	npm install
    npm run dev
    goto loop
)

if /i "%user_cmd%"=="exit" (
    exit
)

%user_cmd%

echo.
goto loop