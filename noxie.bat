@ECHO off
cls
call npm install
:start
ECHO.
ECHO Please select which tasks Noxie should run
ECHO 1 - Run Dev task
ECHO 2 - Run Build task
set /p choice=Choose the task number and hit enter:
if '%choice%'=='1' goto dev
if '%choice%'=='2' goto build
if '%choice%'=='3' goto quit
ECHO.
goto start
:dev
grunt
goto end
:build
grunt deploy
goto end
:quit
exit /b
goto end
:end
pause
