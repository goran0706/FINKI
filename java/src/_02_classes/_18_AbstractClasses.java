package _02_classes;

import _02_classes.entities.Animal;
import _02_classes.entities.Cat;
import _02_classes.entities.Dog;

/*
 * An abstract class cannot be instantiated directly.
 * It can define abstract methods that subclasses must implement
 * and concrete methods that subclasses inherit.
 */
public class _18_AbstractClasses {

    static void main(String[] args) {
        Animal dog = new Dog("Buddy");
        Animal cat = new Cat("Luna");

        dog.makeSound();
        cat.makeSound();

        dog.sleep();
        cat.sleep();
    }
}