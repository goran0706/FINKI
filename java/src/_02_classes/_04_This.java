package _02_classes;

import _02_classes.entities.Person;

/*
 * `this` refers to the current object.
 *
 * It is commonly used to distinguish instance fields from constructor
 * or method parameters when they have the same name.
 *
 * `this` can also call other constructors in the same class,
 * but that usage is demonstrated separately in constructor chaining.
 */
public class _04_This {

    static void main(String[] args) {
        Person person = new Person("Alice", 25);

        person.introduce();
    }
}