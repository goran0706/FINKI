package _02_classes;

import _02_classes.entities.Person;

/*
 * Methods can return objects, just as they can return primitive values.
 *
 * The return type specifies the type of object the method returns.
 * The caller can store the returned reference and use the object.
 */
public class _09_ReturningObjects {

    static void main(String[] args) {
        Person person = createPerson("Alice", 25);

        person.introduce();
    }

    public static Person createPerson(String name, int age) {
        return new Person(name, age);
    }
}