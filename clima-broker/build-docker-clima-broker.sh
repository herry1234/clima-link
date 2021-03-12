#!/bin/bash
VERSION="0.6.0"
ARCH="arm32v7"
APP="clima-broker"
docker buildx build -f ./Dockerfile-$APP-$ARCH -t $APP:$VERSION . --load
docker tag $APP:$VERSION herry1234/$APP:$VERSION
#docker push herry1234/$APP:$VERSION
