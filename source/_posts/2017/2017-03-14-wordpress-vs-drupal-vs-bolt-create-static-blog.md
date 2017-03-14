---
layout: post
title: "WordPress vs. Drupal vs. Bolt? Create a static blog instead"
tags: "Wordpress, Drupal, Bolt, blog, static, PHP, Statie, GitHub"
---

Last year, I decided to start a blog. A very original and inventive idea, I know.
 
The main topic was IT and web development and as you can guess, the real struggle was to choose the right platform where to write.
 
I wanted to host it on **my own domain**, so I can couple posts with my portfolio and to have a greater control over the functionality and design. Therefore, Blogger and other free hosted platforms were out.

## The big ones

What's next? Wordpress, Drupal? The usual suspects. I had an experience with both of those and that was the reason to ignore them immediately.

Wordpress might be a great choice in some cases, but **not when it comes to speed**. Also, I want to support software that is well written and follows some coding standards which is not this case.

Drupal can be great for complex web applications, **not a personal blog**. Speed would be also a concern.

## Lightweight CMS

There was a rescue, I believed. [Bolt](https://bolt.cm/) looked like a light and fast PHP CMS. Moreover, it is **built on Silex**, a microframework powered by Symfony components.

I liked the idea of running my blog on technologies I used and loved rather than using the Wordpress monster full of legacy code.

The result? I really did start the blog on Bolt. But **it disappointed me**. Like a lot.

Almost everything needed to be set up via _YAML_ configuration files, there were only few plugins and themes and page loads were just slow. Then I figured out that I needed to set up caching properly to achieve a faster experience.

No, thank you.

I wanted to be everything **fast by default**. Moreover, my hosting company doesn't provide a ssh connection on shared hosting, so I could do all the updates only by FTP.

Long story short, **it was a nightmare**.

## Blog = static pages
Little I knew you can generate **your blog as a set of completely static documents**. No complicated CMS, not even a single line of PHP code.

How can I write and submit new articles, are you asking? Please, welcome [Statie](https://github.com/Symplify/Statie).

### How it works in a nutshell:
1. **Add Statie** to your project dependencies.
```bash
composer require symplify/statie
```

2. **Build templates** as you like using the Latte templating engine (unfortunately, Twig is not supported, but [the syntax is very similar](https://latte.nette.org/en/macros)).

3. In the *_posts* directory, **create posts** in the _Markdown_ format.

4. **Generate the static pages** using *gulp* or by running following command manually.
```bash
php vendor/bin/statie generate
```

Now you can run your blog locally.

## Publishing by committing
By connecting the whole thing to [GitHub Pages](https://pages.github.com/) and [Travis CI](https://travis-ci.org), publishing a new post is **just a matter of one Git commit**.

Travis will regenerate static pages after each merge into the _master_ branch and publish it to another branch used for static HTML content.

No more administration interface nor securing your PHP application.
 
[You can take a look at my implementation here](https://github.com/ikvasnica/ikvasnica.com) - this blog is completely powered by Statie and GitHub Pages now! 
 
Here are few **tutorials** by Tomáš Votruba, the creator of the tool:
- [Statie: How to run it Locally](https://www.tomasvotruba.cz/blog/2017/02/20/statie-how-to-run-it-locally/)
- [How add Contact Page With Data](https://www.tomasvotruba.cz/blog/2017/03/06/statie-2-how-to-add-contact-page-with-data/)
- [How to Add Reusable Parts of Code](https://www.tomasvotruba.cz/blog/2017/03/09/statie-3-how-to-add-reusable-parts-of-code/)
