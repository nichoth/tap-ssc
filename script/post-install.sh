if ! command -v ssc &> /dev/null
then
    curl -s -o- https://sockets.sh/sh | bash -s
    exit
fi
