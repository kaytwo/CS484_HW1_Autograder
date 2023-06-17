#!/usr/bin/env bash

apt-get -y install bash

curl -fsSL https://deb.nodesource.com/setup_18.x | bash - 

apt install -y nodejs
# todo: might need build-essential etc if node needs native binaries built
