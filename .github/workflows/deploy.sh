#!/usr/bin/env bash
set -euo pipefail

echo "Starting FTP deployment..."

LOCAL_DIR="dist"
REMOTE_DIR="."

if [ ! -d "$LOCAL_DIR" ]; then
  echo "Local build directory '$LOCAL_DIR' does not exist."
  exit 1
fi

echo "Syncing '$LOCAL_DIR/' to remote '$REMOTE_DIR/' (delete remote files not present locally)..."

lftp -u "$FTP_USER","$FTP_PASSWORD" "$FTP_SERVER" <<EOF
set ftp:passive-mode on
set ftp:list-options -a

mirror --reverse --delete  --verbose --exclude "^backend(/|\$)" "$LOCAL_DIR" "$REMOTE_DIR"

bye
EOF