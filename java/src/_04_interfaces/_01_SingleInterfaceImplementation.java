package _04_interfaces;

import _04_interfaces.interfaces.Drawable;

/*
 * SINGLE INTERFACE IMPLEMENTATION
 *
 * A class uses the "implements" keyword to implement an interface.
 *
 * The implementing class must provide an implementation for every
 * abstract method declared by the interface.
 *
 * Here, Circle implements Drawable and provides the draw() method.
 */
public class _01_SingleInterfaceImplementation {

    static void main(String[] args) {

        // Create an object of the class that implements Drawable.
        Circle circle = new Circle();

        // Call the method implemented by Circle.
        circle.draw();
    }

    static class Circle implements Drawable {

        @Override
        public void draw() {
            System.out.println("Drawing a circle.");
        }
    }
}