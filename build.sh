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

if ! [ -z "$1" ]; then
  docker build -t "guildtv/website:xplosion-dev-$1" .
  docker push "guildtv/website:xplosion-dev-$1"

  if ! [ -z "$KUBE_API" ]; then
    cd ../..
    
    curl -O "https://storage.googleapis.com/kubernetes-release/release/$KUBE_VERSION/bin/linux/amd64/kubectl"
    chmod +x kubectl

    sed -i 's/-latest/-'$CI_BUILD_REF'/g' "kube-dev.yaml"
    ./kubectl --server="$KUBE_API" --token="$KUBE_TOKEN" --insecure-skip-tls-verify=true  --namespace="$KUBE_NAMESPACE" apply -f kube-dev.yaml
    
  fi
fi
