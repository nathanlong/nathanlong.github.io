---
title: "Git: Remove Dead Branches"
description: A quick command to get rid of stale git branches.
date: 2026-03-10T16:37:00-0400
tags: [tooling]
---

It's very common near the end of a project to have a hot pile of **dead branches**: branches that originally tracked something upstream but have since been deleted.

Your original `super-awesome-feature` branch was merged via PR (pull request) on GitHub and deleted there after review, but you still have it locally, which means the branch is now considered dead. Manually cleaning up these branches can be tedious. I use a small script to clean up my local branches:

```bash
git fetch -p && git branch --format '%(refname:short) %(upstream:track)' | awk '$2=="[gone]" {print $1}' | xargs -r git branch -D
```

To break it down, the script:

1. Updates your remote references
2. List local branches and their upstream tracking status
3. Filter branches whose upstream is `[gone]`
4. Force-delete those branches

And in more detail:

## Fetch and Prune

```bash
git fetch -p
```

This downloads updates from the remote repository but does not merge them. The `-p` flag removes stale remote-tracking references.

## Chain a command

`&&`

The double-ampersand is a bash control operator that only moves onto the next part if the previous command succeeds. (If it exits with a status of 0).

## List local branches

```git
git branch --format '%(refname:short) %(upstream:track)'
```

This will return a list of local branches formatted with the short branch name and the upstream tracking status. Something like:

```markup
main [ahead 1]
feature-login [behind 2]
feature-api [gone]
old-feature [gone]
super-awesome-feature [gone]
```

The `[gone]` here means that at one point, the branch tracked something upstream, but that upstream branch no longer exists.

## Filter the branch list

```bash
| awk '$2=="[gone]" {print $1}'
```

This uses the bash pipe operator (`|`) to feed the branch list into `awk`, which splits on whitespace and processes the input line by line.

So an item like:

```markup
feature-api [gone]
```

turns into:

```markup
$1 = feature-api
$2 = [gone]
```

However, we have a condition of `$2=="[gone]"` which makes `awk` only process lines with the second field of `[gone]`. It discards the ones that don't match.

```bash
{print $1}
```

We then only output the first field, in this case, `feature-api`, to form a new list of just the dead branches.

## Delete dead branches

```bash
| xargs -r git branch -D
```

The final part of the script pipes our new dead branch list into `xargs`, which converts input into command arguments. The `-r` flag here is a safety measure to not run the command if there's no input.

So `xargs` will receive a list like:


```markup
feature-api
old-feature
```

Which gets turned into:

```git
git branch -D feature-api old-feature
```

And then `git` force deletes those branches.

Handy!
