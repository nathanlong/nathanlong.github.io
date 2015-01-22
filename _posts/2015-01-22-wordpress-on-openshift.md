---
layout: post
title: "Setting up WordPress on Openshift"
dek: "A guide to setting up a temporary instance of Wordpress for review"
---

So you're building a WordPress theme, you're ready to show your client, but you have nowhere to put it. Perhaps they're brand new, still setting things up, or something else is blocking access. Either way, you need to serve it up somehow to keep moving.

Or maybe you want to set up development preview of a site for a client. You need the ability to push new changes up the server as you continue development, scheduling client checkoffs along the way.

Dropping it on your own server is an option, but I recently came across [Openshift][os] which will let you do both of these things quickly and for free.

<hr>

<div class="image">
<a href="https://www.openshift.com/"><img class="svg" src="/img/1501-openshift-logo.svg" alt="Openshift"></a>
</div>

Openshift is a PaaS (Platform as a Service) similar to [Heroku][hr], but what's great about Openshift is they allow a one-button install of WordPress, taking care of PHP and mySQL for you. Easy peasy.

<hr>

### Some assumptions...

**This article assumes a couple things about your situation:**

- You already know how to set up WordPress
- You have a local installation of WordPress that you've been developing (finished or not)
- You have a basic understanding of git (git push / git pull)
- Basic comfort level with the command line (enter simple commands, basic navigation)
- You're closer to the end of a project cycle and are looking to get a review on your development or design.
- You're on a Mac (PC users will need to adjust slightly).

If those things aren't in place, you may need to change or further research some of these steps:


### 1. Set up Openshift

Once you've signed of up for an Openshift account, you're going to want to gain SSH (Secure SHell) access to your apps (this will let you use git to push and pull your WordPress themes).

If you're already familiar with ssh keys, drop it in and skip ahead.

If you don't have a ssh key ready, you'll need to make one. Open up the terminal and type:

```bash
ssh-keygen -t rsa -C "your_email@example.com"
```

Hitting enter will give you:

```bash
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/you/.ssh/id_rsa): [Press enter]
```

You've just told the computer to create an ssh key with a type (-t) of '[rsa][rsa]' and comment the file (-C) with your email address (helps you identify the key later). It then asks you where you want to save it. Unless you're planning on creating multiple keys and [managing them with a ssh config file][ssh], the default location will work just fine. (You can always add the extra security later.)

You'll be asked to enter a passphrase:

```bash
Enter passphrase (empty for no passphrase): [Type a passphrase]
# Enter same passphrase again: [Type passphrase again]
```

Pick something you'll remember, you'll need it later, and then you'll get something like this:

```bash
Your identification has been saved in /Users/you/.ssh/id_rsa.
Your public key has been saved in /Users/you/.ssh/id_rsa.pub.
The key fingerprint is:
01:0f:f4:3b:ca:85:d6:17:a1:7d:f0:68:9d:f0:a2:db your_email@example.com
```

This will create two files in a hidden directory (`~/.ssh`) called `id_rsa` and `id_rsa.pub`. One is a secret key guarded by the passphrase you just entered (`id_rsa`), the other (`id_rsa.pub`) is a public key, almost like a name tag. The public key is safe to share because it requires the other locked file to complete authorization. (So unless someone has BOTH files AND your passphrase, they cannot pretend to be you.)

We need to grab the contents of your public key for Openshift, so type:

```bash
pbcopy < ~/.ssh/id_rsa.pub
```

This will copy the entire contents of the file to your clipboard. Navigate back to your Openshift account, and on the **'Settings'** page, click the button to **'Add a New Key'**. Paste your public key in and BAM, openshift can now be accessed through SSH on your computer.



### 2. Set up a WordPress Instance

Now we need to set up a remote version of WordPress to push to.

Under **'Applications'**, click the button to **'Add Application'**.

The folks at Openshift have been kind enough to provide 1-click installs of some common applications, including WordPress.

<div class="image">
<img src="/img/1501-openshift-instant-apps.png" alt="Openshift Instant Installs">
<small>Openshift's Instant App Installs</small>
</div>

