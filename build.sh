#!/bin/bash

rm -Rf dist
npm run dist

cd server/xplosion

rm -Rf dist
dotnet restore
dotnet build -o dist -f netcoreapp2.0 -c Release -r debian.8-x64

rm -Rf dist/wwwroot
cp -r ../../public dist/wwwroot
cp -r ../../dist dist/wwwroot/
cp appsettings.json dist/