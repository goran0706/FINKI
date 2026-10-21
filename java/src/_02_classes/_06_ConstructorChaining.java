package _02_classes;

import _02_classes.entities.Person;

/*
 * Constructor chaining uses this(...) to invoke another constructor
 * in the same class.
 *
 * Each constructor delegates initialization instead of duplicating it.
 * The call to this(...) must be the first statement in the constructor.
 */
public class _06_ConstructorChaining {

    static void main(String[] args) {
        Person person1 = new Person("Alice", 25);
        Person person2 = new Person("Bob");
        Person person3 = new Person();

        person1.introduce(); // My name is Alice and I am 25 years old.
        person2.introduce(); // My name is Bob and I am 0 years old.
        person3.introduce(); // My name is Unknown and I am 0 years old.
    }
}