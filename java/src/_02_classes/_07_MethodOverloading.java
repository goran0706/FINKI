package _02_classes;

import _02_classes.entities.Person;

/*
 * Method overloading allows a class to define multiple methods
 * with the same name but different parameter lists.
 *
 * Java selects the appropriate method based on the arguments supplied.
 * Changing only the return type does not constitute overloading.
 */
public class _07_MethodOverloading {

    static void main(String[] args) {
        Person person = new Person("Alice", 25);

        person.introduce();
        person.introduce("Hello!");
        person.introduce("Good morning!", 2);
    }
}