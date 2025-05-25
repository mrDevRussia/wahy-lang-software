@echo off
echo Wahy Desktop Installer
echo ======================
echo.
echo Installing Wahy Desktop...
echo.

rem Create installation directory
if not exist "%USERPROFILE%\WahyDesktop" (
    mkdir "%USERPROFILE%\WahyDesktop"
)

rem Copy files
copy /Y "*.js" "%USERPROFILE%\WahyDesktop\"
copy /Y "*.html" "%USERPROFILE%\WahyDesktop\"
copy /Y "*.css" "%USERPROFILE%\WahyDesktop\"
copy /Y "package.json" "%USERPROFILE%\WahyDesktop\"
xcopy /Y /E /I "assets" "%USERPROFILE%\WahyDesktop\assets\"
xcopy /Y /E /I "node_modules" "%USERPROFILE%\WahyDesktop\node_modules\"

rem Create desktop shortcut
echo Creating desktop shortcut...
echo Set WshShell = WScript.CreateObject("WScript.Shell") > create_shortcut.vbs
echo Set shortcut = WshShell.CreateShortcut("%USERPROFILE%\Desktop\Wahy Desktop.lnk") >> create_shortcut.vbs
echo shortcut.TargetPath = "node.exe" >> create_shortcut.vbs
echo shortcut.Arguments = "main.js" >> create_shortcut.vbs
echo shortcut.WorkingDirectory = "%USERPROFILE%\WahyDesktop" >> create_shortcut.vbs
echo shortcut.IconLocation = "%USERPROFILE%\WahyDesktop\assets\icon.ico" >> create_shortcut.vbs
echo shortcut.Save >> create_shortcut.vbs

cscript create_shortcut.vbs
del create_shortcut.vbs

echo.
echo Installation completed successfully!
echo You can now find "Wahy Desktop" on your desktop.
echo.
pause
