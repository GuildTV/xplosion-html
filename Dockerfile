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

RUN apt-get update && apt-get install -y \
    libssl1.0.0 libicu52 libunwind8 \
    && rm -rf /var/lib/apt/lists/*

CMD "/app/xplosion"