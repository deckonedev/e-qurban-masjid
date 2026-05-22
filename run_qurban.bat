@echo off
title e-Qurban App Launcher

echo =======================================
echo     SISTEM MANAJEMEN TIKET QURBAN      
echo =======================================
echo.

echo [1/2] Menjalankan Server Backend...
start "Backend e-Qurban" cmd /k "cd backend && node index.js"

echo [2/2] Menjalankan Frontend Web...
start "Frontend e-Qurban" cmd /k "cd frontend && npm run dev"

echo.
echo Aplikasi telah berhasil dijalankan pada jendela terpisah!
echo.
echo - Backend API berjalan di: http://localhost:5000
echo - Frontend Web berjalan di: http://localhost:5173
echo.
echo Tekan sembarang tombol untuk keluar dari launcher ini...
pause >nul
