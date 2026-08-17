Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Pushing FarmVerse Project to GitHub" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

git init
git branch -M 3rd-milestone
git remote add origin https://github.com/Sivadharani06/FarmVerse.git 2>$null
git remote set-url origin https://github.com/Sivadharani06/FarmVerse.git
git add .
git commit -m "second commit"
git push -f -u origin 3rd-milestone

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Completed!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
