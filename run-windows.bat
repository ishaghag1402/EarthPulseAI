@echo off
cd /d "%~dp0"
echo Starting EarthPulse AI...
mvn clean spring-boot:run
pause