Click the WordPress button under Instant Apps and it will take you to a basic configuration screen. Leave everything as default except for the public URL. This is the address you want to claim for the app (what you'll sent to other later for review). This also doubles as the app name.

For the sake of this article, we'll use the super generic name of 'app' for our app.

Click **'Create Application'**, and let Openshift do its thing. Grab some tea or a cup of coffee - it takes a little while for it to finish initializing.

Once it's done, it'll show you some basic information on what you just created. 

Let's take note of a couple things here. Your **SQL username and password** (we'll use this later to import our database), and your **unique user identifier** (we'll use this later to upload our static assets). The user ID is a bit tricky to find, they don't spell it out for you but you can find it in two places, in the URL:

```
https://openshift.redhat.com/app/console/application/[user ID string]-app
```

or in your git repo address (labeled as Source Code):

```
ssh://[user ID string]@app-nathanlong.rhcloud.com/~/git/app.git/
```

It should be a long sequence of letters and numbers - total gibberish - but Openshift will know that's you.

Once you have those written down, finish installing WordPress by navigating to the `install.php` just like you would any instance. So:

```
http://app.nathanlong.rhcloud.com/wp-admin/install.php
```

If we've used the basic Openshift settings, we shouldn't need to touch the `wp-config.php` file at all.

Fill out all the basic steps (you should know this part) and you now have a fully operational remote instance of WordPress running.



### 3. Upload your theme

Now that we have it up and running, we need to get all our design and development up there. We'll start with the theme.

Openshift sets up a git repository for every app you create. Grab your **'Source Code'** URL and head back to the Terminal:

```bash
git clone ssh://[user-id]@app-nathanlong.rhcloud.com/~/git/app.git/
```

It will ask you for your SSH keyphrase (remember the one you just set up?).

Once everything validates, this will create a folder named `app` (our generic app name for this article, this will change to whatever you named it).

Navigate into your new repo:

```
cd app
```

and if you type `ls -A` you'll find a folder structure like this:

```bash
.git/
.gitignore
.openshift/
README
README.md
libs/
misc/
php/
```

All the files you're going to want to adjust are in `.openshift`. Because this is a hidden directory, you will not be able to browse it with just the Finder. Try entering:

```bash
cd .openshift/ && open .
```

This will navigate to the hidden folder (`cd .openshift`) and open it in the Finder (`open .`).

You'll notice that in this folder are two directories named `themes` and `plugins`. Openshift has split out the customized parts of WordPress for you. The ACTUAL install of WordPress (`wp-content` folder and etc.) in this repository, only the theme, plugins, and config files.

Copy over your themes and plugins to the right folder (either by dragging in the Finder or using `cp` in the Terminal).

Add everything to version control, commit it, and then push it back to the server:

```bash
git add -A
git commit -m "Added themes and plugins"
git push
```

This will send your files back to Openshift and will trigger your app to rebuild itself with the new files.



### 4. Upload Static Assets

You probably have some static assets we will need to move over (everything that normally lives in `wp-content/uploads`).

Because Openshift is managing WordPress for you, we have to go directly to the server this time.

You'll need an FTP client like [Cyberduck][cd], or [FileZilla][fz] to accomplish this. Open up a new connection with the following:

```
type: ssh
host: app-nathanlong.rhcloud.com
user: [userid] (that long string of gibberish you copied)
password: your openshift account password
```

You may need to give your FTP client access to you SSH credentials, but once you're in, navigate to:

```
app-root/data/current/wp-content/uploads
```

and dump the entire contents of your local `wp-content/uploads` in here. Now Openshift has all of your pictures (and whatever else you uploaded) ready.



### 5. Migrate Database

There are several ways to migrate a database between WordPress instances. I find using the plugin [WP Migrate DB][db] along with the tool phpMyAdmin to be an easy method.

Install the plugin on your local version of WordPress. This will create the option **'Migrate DB'** under **'Tools'**.

<div class="image">
<img src="/img/1501-openshift-wpdb.png" alt="WP Migrate DB settings">
<small>WP Migrate DB settings</small>
</div>

There are two columns you that handle replacing all the paths that might be in your database. The left column should already be filled out for you, fill out the right column with:

```
//app-nathanlong.rhcloud.com/
/app-root/data/current
```

And hit the **'Migrate'** button. This will download a copy of your database that we can use on Openshift.

So now, go back to Openshift in your browser. On your application page, there's a link under **'Cartridges'** that says **'Add phpMyAdmin 4.0'**. Clicking it will let you add the phpMyAdmin tool as a 'cartridge' to your app. This will let us import your database copy.

Once you've added it, there should be a button next to your new phpMyAdmin cartridge, click on that OR you can navigate to:

```
https://app-nathanlong.rhcloud.com/phpmyadmin
```

You will have to use your SQL app credentials to get in (you wrote those down, right? Refer back to the **'Application'** page if you didn't grab them).

Under the **'Database'** tab, find your database (it should have the same name as your app), select it and then move to the **'Import'** tab.

Browse your computer for your recently exported database and hit **'Go'**.

And **BOOM!** Everything's in there now. Login to your new remote WordPress install:

```
https://app-nathanlong.rhcloud.com/wp-admin
```

And get ready for your client presentation!

### 6. Final Steps

So we copied over the theme, plugins, static assets, and database. We now have two mirror copies of WordPress. If this is the final stage in your project, you're done. Send that link to the client!

But if you still have some development left, you have a few options.

You can either keep working on your local install for speed and repeat these steps when you're ready for review OR you can now work exclusively on your Openshift remote install. 

The repo that you grabbed can continually be pushed back to the server as you make changes, the only downside is you have to wait for the app to rebuild every time you push.

### Troubleshooting

Having issues with any of these steps? Give me a shout on Twitter at [@nathanmlong][twitter] and I'd be happy to help work through your issue.


[os]: https://www.openshift.com/
[hr]: https://www.heroku.com/
[rsa]: http://en.wikipedia.org/wiki/RSA_(cryptosystem)
[ssh]: http://nerderati.com/2011/03/17/simplify-your-life-with-an-ssh-config-file/
[cd]: https://cyberduck.io/
[fz]: https://filezilla-project.org/
[db]: https://wordpress.org/plugins/wp-migrate-db/
[twitter]: https://twitter.com/nathanmlong
