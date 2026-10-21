package _02_classes;

import _02_classes.entities.Dog;

/*
 * `super` refers to the immediate parent class.
 *
 * It can call a parent-class constructor using super(...),
 * access parent-class methods using super.method(),
 * and access parent-class fields using super.field when accessible.
 *
 * A call to super(...) must be the first statement in a constructor.
 */
public class _22_Super {

    static void main(String[] args) {
        Dog dog = new Dog("Buddy");

        dog.makeSound();
        dog.sleep();
    }
}