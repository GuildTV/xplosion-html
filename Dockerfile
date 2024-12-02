FROM node:22 AS build

ADD . /src
WORKDIR /src

RUN corepack enable
RUN yarn
RUN yarn dist
RUN yarn workspaces focus --production 

FROM node:22
WORKDIR /app

COPY --from=build /src/package.json /app/package.json
COPY --from=build /src/node_modules /app/node_modules
COPY --from=build /src/dist /app/dist
COPY --from=build /src/src/server /app/src/server

EXPOSE 3000
CMD ["node", "src/server/main.js"]