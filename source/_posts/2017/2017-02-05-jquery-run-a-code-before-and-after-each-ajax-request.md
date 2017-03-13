---
layout: post
title: "jQuery: Run a code before and after each AJAX request"
tags: "jQuery, JavaScript, AJAX"
---

This article shows a quick jQuery hack how to wrap AJAX requests in a way that certain actions happen every time you trigger them.

**Consider an example:** You have multiple AJAX requests across your JavaScript application. Perhaps a lot of buttons, each sending different request to backend. But on each of those requests, you would like to **run few callbacks before and after**. More specifically, you want to show a loading animation and change the button text.

How to achieve that using jQuery?

It's easy, right? Just use [global AJAX event handlers](http://api.jquery.com/category/ajax/global-ajax-event-handlers/).

```javascript
var sendButton = $('#send-button')
var oldText = ''

$(document)
  .ajaxStart(function () {
    oldText = sendButton.text()
    sendButton.text('Loading...')
  })
  .ajaxComplete(function () {
    sendButton.text(oldText)
  })
```

This approach may be a good fit for you. But only as long as you have one element relying on AJAX request per page. If you have multiple ones, the text would be changed on all of them.

**Hmm... What about binding the AJAX callbacks to elements instead of the global document?** Well, as of jQuery 1.9, [that is no longer possible](https://jquery.com/upgrade-guide/1.9/#ajax-events-should-be-attached-to-document).

## Create your own AJAX wrapper

The solution is to write your own jQuery AJAX wrapper around the default _$.get()_ (or _$.post()_ ) method. **It's simple as this:**

```javascript
var AJAX = {
  fetch: function (url, data, targetObj) {
    var oldText = ''
    targetObj = (this.isDefined(targetObj) ? targetObj : null)
    if (targetObj) {
      oldText = targetObj.text()
      targetObj.text('Loading...')
    }

    return $
      .get(url, data)
      .always(function () {
        // if target object is provided, run end callbacks on it
        if (targetObj) {
          targetObj.text(oldText)
        }
      })
  }
}
```

It will do the same as the previous example, but only to the object that triggers the AJAX request. Moreover, if you don't provide the target object, it behaves like you have called _$.get()_ function. You can add more _.done_ and _.always_ callbacks, all of them will be executed.

Now, let's rewrite the example so we can **add more default callbacks and keep them a little bit separated**.

```javascript
fetch: function (url, data, targetObj) {
    // cache provided to callbacks
    var cache = {}

    // all default callbacks are applied
    var getDefaultCallbacks = function () {
      return {
        changeText: function (targetObj) {
          var currentText = targetObj.text()
          var newText = (typeof cache.oldText !== 'undefined' ? cache.oldText : 'Loading...')
          targetObj.text(newText)
          cache.oldText = currentText
        },

        toggleClass: function (targetObj) {
          targetObj.toggleClass('loading')
        }
      }
    }

    // iterate over available callbacks and run them
    var runCallbacks = function (targetObj) {
      // if no target object has been provided, don't run any callback
      if (!targetObj) {
        return false
      }

      // get a runnable callback list
      var callbacksToRun = getDefaultCallbacks()

      // run callbacks
      for (var callback in callbacksToRun) {
        if (callbacksToRun.hasOwnProperty(callback) && typeof callbacksToRun[callback] === 'function') {
          callbacksToRun[callback](targetObj)
        }
      }
    }

    // if target object is provided, run start callbacks on it
    targetObj = (this.isDefined(targetObj) ? targetObj : null)
    runCallbacks(targetObj)

    return $
      .get(url, data)
      .always(function () {
        // if target object is provided, run end callbacks on it
        runCallbacks(targetObj)
      })
  }
```

The code looks complicated, but it's basically the same, only we can now add more callbacks into the _getDefaultCallbacks_ list. **Please note that the callbacks are written in a way they can be used both on start and finish of an AJAX request.** They will just toggle the state.

## Adding custom AJAX callbacks

We can improve it further. Let's say you want to run completely different callbacks for some elements. No problem. Just add support for custom callbacks.

```javascript
fetch: function (url, data, targetObj, callbackStart, callbackEnd) {
    // ...

    var runCallbacks = function (customCallback, targetObj) {
      //...

      // get a runnable callback list
      var callbacksToRun = (typeof customCallback !== 'undefined' ? { custom: customCallback} : getDefaultCallbacks())

      // ...
    }

    // ...

    runCallbacks(callbackStart, targetObj)

    return $
      .get(url, data)
      .always(function () {
        // if target object is provided, run end callbacks on it
        runCallbacks(callbackEnd, targetObj)
      })
  }
```

The only change is that we can pass custom callbacks to our _fetch_ function. These must be functions that we can pass a target object to.

## Logging errors automatically

You can even **automate logging AJAX errors**. Just add few helper methods.

```javascript
var AJAX = {
  /* HELPER WRAPPER FUNCTIONS */
  logAjaxError: function (jqXHR, textStatus, errorThrown) {
      console.log('AJAX ERROR:' + errorThrown)
  },

  // check whether response contains an error message and logs them
  handleAjaxError: function (response) {
    if (typeof response.error !== 'undefined' && typeof response.error_description !== 'undefined') {
        AJAX.logAjaxError(response.error_description)
    }
  },

  // ...

  fetch: function (url, data, targetObj, callbackStart, callbackEnd) {
    // ...

    return $
      .get(url, data)
      .done(this.handleAjaxError)
      .fail(this.logAjaxError)
       // ...
  }
```

**And that's it!** You can now call _AJAX.fetch()_ method instead of _$.get()_ wherever you want. Just pass it _$(this)_ object and it will perform default callbacks on it.

```javascript
AJAX
  .fetch('backend_script.php', { id: 12345}, $(this))
  .done(function (response) {
    console.log(response)
  })
```

Check out the [full version of this code on GitHub](https://github.com/ikvasnica/js_fetch).