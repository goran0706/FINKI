package _02_classes;

import _02_classes.entities.Person;

/*
 * The == operator compares object references: whether two variables
 * refer to the same object.
 *
 * The equals() method compares objects according to their equality
 * implementation. Without overriding equals(), Object.equals() also
 * compares references.
 *
 * Use == when checking object identity and equals() when checking
 * logical equality.
 */
public class _10_ComparingObjects {

    static void main(String[] args) {
        Person person1 = new Person("Alice", 25);
        Person person2 = new Person("Alice", 25);
        Person person3 = person1;

        // Different objects, even though their field values match.
        System.out.println(person1 == person2);      // false
        System.out.println(person1.equals(person2)); // false (equals is not overridden yet)

        // Both variables refer to the same object.
        System.out.println(person1 == person3);      // true
        System.out.println(person1.equals(person3)); // true
    }
}