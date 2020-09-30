#!/bin/bash
VERSION="0.5.7"
ARCH="arm32v7"
APP="clima-storage"
docker buildx build -f ./Dockerfile-$APP-$ARCH -t $APP:$VERSION . --load
docker tag $APP:$VERSION herry1234/$APP:$VERSION
docker push herry1234/$APP:$VERSION
