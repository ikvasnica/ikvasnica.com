---
layout: post
title: "I'm moving from Mac to Windows as a web developer"
---

Not intentionally, really. Not that I was happy about that. In fact, the first day I was so frustrated with development environment on Windows 10 that I was seriously considering buying the new Macbook Pro I dislike so much.

But first things first. **Why the hell, Ivan?! I mean, Windows, seriously?**

The explanation is simple. I was working with my Macbook Air and was satisfied with pretty much everything. Except the lagging. Chrome with few tabs, PHPStorm with one or two big Drupal and Symfony projects, MAMP Pro with Apache server, MySQL and PostgreSQL daemons, Slack, Microsoft Office,... you see where I'm going, right?

**My 4 GB of RAM were just not enough anymore.** Not to mention an ultrabook-like 1,3 GHz processor. I think even my smartphone is more powerful than this little thin laptop.

So here I am, starting again with a new company Windows laptop.

Painful, of cou...actually, not so much!

## So wait. Do you like Windows?!

No. Not yet. But it doesn't suck as I expected.

I know, this doesn't seem like you should be convinced to switch back from your Mac or Linux machine. Rather than that, I would like to point out few things that I like and dislike about Windows from a web developer point of view.

### Bash

**If there is one single reason you should stay away from Windows, it's this.** I'm not a Linux fanatic who needs to have everything done in a terminal. But oh my god, Bash is so convenient way how to solve stuff quickly.

Yes, even in a web development.

I work frequently with command line tools like _Drush_ or _Symfony Console_, or just installing new development tools on my Mac in terminal.

Yes, I know, **you can install Windows Ubuntu bash**. But it doesn't run Windows exes (like the PHP interpreter).

[Git bash](https://git-scm.com/downloads) can do that and to manage your SSH keys for instance, but you need to accept the Windows' folder structure and Windows programs don't print to the tty's standard output.

So you cannot, for example, use pipelines on them. On the other hand, you can get used to it after a while and you can still do pretty much everything you do in a standard Unix bash.

### Apache, PHP, MySQL

I used to pay for [MAMP Pro](https://www.mamp.info/en/mamp-pro/) on Mac. It has everything any PHP developer needs - Apache server, PHP, MySQL - plus a nice UI where you can set everything very quickly. Including adding and editing virtual hosts and run them with different PHP versions at the same time. Which was one of the main reasons I was using it.

They have also a Windows version. But only the old one, not with the newest features.

And then I remembered about troubles I was going through with setting up the Mac version in early stage, like exposing the right PHP version to the command line, and I was pretty sure I didn't want to go through this hell on Windows, where everything was going to be different.

Therefore I have chosen [XAMPP](https://www.apachefriends.org/index.html). **Almost no UI, you need to install all PHP extensions manually and I can only dream about editing virtual hosts quickly.** But it works and it's leightweight.

The biggest fail is that it offers only a 32-bit Windows version. So in my case, needing to run a 18 GB MySQL database, it's pretty limiting that I can use only around 3,5 GB RAM for that.

But hey, it still runs much faster than my Mac. I know, not very fair comparison, considering that the Windows notebook has twice as big RAM and fast processor, but everything really seems smooth and very fast.

### Everyday tools

The rest of differences is pretty much about **personal preferences and habits**. I still cannot even smell Notepad and rather use [Atom](https://atom.io/) for everything outside PHPStorm projects, even though it's starting for ages.

Microsoft Office is definitely better and Chrome is much faster and usable on Windows. **I miss OS X's gestures** (a lot!), simple Notes app and everyday easy-to-use tools and little stuff that makes this system wonderful.

But watch out, Windows is no longer the 8's desktop-tablet-no-start-menu mess. Actually, there are **a lot of things better than on Mac**, like the file explorer (Finder is somewhat outdated) or system of maximizing applications. Nope, I still haven't got used to the Mac system after those years.

## Windows is more usable than I thought

To conclude the story, I underestimated Windows. **It's a good, flexible choice even for (PHP) web development.**

The only big pain for me is the absence of the real Bash andinstalling everything by the click-on-next-until-it-finally-works method. I can run everything I used on Mac (PHPStorm, Composer, XDebug, Git, Drush,...) and [I'm not the only one who has the same experience](http://www.newmediacampaigns.com/blog/woah-i-switched-to-windows-and-its-awesome-for-php-development), apparently.

**If I have a to decide in future again, would I choose a Mac or Windows?** Mac, perhaps. But after this experience I wouldn't be afraid of working on Windows anymore.

Yes, I needed to figure out how to do the same stuff on Windows and sometimes I needed to hack around to have it worked as I expected.

You might say that I added some extra, non-productive work and you're absolutely right. **That's the reason I still prefer Unix systems**.

However, until then, I will be enjoying web development on the Microsoft platform.

Do you have similar experience of trying multiple platforms for development? Share it in comments below!