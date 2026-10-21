package _02_classes;

import _02_classes.entities.Person;

/*
 * A constructor initializes an object when it is created.
 *
 * Its name must match the class name, and it has no return type.
 * The `new` keyword creates the object and invokes its constructor.
 */
public class _03_Constructors {

    static void main(String[] args) {
        // Pass arguments to the constructor to initialize the object.
        Person person = new Person("Alice", 25);

        person.introduce();
    }
}