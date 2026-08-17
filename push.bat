@echo off
echo ==========================================
echo    Pushing FarmVerse Project to GitHub
echo ==========================================
echo.
rmdir /s /q .git
git init
git branch -M 3rd-milestone
git remote add origin https://github.com/Sivadharani06/FarmVerse.git 2>nul
git remote set-url origin https://github.com/Sivadharani06/FarmVerse.git
git add .
git commit -m "second commit"
git push -f -u origin 3rd-milestone
echo.
echo ==========================================
echo Done! Press any key to exit.
echo ==========================================
pause
