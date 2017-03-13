---
layout: post
title: "Load test multiple API endpoints concurrently. Use this simple shell script"
tags: "API, bash, load test, server, shell, Linux, Unix, ab test"
---

I've been developing a new REST API used by tens of thousands of users recently.

In such cases, you need to ensure that the service **remains available and high performant** not only on your local environment, but also in production, used by, well, you know... tens of thousands of users.

Here are the options I had initially:

1.  **Using one of the paid services for load testing.** But I didn't want to spend any money on this task. Okay, there are several free options out there, but very limited in number of sent requests and other parameters.  

2.  Just run a **simple** [ab (Apache Benchmark) test](https://www.petefreitag.com/item/689.cfm).  

## Nohup to the rescue

I needed to find **a compromise** between these two solutions obviously. Free, but ideally with as many requests as I want, testing as many API endpoints as I need. All of that at the same time.

Therefore, I wrote **a simple bash script** that uses _ab_ testing and the _nohup_ Unix command. It loads all files with _*.data_ extension in the current folder and send the content as POST data to your API server. By using _nohup_ we tell the _ab _process to run in the background, even after the terminal is closed.

```bash
#!/bin/sh

SERVERPREFIX="http://your-rest-api.com/api/"
REQUESTNUMBER=500
MAXCONCURRENTREQUESTS=50

for datafile in *.data
do
    ENDPOINT="$SERVERPREFIX${ datafile%_*}"
    nohup ab -n $REQUESTNUMBER -c $MAXCONCURRENTREQUESTS -p "$datafile" -T application/x-www-form-urlencoded $ENDPOINT &
done
```

A _*.data_ file consists of simple POST data you want to send to the API, for example:

```bash
new_password=secret&mail=user@yourservice.com
```

And how do you tell the script **which endpoints to test?**

Good question!

It just takes filenames of all the _*.data_ files and append it to the URL of the API server. In other words, **it tests as many endpoints as many files you have in the folder**. You can send different data to the same endpoint as well, just add a version number to the filename.

Beware: version number are mandatory even if you have only one file per one endpoint!

Data file names can look like this:

*   pass-change_1.data
*   pass-change_2.data
*   create-user_1.data
*   etc.

## Running the script

Save the above script as l_oad-test.sh_ and **run it in your terminal**. You should see something like this:

```bash
$ bash load-test.sh
appending output to nohup.out
appending output to nohup.out
appending output to nohup.out
appending output to nohup.out
```

Now all the _ab_ processes are running in background. You can check it by typing this:

```bash
$ ps
```

Once there are no _ab _processes running, you can **check out the results**. They're all in one file - _nohup.out_. A downside is that they're all separated per each API endpoint.

```bash
$ cat nohup.out
```

Do you want to **stop all tests immediately**, before finishing them? No problem.

```bash
$ pkill ab
```

This solution has many disadvantages and can be used only for simple testing. But at least it is more flexible and useful than just simply running _ab _commands in different terminal sessions.

If you have any ideas how to improve it, feel free to comment down below the article!