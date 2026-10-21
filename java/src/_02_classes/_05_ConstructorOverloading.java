package _02_classes;

import _02_classes.entities.Person;

/*
 * Constructor overloading allows a class to provide multiple ways
 * to initialize objects.
 *
 * Each constructor must have a distinct parameter list.
 * Java selects the matching constructor based on the supplied arguments.
 */
public class _05_ConstructorOverloading {

    static void main(String[] args) {
        Person person1 = new Person("Alice", 25);
        Person person2 = new Person("Bob");

        person1.introduce();
        person2.introduce();
    }
}