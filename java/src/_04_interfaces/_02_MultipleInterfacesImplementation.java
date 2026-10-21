package _04_interfaces;

import _04_interfaces.interfaces.Drawable;
import _04_interfaces.interfaces.Flyable;
import _04_interfaces.interfaces.Swimmable;

/*
 * MULTIPLE INTERFACES IMPLEMENTATION
 *
 * A class can implement multiple interfaces by separating their names
 * with commas.
 *
 * The class must implement every abstract method inherited from all
 * implemented interfaces.
 *
 * This allows one class to support multiple independent capabilities.
 */
public class _02_MultipleInterfacesImplementation {

    static void main(String[] args) {

        Duck duck = new Duck();

        // Call the methods required by each implemented interface.
        duck.draw();
        duck.fly();
        duck.swim();
    }

    static class Duck implements Drawable, Flyable, Swimmable {

        @Override
        public void draw() {
            System.out.println("Drawing a duck.");
        }

        @Override
        public void fly() {
            System.out.println("Duck is flying.");
        }

        @Override
        public void swim() {
            System.out.println("Duck is swimming.");
        }
    }
}