@ECHO off
cls
IF not exist node_modules (
	echo node_modules folder is not present, I'm going to download packages
	pause
	call npm install
	if errorlevel 1 goto errorNode
)
:start
ECHO.
ECHO Please select which tasks should Hangar run
ECHO 1 Run Dev task
ECHO 2 Run Build task
ECHO 3 Run Weinre task
set /p choice=Choose the task number and hit enter
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
:errorNode
echo There are some errors in the package.json, download it again
:end
pause
