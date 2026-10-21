package _02_classes;

import _02_classes.entities.Person;

/*
 * An instance initializer block runs every time an object is created,
 * before the constructor body executes.
 *
 * If a class has multiple initializer blocks, they execute in source order.
 * Instance field initializers and instance initializer blocks execute
 * before the constructor body.
 */
public class _13_InitializerBlocks {

    static void main(String[] args) {
        Person person1 = new Person("Alice");
        System.out.println();

        Person person2 = new Person("Bob");
    }
}
