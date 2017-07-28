#!/bin/bash

rm -Rf dist
yarn
yarn run dist

cd server/xplosion

rm -Rf dist
dotnet restore
#dotnet build -o dist -f netcoreapp2.0 -c Release -r debian.8-x64
dotnet publish -o dist -c Debug -r debian.8-x64

rm -Rf dist/wwwroot
cp -r ../../public dist/wwwroot
cp -r ../../dist dist/wwwroot/
cp appsettings.json dist/
rm dist/state.json

if ![ -z "$1" ]; then
  docker build -t "guildtv/website:xplosion-dev-$1" .
  docker push "guildtv/website:xplosion-dev-$1"
fi
