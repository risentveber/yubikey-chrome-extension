#!/bin/bash

dir=$(dirname -- "$0")
nohup node $dir/server.js &
