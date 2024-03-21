FROM golang:alpine AS build

RUN apk update && apk add build-base && go install github.com/golang-migrate/migrate/v4/cmd/migrate@v4.17.0

FROM alpine:latest
COPY --from=build /go/bin/migrate /bin/

CMD /bin/sh
