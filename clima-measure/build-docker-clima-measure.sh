#!/bin/bash
VERSION="0.5.7"
ARCH="arm32v7"
APP="clima-measure"
docker buildx build --file ./Dockerfile-$APP-$ARCH -t $APP:$VERSION . --load
#docker buildx build -f ./Dockerfile-$APP-$ARCH -t $APP:$VERSION . --load
docker tag $APP:$VERSION herry1234/$APP:$VERSION
docker push herry1234/$APP:$VERSION
