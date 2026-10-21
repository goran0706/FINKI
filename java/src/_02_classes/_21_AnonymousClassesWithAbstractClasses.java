package _02_classes;

import _02_classes.entities.Animal;

/*
 * An anonymous class can extend an abstract class and implement its
 * abstract methods without requiring a named subclass.
 *
 * This is useful when the implementation is needed only once.
 */
public class _21_AnonymousClassesWithAbstractClasses {

    static void main(String[] args) {
        Animal animal = new Animal("Buddy") {
            @Override
            public void makeSound() {
                System.out.println(getName() + " says: Woof!");
            }
        };

        animal.makeSound();
    }
}