FROM ubuntu:latest
LABEL authors="palak"

ENTRYPOINT ["top", "-b"]