---
id: 1
title: "How to enable PHP APC cache in command line with MAMP"
tags: "MAMP, OS X, Mac, Apple, PHP, localhost, APC, cache, bash, shell"
related_posts: [2,3]
---

You’re developing your awesome new web project on localhost. But sooner or later, everything should be tested out in an environment **as close as possible to a production set-up**.

And you want to use the **APC cache** for that, [which stores the PHP bytecode](https://pantheon.io/docs/alternative-php-cache/) and recompiles source code only if it changes.

However, if you use _MAMP (Pro)_ and try to use one of the _PHP CLI_ (command line interface) tools (e.g. _Symfony Console_ or _Drush_), you might be surprised with a bunch of errors.

The reason is simple. **MAMP uses different php.ini configuration for CLI.** You can locate this file easily in your terminal:
```bash
    $ php -i | grep php.ini
    Configuration File (php.ini) Path => /Applications/MAMP/bin/php/php7.0.10/conf
    Loaded Configuration File => /Applications/MAMP/bin/php/php7.0.10/conf/php.ini
```
Open the file with your favorite editor:

```bash
$ vim /Applications/MAMP/bin/php/php7.0.10/conf/php.ini
```

By pressing _/_, typing _‘apc’_ and pressing _ENTER_, you can locate the APC section of the configuration file. Just uncomment the following line (delete the leading _;) )_:

```bash
;extension=apcu.so
```

**That’s it!**

There is, however, another issue. If your web application or CLI tool crashes, you need to **clear the APC cache**. That’s as simple as restarting your _Apache / nginx_ server. If you cannot restart the servers, try following [this manual to build an automated script](http://stackoverflow.com/a/3580939/6817376).

Reference: [http://stackoverflow.com/questions/19364973/how-to-use-apc-with-mamp-php-command-line](http://stackoverflow.com/questions/19364973/how-to-use-apc-with-mamp-php-command-line)
