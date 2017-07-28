FROM debian:8
MAINTAINER julian@tech.guildtv.co.uk

RUN apt-get update && apt-get install -y \
    libssl1.0.0 libicu52 libunwind8 \
 && rm -rf /var/lib/apt/lists/*

ADD dist /dist
WORKDIR /dist

CMD "/dist/xplosion"