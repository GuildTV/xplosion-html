FROM microsoft/dotnet:2-sdk
MAINTAINER julian@tech.guildtv.co.uk

ADD server /src
WORKDIR /src

RUN dotnet restore
RUN dotnet build -o dist -f netcoreapp2.0 -c Release -r debian.8-x64


FROM node:6
MAINTAINER julian@tech.guildtv.co.uk

ADD ./ /src
WORKDIR /src
RUN yarn
RUN npm run dist


FROM debian:8
MAINTAINER julian@tech.guildtv.co.uk

COPY --from=0 /src/dist /dist
ADD public /dist/wwwroot
COPY --from=1 /src/dist /dist/wwwroot/dist
