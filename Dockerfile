FROM node:8 AS build-node

ADD . /src
WORKDIR /src

RUN yarn
RUN yarn dist

FROM mcr.microsoft.com/dotnet/sdk:2.1 AS build-server

ADD server /src
WORKDIR /src

RUN dotnet restore
RUN dotnet publish -o dist -c Debug -r linux-x64

FROM debian:8
WORKDIR /app

COPY --from=build-server /src/xplosion/dist /app
COPY --from=build-server /src/xplosion/appsettings.json /app/

RUN rm /app/state.json || true
RUN rm -R /app/wwwroot

COPY --from=build-node /src/public /app/wwwroot
COPY --from=build-node /src/dist /app/wwwroot/dist

RUN echo "Acquire::Check-Valid-Until false;" > /etc/apt/apt.conf

RUN sed -i s/deb.debian.org/archive.debian.org/g /etc/apt/sources.list
RUN sed -i s/security.debian.org/archive.debian.org/g /etc/apt/sources.list
RUN sed -i s/jessie-updates/jessie/g /etc/apt/sources.list

RUN apt-get --allow-unauthenticated update && apt-get --allow-unauthenticated install -y \
    libssl-dev libicu-dev libunwind-dev \
    && rm -rf /var/lib/apt/lists/*

CMD "/app/xplosion"