package _02_classes;

import _02_classes.entities.Person;

/*
 * A class defines the structure and behavior of objects.
 * An object is an instance of a class, created using the `new` keyword.
 *
 * Multiple objects can be created from the same class.
 * Each object maintains its own instance field values.
 */
public class _01_ClassesAndObjects {

    static void main(String[] args) {
        Person person1 = new Person("Alice", 25);
        Person person2 = new Person("Bob", 30);

        person1.introduce();
        person2.introduce();

        // Each object maintains independent state.
        person1.setAge(26);

        System.out.println(person1.getAge()); // 26
        System.out.println(person2.getAge()); // 30
    }
}