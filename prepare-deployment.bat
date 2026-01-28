@echo off
echo ================================================
echo   TALITALI CMS - PREPARE DEPLOYMENT PACKAGE
echo ================================================
echo.

REM Buat folder deployment
if exist deploy-package rmdir /s /q deploy-package
mkdir deploy-package

echo [1/6] Creating deployment folder...
echo.

REM Copy semua file yang diperlukan
echo [2/6] Copying application files...
xcopy /E /I /Y .output deploy-package\.output >nul
xcopy /E /I /Y prisma deploy-package\prisma >nul
copy /Y package.json deploy-package\ >nul
copy /Y package-lock.json deploy-package\ >nul
copy /Y nuxt.config.ts deploy-package\ >nul
copy /Y tsconfig.json deploy-package\ >nul

echo [3/6] Creating environment template...
REM Buat .env template
(
echo # Database - Will be provided by Railway
echo DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
echo.
echo # Authentication
echo AUTH_SECRET="GENERATE_THIS_ON_RAILWAY"
echo AUTH_ORIGIN="https://talitali-production.up.railway.app"
echo.
echo # Base URL
echo BASE_URL="https://talitali-production.up.railway.app"
echo.
echo # Cache
echo CACHE_DIR="./.cache"
echo.
echo # Site
echo SITE_TITLE="Talitali.co.id"
echo SITE_DESCRIPTION="Jasa Pembuatan Tali Lanyard Custom"
) > deploy-package\.env.example

echo [4/6] Creating deployment scripts...

REM Buat package.json khusus deployment
(
echo {
echo   "name": "talitali-cms",
echo   "version": "1.0.0",
echo   "type": "module",
echo   "scripts": {
echo     "start": "node .output/server/index.mjs",
echo     "build": "echo 'Build already done locally'",
echo     "postinstall": "prisma generate"
echo   },
echo   "dependencies": {
echo     "@prisma/client": "^5.22.0",
echo     "prisma": "^5.22.0",
echo     "bcryptjs": "^2.4.3",
echo     "next-auth": "^4.24.11"
echo   }
echo }
) > deploy-package\package.json

echo [5/6] Creating README for deployment...

REM Buat README
(
echo # Talitali CMS - Production Deployment
echo.
echo This package contains the production build of Talitali CMS.
echo.
echo ## Deploy to Railway.app
echo.
echo 1. Create account at railway.app
echo 2. Create new project
echo 3. Add MySQL database
echo 4. Deploy from this folder
echo 5. Set environment variables
echo 6. Done!
echo.
echo See RAILWAY-DEPLOY.md for detailed instructions.
) > deploy-package\README.md

echo [6/6] Creating compressed archive...
echo.
echo Ready to compress! Please use WinRAR or 7zip to compress the 'deploy-package' folder.
echo Recommended filename: talitali-railway.zip
echo.
echo ================================================
echo   PACKAGE READY: deploy-package folder
echo ================================================
echo.
echo Next steps:
echo 1. Compress the deploy-package folder to ZIP
echo 2. Follow the RAILWAY-DEPLOY.md guide
echo.
pause
