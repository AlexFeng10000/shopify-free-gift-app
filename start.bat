@echo off
echo Starting Shopify Free Gift App...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

REM Check if npm is available
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not available
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo SUCCESS: Node.js and npm are available

REM Check dependencies
if not exist "node_modules" (
    echo Installing root dependencies...
    npm install
    if errorlevel 1 (
        echo ERROR: Failed to install root dependencies
        pause
        exit /b 1
    )
)

if not exist "server\node_modules" (
    echo Installing server dependencies...
    cd server
    npm install
    if errorlevel 1 (
        echo ERROR: Failed to install server dependencies
        pause
        exit /b 1
    )
    cd ..
)

if not exist "client\node_modules" (
    echo Installing client dependencies...
    cd client
    npm install
    if errorlevel 1 (
        echo ERROR: Failed to install client dependencies
        pause
        exit /b 1
    )
    cd ..
)

REM Create .env files if they don't exist
if not exist "server\.env" (
    echo Creating server .env file...
    copy "server\.env.example" "server\.env" >nul
)

if not exist "client\.env" (
    echo Creating client .env file...
    echo REACT_APP_SHOPIFY_API_KEY=your_api_key_here > "client\.env"
    echo GENERATE_SOURCEMAP=false >> "client\.env"
)

echo.
echo Starting development servers...
echo.
echo Frontend will be available at: http://localhost:3000
echo Backend will be available at: http://localhost:5000
echo.
echo Press Ctrl+C to stop the servers
echo.

REM Start both servers using concurrently
npm run dev
if errorlevel 1 (
    echo.
    echo ERROR: Failed to start development servers
    echo Trying alternative method...
    echo.
    start "Backend Server" cmd /k "cd server && npm run dev"
    start "Frontend Server" cmd /k "cd client && npm start"
)