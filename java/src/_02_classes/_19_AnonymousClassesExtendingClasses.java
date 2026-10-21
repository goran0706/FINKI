package _02_classes;

import _02_classes.entities.Animal;

/*
 * An anonymous class can extend an existing class and override its methods
 * without declaring a separate named subclass.
 *
 * It is useful for one-off implementations that do not need to be reused.
 */
public class _19_AnonymousClassesExtendingClasses {

    static void main(String[] args) {
        Animal animal = new Animal("Buddy") {
            @Override
            public void makeSound() {
                System.out.println(getName() + " says: Woof!");
            }
        };

        animal.makeSound();
        animal.sleep();
    }
}