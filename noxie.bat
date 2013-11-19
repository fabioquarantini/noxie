@ECHO off
cls
call npm install
:start
ECHO.
ECHO Please select which tasks Noxie should run
ECHO 1 - Run Dev task
ECHO 2 - Run Build task
ECHO 3 - Run Weinre task
set /p choice=Choose the task number and hit enter:
if '%choice%'=='1' goto dev
if '%choice%'=='2' goto build
if '%choice%'=='3' goto weinre
ECHO.
goto start
:dev
grunt
goto end
:build
grunt build
goto end
:weinre
grunt weinre
goto end
:end
pause
