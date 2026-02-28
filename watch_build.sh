#!/bin/bash

cd /opt/kaju/deno

# Wait for cargo build to finish
while pgrep -f "cargo build" > /dev/null; do
    sleep 5
done

# Check if build succeeded or failed
if tail -10 build.log | grep -q "Finished"; then
    /opt/kaju/kaju send --channel "C0AH1SJGHAP" --text "deno cargo build finished successfully"
elif tail -10 build.log | grep -q "error\|failed"; then
    /opt/kaju/kaju send --channel "C0AH1SJGHAP" --text "deno cargo build failed - check build.log"
else
    /opt/kaju/kaju send --channel "C0AH1SJGHAP" --text "deno cargo build process ended - check build.log"
fi