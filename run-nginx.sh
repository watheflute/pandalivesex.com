#!/bin/bash
docker run --name=nginx -v $(pwd):/usr/share/nginx/html --rm -p 80:80 nginx:latest