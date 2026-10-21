package _02_classes;

import _02_classes.entities.Person;

/*
 * A Java source file can contain multiple top-level classes.
 *
 * Only one top-level class in a file can be public, and its name must
 * match the filename.
 *
 * Other top-level classes can have package-private access, making them
 * accessible only within the same package.
 */
public class _12_MultipleClassesInOneFile {

    static void main(String[] args) {
        Person person = new Person("Alice", 25);
        Greeting greeting = new Greeting();

        person.introduce();
        greeting.sayHello(person.getName());
    }
}

// Package-private top-level class declared in the same file.
class Greeting {

    public void sayHello(String name) {
        System.out.println("Hello, " + name + "!");
    }
}