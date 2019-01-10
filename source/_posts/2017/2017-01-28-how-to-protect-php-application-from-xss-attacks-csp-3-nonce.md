---
id: 6
title: "How to protect PHP application from XSS attacks: CSP 3 nonce"
tags: "PHP, Symfony, CSP, Content Security Policy, nonce, XSS, attack, hack, security"
related_posts: [4,8]
---

_If you wish, you can [go directly into the CSP 3 nonce implementation in Symfony](#nonce-symfony)._

Symfony is a pretty much secure framework by default. However, that doesn't imply that an unexperienced developer cannot introduce a severe security bug into his application.

## Stealing credit card numbers, showing fake login screens...

**One of the most common and most dangerous security risk** in web development is a [cross-site scripting attack (XSS)](https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)). Long story short, an attacker could run a JavaScript snippet right on your website if you allow him to do so. Users cannot do anything about it.

By running a script, I don't mean just alerting an annoying message. [I mean collecting user information](https://www.owasp.org/index.php/OWASP_Xenotix_XSS_Exploit_Framework#tab=Features) including **his passwords, credit card numbers, showing him a fake Google login page or LastPass pop-up**. Even an advanced user could not spot a difference between the fake and real one.

![Xenotic XSS Exploitation Framework](/img/posts/xenotic.png)  
_Collecting credit card numbers by listening to POST requests._

## Content Security Policy and 'nonce' attribute

So how should you protect a Symfony application properly?

When it comes to an XSS attack, the first advice should always be to **use a reliable templating engine**. In PHP world, it's usually Twig. It automatically escapes every string that is being showed to users.

This should be standard. **A golden rule.**

But what if we don't always use it? What if there is a bug in Twig or [somewhere else](https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet)? We can protect our users even further. Meet the [Content Security Policy (CSP)](https://www.w3.org/TR/CSP3/), **a built-in security feature in modern browsers.**

Eeer...built-in. Well... Some browsers support the most recent version (3) of CSP, like Chrome, some of them are going to support it soon (Firefox) or supports just older, much more complicated specifications (Safari). And even with Chrome, there are many users with old versions installed. This causes many problems.

**Fortunately, there is a way how to secure at least users with recent versions of a browser while offering some backward compatibility protection** to browsers supporting CSP 2 or 1.

All you need to do is to set HTTP response header _Content-Security-Policy_ in each request with this value:

```
script-src 'nonce-randomNonceString' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic' https: http:; object-src 'none'
```

Note the _randomNonceString_ value. You should generate a random, long string per each request and put it into each script tag on your website. Otherwise, (modern, most recent) browser will block it from being loaded.

```html
<script nonce="nonceRandomString"></script>
```

## <a name="nonce-symfony"></a>How to generate CSP nonce automatically in Symfony

Finally, **let's implement CSP 3 and nonce parameters into a PHP application**. I will use the Symfony Framework as an example, but the principle is the same everywhere, even in vanilla PHP. Feel free to post your solutions in other frameworks in comments, I will be happy to put it into the article.

First of all, there might be already a ready to use plugin. You might use, for example, [NelmioSecurityBundle](https://github.com/nelmio/NelmioSecurityBundle) which implements this. This bundle has a lot of functionality, which you might not use, so let's try to do our own solution.

**What we want to achieve:**

1.  Generate a random _nonce_ string on each request.
2.  Put the _nonce_ string as an attribute into each _script_ tag
3.  Set the same string as a value to the _Content-Security-Policy_ HTTP header.

### 1\. Generate a random nonce string on each request.

Let's create a service (a PHP class) for that! First, **generate a random string, but only once during a request**.

#### src/AppBundle/NonceGenerator.php

```php
namespace AppBundle;

class NonceGenerator
{

    /** @var String|null */
    private $nonce;

    /**
     * Generates a random nonce parameter.
     *
     * @return string
     */
    public function getNonce() : String
    {
        // generation occurs only when $this->nonce is still null
        if (!$this->nonce) {
            $this->nonce = base64_encode(random_bytes(20));
        }

        return $this->nonce;
    }

}
```

### 2\. Put the _nonce_ string as an attribute into each _script_ tag

Unfortunately, we need to put the _nonce_ attribute manually into each _script_ tag. **It might be an issue when it comes to third party bundles in Symfony** (or generally any plugins in other frameworks) where you have no control over the code.

You may hack it by overriding templates, for example, but if it's really not possible, either make an exception for a specific routes or open an issue on a repository for the specific project and request authors to either implement the CSP nonce support or to make templates more flexible.

In your own code, you need to call the _getNonce()_method. If you use Twig (you should!), the best way is to **create a custom Twig function**. Let's do that.

#### src/AppBundle/NonceGenerator.php

```php
namespace AppBundle;

class NonceGenerator extends \Twig_Extension
{

    // ...
    /**
     * @return array
     */
    public function getFunctions()
    {
        return [
            new \Twig_SimpleFunction('csp_nonce', [$this, 'getNonce']),
        ];
    }

    // ...

}
```

The code creates a simple Twig function _csp_nonce_ which will just return a result from our _getNonce _method. Now use it in your Twig templates.

```html
<script src="/path/to/script.js" nonce="{{ csp_nonce() }}"></script>
```

### 3\. Set the same string as a value to the _Content-Security-Policy_ HTTP header.

Setting _nonce_ attributes is useless without informing the browser that we want to enforce CSP rules.

In Symfony, we create an event listener to the _kernel.response_ event so **it gets called every time a response is sent to the browser**.

#### src/AppBundle/XSSProtector.php

```php
namespace AppBundle;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class XSSProtector implements EventSubscriberInterface
{

    /** @var NonceGenerator $nonceGenerator */
    private $nonceGenerator;

    public function __construct(NonceGenerator $nonceGenerator)
    {
        // inject the nonce generator service we created in previous steps
        $this->nonceGenerator = $nonceGenerator;
    }

    /**
     * @return array
     */
    public static function getSubscribedEvents()
    {
        // listen to the kernel.response event
        return [KernelEvents::RESPONSE => 'addCSPHeaderToResponse'];
    }

    /**
     * Adds the Content Security Policy header.
     *
     * @param \Symfony\Component\HttpKernel\Event\FilterResponseEvent $event
     */
    public function addCSPHeaderToResponse(FilterResponseEvent $event)
    {
        // get the Response object from the event
        $response = $event->getResponse();

        // create a CSP rule, using the nonce generator service
        $nonce = $this->nonceGenerator->getNonce();
        $cspHeader = "script-src 'nonce-" . $nonce . "' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic' https: http:; object-src 'none';";

        // set CPS header on the response object
        $response->headers->set("Content-Security-Policy", $cspHeader);
    }
```

Don't forget to register your newly created services.

#### app/config/services.yml

```
services:  
  app.nonce_generator:
    class: AppBundle\NonceGenerator
    tags:
      - { name: twig.extension }

  app.xss_protector:
    class: AppBundle\XSSProtector
    autowire: true
    tags:
      - { name: kernel.event_subscriber }
```

**That's it! Now each script tag should have a random _nonce_ attribute after each refresh of the website.**

Do you have any comments or improvements? I'm looking forward to your comments below.