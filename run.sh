#!/bin/bash

dir=$(dirname -- "$0")
cd $dir
nohup node ./server.js &
