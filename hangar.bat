@ECHO off
cls
IF not exist node_modules (npm install)
:start
ECHO.
ECHO 1 Run Dev task
ECHO 2 Run Build task
ECHO 3 Run Weinre task
set /p choice=Choose which task hangar should run.
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
