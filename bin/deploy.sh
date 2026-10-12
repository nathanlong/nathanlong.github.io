#!/bin/zsh
set -eu
source ./bin/utils.sh

timestamp=$(date "+%y%m%d")
build_dir='dist'
deploy_dir='.gh-pages'
branch='gh-pages'

e_header "Building site..."
npm run build
e_success "Built!"

e_header "Attaching git worktree..."
rm -rf $deploy_dir
git worktree prune
git worktree add $deploy_dir $branch

# Guard: never commit unless we're really in the gh-pages worktree
if [[ ! -f $deploy_dir/.git || $(git -C $deploy_dir branch --show-current) != $branch ]]; then
  e_error "Worktree not on $branch — aborting"
  exit 1
fi

e_header "Syncing build into worktree..."
rsync -a --delete --exclude='.git' $build_dir/ $deploy_dir/

e_header "Creating new build for $timestamp"
git -C $deploy_dir add --all
git -C $deploy_dir commit --amend --reset-author --message "build $timestamp"
git -C $deploy_dir push origin $branch --force-with-lease

git worktree remove $deploy_dir
e_success "Build $timestamp pushed to remote"
