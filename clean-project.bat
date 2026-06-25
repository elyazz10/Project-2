@echo off
title Clean Project - Predator Gym
color 06
echo ====================================================================
echo   PEMBERSIH CACHE & DEPENDENSI PROJECT (SIAP ZIP) - PREDATOR GYM
echo ====================================================================
echo.
echo Script ini akan menghapus folder-folder berat (node_modules, .next, vendor)
echo agar ukuran projek menjadi sangat kecil (hanya beberapa MB) sehingga
echo proses kompresi ke ZIP bisa selesai dalam 1 DETIK tanpa merubah kode Anda.
echo.
echo PERINGATAN: Setelah melakukan ekstrak ZIP di tempat lain, Anda harus:
echo   1. Jalankan "npm install" di folder 'frontend' sebelum "npm run dev".
echo   2. Jalankan "composer install" di folder 'backend' jika folder vendor dihapus.
echo.
set /p confirm="Apakah Anda ingin melanjutkan pembersihan? (Y/N): "
if /i "%confirm%" neq "Y" goto cancel

echo.
echo --------------------------------------------------------------------
echo [1/3] Membersihkan cache Next.js (frontend/.next)...
if exist "frontend\.next" (
    rmdir /s /q "frontend\.next"
    echo   - frontend/.next berhasil dihapus.
) else (
    echo   - frontend/.next sudah bersih.
)

echo.
echo [2/3] Membersihkan dependensi frontend (frontend/node_modules)...
if exist "frontend\node_modules" (
    rmdir /s /q "frontend\node_modules"
    echo   - frontend/node_modules berhasil dihapus (puluhan ribu file dibersihkan).
) else (
    echo   - frontend/node_modules sudah bersih.
)

echo.
echo [3/3] Membersihkan dependensi backend (backend/vendor)...
if exist "backend\vendor" (
    rmdir /s /q "backend\vendor"
    echo   - backend/vendor berhasil dihapus.
) else (
    echo   - backend/vendor sudah bersih.
)

echo.
echo ====================================================================
echo   SUKSES! Projek sekarang sangat ringan dan siap dikompres ke ZIP.
echo ====================================================================
echo.
goto end

:cancel
echo.
echo Pembersihan dibatalkan. Tidak ada file yang dihapus.
echo.

:end
pause
