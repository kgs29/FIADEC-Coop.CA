#!/bin/bash
## build app
ls
cd /app
npm run build
## start app
pm2-runtime npm -- start
