# docker stop mongodb
# docker rm mongodb
docker run -e MONGO_INITDB_ROOT_USERNAME=mongo \
    -e MONGO_INITDB_ROOT_PASSWORD=123456 \
    --name mongodb \
    -p 27017:27017 \
    -v $PWD/data:/data \
    -d \
    mongo