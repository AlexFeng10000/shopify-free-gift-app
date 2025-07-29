@echo off
echo Copying React build to server...

if not exist "server\public" mkdir server\public
xcopy /E /I /Y client\build\* server\public\

echo ✅ Build files copied successfully!
echo Ready for deployment!