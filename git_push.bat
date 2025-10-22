@echo off
echo 正在上传到GitHub...
git config --global credential.helper store
echo https://WRF90418:%40gzsWRF190418@github.com > %USERPROFILE%\.git-credentials
git push -u origin master
echo 上传完成！
pause
