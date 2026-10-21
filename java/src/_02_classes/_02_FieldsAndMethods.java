package _02_classes;

import _02_classes.entities.Person;

/*
 * Fields store an object's state.
 * Methods define the behavior an object can perform.
 *
 * Instance fields belong to individual objects, so each object
 * maintains its own values.
 *
 * Instance methods can read or modify the state of the current object.
 */
public class _02_FieldsAndMethods {

    static void main(String[] args) {
        Person person1 = new Person("Alice", 25);
        Person person2 = new Person("Bob", 30);

        // Call instance methods to read field values.
        System.out.println(person1.getName()); // Alice
        System.out.println(person2.getName()); // Bob

        // Modify one object's state using an instance method.
        person1.setAge(26);

        // Changing person1 does not affect person2.
        System.out.println(person1.getAge()); // 26
        System.out.println(person2.getAge()); // 30

        // Each object can perform its own behavior.
        person1.introduce();
        person2.introduce();
    }
}