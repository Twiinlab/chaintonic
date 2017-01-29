@echo off

FOR /f "tokens=*" %%i IN ('"docker-machine.exe" env eris') DO %%i