---
title: "Git: Fixing Mistakes"
description: Like knowing where the brakes are on a car, knowing how to fix Git mistakes lets you try things with confidence.
date: 2025-02-21T13:58:30-0500
tags: [tooling]
---
Git—love it or hate it, you'll be using it nearly every day as a developer. When I started using Git, I felt like I was one bad command from blowing up a project history. Now, I still blow things up regularly, but now I know how to fix them. 😎 (Usually.)

Mistakes happen—pretty much all the time. Knowing how to back out of them is like knowing where the brakes are on a car. It lets you try things with confidence, knowing that if it goes sideways you can back out and start over.

Here are some ways to fix your mistakes in Git.

## Forgot something small? Amend the commit.

Sometimes you've forgotten about that one file, or there's one small change you forgot to put in. Rather than creating a new commit you can stage the change as if you're going to make a new commit and then run:

```bash
git commit --amend
```

This will bring up the last commit message and smoosh the change in, making only one commit instead of two.

If you don't need to rewrite the commit message, just add the file you can use:

```bash
git commit --amend --no-edit
```

In both cases, because we're rewriting history, you'll need to run:

```bash
git push --force-with-lease
```

The 'force' part tells Git that, yes, you meant to do this, and the 'lease' part checks to make sure that there are no additional commits on the branch that your system doesn't know about.

> NOTE: As a general rule, force push on your own stuff with confidence BUT if it's a shared branch, MAKE SURE to check with your team first.

## Tangled or accidentally deleted a single file? Revert it.

Sometimes, you need to reset one file in particular. You can do that with:

```bash
git checkout origin/main -- path/to/file
```

This resets the specified file to the current version on a branch on the remote. If you need to reset it to a different branch, swap out `origin/main` to `origin/whatever-you-need`

If rather than a branch, you need the file from a different point in the timeline, you can replace `origin/main` with a commit hash like:

```bash
git checkout 345e8bb2 -- path/to/file
```


## Burn it all down 🔥

Sometimes, things go wrong, and you want to dump your work, find the exit, and start over. There are two levels: the minor nuke and the major nuke.


### Minor Nuke

```bash
git reset --hard HEAD
```

This is your minor nuke. It resets your current branch to the last commit (the HEAD) and discards every change made since then. This is useful if there's been a lot of accidental churn or something got updated that you didn't mean to.

### Major Nuke

```bash
# while on the branch to reset, pull the lastest from the remote
git fetch origin
# hard reset branch to remote branch
git reset --hard origin/<branch>
# remove untracked files
git clean -df
```

This is your major nuke, where `<branch>` is the name of your current branch. This discards any changes you have locally that aren't on the remote. It also force cleans any untracked directories. If you have things go very poorly

If you choose a different branch to reset to, your current branch will become an exact match of what you're pulling from. This can be what you want if you need to start over or reset something like an environment branch.

## Rewind Time

If you've committed to a branch you didn't mean to or need to move backward in time:

```bash
# find the commit you need
git log
# reset to that commit
git revert <commit-hash>
```


## Timeline Surgery!

It doesn't happen often, but if you ever need to delete a commit with a surgical judo chop that happened BEFORE or IN-BETWEEN commits, you can do some interactive rebasing:

```bash
git rebase -i HEAD~4
```

This will bring up a dialog of the last 4 commits. Delete (or comment out) the lines corresponding to the commits you wish to delete, like so:

```bash
pick 2f05aba ... #will be preserved
#pick 3371cec ... #will be deleted
#pick daed25c ... #will be deleted
pick e2b2a84 ... #will be preserved
```

Once you've finished, the commits you've selected to be deleted will be wiped from the repository's history. Because we're modifying history again, you will need to force push (but remember our general rule of force pushing!)

