---
layout: post
title: "EasyAdmin Bundle: How to remove null values when sorting entities"
---

**Some web applications have a secret.** I mean, an administration interface. You know, that part of the website behind the _/admin_ you don’t want to expose (especially if you don’t care about cross-site scripting vulnerabilities).

But you rarely develop these interfaces on your own. There are plenty of Symfony bundles to deal with this issue. Right now, I am working with [the EasyAdmin bundle](https://github.com/javiereguiluz/EasyAdminBundle). It is straightforward, solves more or less all common problems and is really easy to use. All the configuration is done via YAML files.

However, as our system was growing over time, **very specific needs began to rise that are not solvable in the non-coding way.**

For instance, **sorting a timestamp field on an entity**. Looks like a trivial problem, right? Wrong. It turned out that EasyAdmin doesn’t filter out _null_ values from the field. So when a user wants to see, for example, the most recent logged in users, she will see users who have not logged yet instead. **Quite an opposite result!**

Fortunately, Easy Admin comes [with a bunch of events](https://github.com/javiereguiluz/EasyAdminBundle/blob/master/Resources/doc/book/7-complex-dynamic-backends.md) you can hook into. I decided to solve the problem in a way that **the _null_ results are not visible at all** when sorting a specific timestamp field on a specific entity. If you have another idea for a solution, feel free to drop a comment below.

## 1\. Create a kernel event subscriber

...or listener, if you prefer. Subscriber to the _POST_LIST_QUERY_BUILDER_, so **we can modify an already created **_**QueryBuilde**r_ and thus SQL query, coming from the EasyAdmin bundle.

```php
namespace AppBundle\Subscriber;

use JavierEguiluz\Bundle\EasyAdminBundle\Event\EasyAdminEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\EventDispatcher\GenericEvent;
use Doctrine\Common\Collections\Criteria;

class EasyAdminSubscriber implements EventSubscriberInterface
{

    public static function getSubscribedEvents()
    {
        return [
            EasyAdminEvents::POST_LIST_QUERY_BUILDER => 'lastLoginSortWithoutNull',
        ];
    }
```

And don't forget to register it in _services.yml._

```
services:  
  app.easyadmin_subscriber:
    class: AppBundle\Subscriber\EasyAdminSubscriber
    tags:
      - { name: kernel.event_subscriber }
```

## 2\. Limit the subscriber

Create the method to do the magic. You should apply the filter only to entities and/or fields it is necessary. **Be careful,** otherwise you might break something else.

```php
public function lastLoginSortWithoutNull(GenericEvent $event)
{
        // get necessary variables from the event
        $subject = $event->getSubject();
        $sortField = $event->getArgument('sort_field');

        // apply only when user is sorting by lastLogin in the User entity
        if ($subject['name'] !== 'User' || $sortField !== 'lastLogin') {
            return;
        }

        /* ... */
}
```

## 3\. Apply a Criteria

Doctrine comes up with a handy helper to solve exactly these kind of problems. It's called _Criteria_ and, as the name suggests, **you can add another criteria to an existing _QueryBuilder_**. In our case, we don't want rows with _lastLogin_ of _null_.

```php
public function lastLoginSortWithoutNull(GenericEvent $event)
{
        /* ... */

        // filter out NULL values from the result set
        $queryBuilder = $event->getArgument('query_builder');
        $criteria = Criteria::create()->where(Criteria::expr()->neq('lastLogin', null));
        $queryBuilder->addCriteria($criteria);
}
```

**And that's it!** The _QueryBuilder_ is now modified and will return only User entities that have been logged in at least once.

You can use _Criteria_ in many places and I suggest that you [read their documentation](http://docs.doctrine-project.org/projects/doctrine-orm/en/latest/reference/working-with-associations.html#filtering-collections), because it's a powerful tool. It works on the SQL level so performance is much better than filtering array collections, for instance.