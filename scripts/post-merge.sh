#!/bin/bash
set -e
npm install --frozen-lockfile
npm --workspace @workspace/db run push
