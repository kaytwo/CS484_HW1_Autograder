#!/usr/bin/env bash

apt-get -y install bash

curl -fsSL https://deb.nodesource.com/setup_20.x -o nodesource_setup.sh
bash nodesource_setup.sh

# node, jq, playwright deps
apt-get install -y nodejs jq libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 \
 libcups2 libdrm2 libxkbcommon0 libatspi2.0-0 libxcomposite1 libxdamage1 \
 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2
# todo: might need build-essential etc if node needs native binaries built
