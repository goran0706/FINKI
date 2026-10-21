package _04_interfaces;

import _04_interfaces.interfaces.Drawable;
import _04_interfaces.interfaces.Flyable;

/*
 * POLYMORPHISM WITH INTERFACES
 *
 * Polymorphism allows an interface reference to refer to objects
 * of different classes that implement that interface.
 *
 * Each object provides its own implementation of the interface method.
 * When the method is called, Java executes the implementation belonging
 * to the actual object's class.
 */
public class _15_PolymorphismWithInterfaces {

    static void main(String[] args) {

        // Both variables use interface reference types.
        Drawable birdDrawing = new Bird();
        Drawable airplaneDrawing = new Airplane();

        // Java calls the implementation belonging to each actual object.
        birdDrawing.draw();
        airplaneDrawing.draw();

        Flyable bird = new Bird();
        Flyable airplane = new Airplane();

        bird.fly();
        airplane.fly();
    }

    static class Bird implements Drawable, Flyable {

        @Override
        public void draw() {
            System.out.println("Drawing a bird.");
        }

        @Override
        public void fly() {
            System.out.println("Bird is flying.");
        }
    }

    static class Airplane implements Drawable, Flyable {

        @Override
        public void draw() {
            System.out.println("Drawing an airplane.");
        }

        @Override
        public void fly() {
            System.out.println("Airplane is flying.");
        }
    }
}