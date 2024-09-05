# Observe Triggers

Intersection observer triggers based on class names.

When activated, intersection observers will be added to any element with a class name that matches the pattern:

* {baseTriggerClass-}{rootMargin}-{threshold}-{edge}-{action}-{class}-{root}

In which:

* baseTriggerClass: The base class name that triggers the observer. Default `observe-trigger`.
* rootMargin: The root margin for the observer. Default `0`.
* edge: The edge to observe: top, bottom, left, right. Default `top`
* action: The action to perform: toggle, add, remove, replace. Default `toggle`
* class: The class to add, toggle, or remove. Default `observe-triggered`.
* root: The root element to observe. Default `null`.

## Actions

* `toggle`: Toggles the class on and off as the element crosses the intersection.
* `add`: Adds the class when the element enters the intersection. Fires once.
* `remove`: Removes the class when the element enters the intersection. Fires once.
* `replace`: Replaces any other class added by an observer trigger when the element enters the intersection.
