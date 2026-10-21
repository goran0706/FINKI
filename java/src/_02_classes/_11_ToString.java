package _02_classes;

import _02_classes.entities.Person;

/*
 * toString() returns a string representation of an object.
 *
 * The default implementation inherited from Object typically includes
 * the class name and an identity-based hash representation.
 *
 * Override toString() to provide meaningful information about an object.
 * String concatenation and System.out.println(object) call toString()
 * automatically.
 */
public class _11_ToString {

    static void main(String[] args) {
        Person person = new Person("Alice", 25);

        System.out.println(person);
        // Person{name='Alice', age=25}
    }
}
