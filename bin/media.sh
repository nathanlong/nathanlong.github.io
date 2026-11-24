#!/bin/zsh
# Media (images, video) lives in media/, outside git. Google Drive holds a
# one-way backup. Set MEDIA_BACKUP in .env to the backup folder, e.g.
#   MEDIA_BACKUP="$HOME/Library/CloudStorage/GoogleDrive-<account>/My Drive/site-media"
#
#   ./bin/media.sh backup   copy media/ to the backup (never deletes from it)
#   ./bin/media.sh restore  copy the backup into media/ (never deletes locally)
#   ./bin/media.sh check    fail if media/ is missing or empty
set -eu
cd "${0:A:h}/.."
source ./bin/utils.sh
[[ -f .env ]] && source ./.env

media_dir='media'

check_media() {
  if [[ ! -d $media_dir || -z "$(ls -A $media_dir)" ]]; then
    e_error "$media_dir/ is missing or empty. Run: ./bin/media.sh restore"
    exit 1
  fi
}

check_backup() {
  if [[ -z ${MEDIA_BACKUP:-} ]]; then
    e_error "MEDIA_BACKUP is not set. Add it to .env (see bin/media.sh)."
    exit 1
  fi
  # Must already exist, so an unmounted Drive fails instead of writing elsewhere
  if [[ ! -d $MEDIA_BACKUP ]]; then
    e_error "Backup folder not found: $MEDIA_BACKUP (is Google Drive running?)"
    exit 1
  fi
}

case ${1:-} in
  backup)
    check_media
    check_backup
    e_header "Backing up $media_dir/ to Google Drive..."
    rsync -a --checksum --exclude='.DS_Store' "$media_dir/" "$MEDIA_BACKUP/"
    e_success "Media backed up"
    ;;
  restore)
    check_backup
    e_header "Restoring $media_dir/ from Google Drive..."
    mkdir -p $media_dir
    rsync -a --checksum --exclude='.DS_Store' "$MEDIA_BACKUP/" "$media_dir/"
    e_success "Media restored"
    ;;
  check)
    check_media
    ;;
  *)
    echo "Usage: $0 backup|restore|check"
    exit 1
    ;;
esac
