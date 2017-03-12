---
layout: post
title: "Storing objects into a session in Symfony"
---

I’m writing this post mainly because of my frustration I’ve been coming through lately.

**TL;DR:** Yep, it was my mistake. But if you came here, because Symfony is crashing without any error, just after you’ve stored a session, keep reading.

Consider following situation: You have a nice Symfony service communicating with several APIs, with a sophisticated workflow behind. **What a typical use case for sessions!**

Moreover, Symfony comes with a convenient way [how to get and set sessions](https://symfony.com/doc/current/components/http_foundation/sessions.html), so you don’t need the obscure [session_start()](http://php.net/manual/en/function.session-start.php) function and _$_SESSION_ variable anymore.

## Symfony crashes after storing a session

So I decided to store a Symfony event and User object into a session. Just temporarily, between two requests, then deleting it.

```php
protected function saveCache(Event $event)
{
  $session = $event->getRequest()->getSession();
  $session->set('session_name', $event);
}
```

What was my surprise, when I wanted to test it and Symfony just crashed. _Okay, probably just a stupid mistake_, I said.

However, **Symfony showed no error, no nothing**. It seemed to me like an infinite loop because of a bad _security.yml_ configuration, but that was not the case. The only thing that helped was deleting all sessions stored for the project.

After a painful one-by-line debugging, it was clearer a bit. **Symfony just kept crashing on every call of the standard PHP function – _session_start()_!** So instead of objects, I tried to save a string. It worked! The problem were the objects.

## Never forget to use the serialize method!

It turned out that the event object did not implement _serialize()_ and _unserialize()_ methods of the _\Serializable_ interface.

In these methods, you can specify what properties will be saved during serialization, which is basically **converting an object into a long string**. This happens when you save an object into a session, for instance. The implementation of the methods might look like this:

```php
namespace AppBundle\Event;

use Symfony\Component\EventDispatcher\GenericEvent;

class MyEvent extends GenericEvent implements \Serializable
{

  /* ... */

  public function serialize()
  {
    return serialize(
      [
        $this->property1,
        $this->property2,
      ]
    );
  }

  public function unserialize($serialized)
  {
    $data = unserialize($serialized);
    list(
      $this->property1, 
      $this->property2,
      ) = $data;
  }
}
```

**Session works now! **Just be careful with saving too big objects into sessions as it may affect performance. If possible, always pass information by calling another service or forwarding requests. Also, be aware of [the session hijack attack](https://en.wikipedia.org/wiki/Session_hijacking).