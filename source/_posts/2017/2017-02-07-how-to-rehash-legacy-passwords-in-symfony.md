---
layout: post
title: "How to rehash legacy passwords in Symfony"
---

So you've decided to send a legacy project to his well-deserved retirement and write a nice, clean code instead. But there is an asset you cannot throw away. **Users**.

If you care about web security at least a bit and you haven't lived in a cave for the last couple of years, you might have heard of a fact that **storing users passwords in plaintext is a bad thing.** So even your legacy project did hopefully use a hashing algorithm. But since you care about the security, you would like to use bcrypt for all users. Right now.

*This post has been written for the Czech PHP community blog. You can [continue reading there](https://pehapkari.cz/blog/2017/02/06/how-to-rehash-legacy-passwords-in-symfony/).*