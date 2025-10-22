@echo off
pushd %~dp0
cd dist
npx http-server -p 8080 -a 0.0.0.0