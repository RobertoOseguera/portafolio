@echo off
REM 🎯 Arch ISO Customizer - Windows 11 → USB Bootable
REM Modifica ISO Arch con drivers + configs + apps
REM Roberto Oseguera - DevOps Tools

echo.
echo 🔥 ARCH LINUX ISO CUSTOMIZER v1.0
echo ===================================
echo Hecho por Roberto Oseguera
echo Compatible Windows 11 ^> ISO Arch Linux
echo.
echo ADVERTENCIA: Backup tu ISO original!
echo.

set /p iso_path="📁 Ruta ISO Arch (ej: C:\arch.iso): "
set /p output_path="💾 Salida nueva ISO (ej: C:\arch-custom.iso): "

if not exist "%iso_path%" (
  echo ❌ ISO no encontrada!
  pause
  exit /b
)

echo.
echo 🔄 Extrayendo ISO...
mkdir temp_iso
powershell -Command "Mount-DiskImage '%iso_path%'; $drive = (Get-DiskImage '%iso_path%' | Get-Volume).DriveLetter; Copy-Item \"$drive:\*\" temp_iso -Recurse -Force"
powershell -Command "Dismount-DiskImage '%iso_path%'"

echo.
echo 🛠️ Modificando...
cd temp_iso

REM Agregar drivers NVIDIA/AMD
mkdir /f drivers
REM Tu drivers aquí

REM Configs personalizadas
echo "roberto" > airootfs/etc/hostname
echo "password\npassword" | chpasswd -u root

REM Apps extra
mkdir /f extra-packages
echo "vim htop neofetch zsh git curl wget" > extra-packages/PKGLIST

REM Kernel params
echo "quiet splash nomodeset nvidia-drm.modeset=1" >> isolinux/isolinux.cfg

cd ..

echo.
echo 📦 Reconstruyendo ISO...
oscdimg -m -o -u2 -udfver102 -bootdata:2#p,efisys.bin,bEFISYS.NSH,e,boot|efisys.bin -l"ARCH_CUSTOM" temp_iso "%output_path%"

rmdir /s /q temp_iso

echo.
echo ✅ ISO lista: %output_path%
echo USB: Ventana^>Boot^>Seleccionar %output_path%
echo.
pause

