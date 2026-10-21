package _02_classes;

import _02_classes.entities.Person;

/*
 * Objects can be passed as method arguments.
 *
 * Java passes arguments by value. When an object is passed, the value
 * copied is the reference to that object, not a copy of the object itself.
 *
 * The method can use that reference to modify the object's state.
 */
public class _08_ObjectsAsArguments {

    static void main(String[] args) {
        Person person = new Person("Alice", 25);

        printPerson(person);

        // The method receives a reference to the same object.
        celebrateBirthday(person);

        System.out.println(person.getAge()); // 26
    }

    public static void printPerson(Person person) {
        person.introduce();
    }

    public static void celebrateBirthday(Person person) {
        person.setAge(person.getAge() + 1);
    }
}