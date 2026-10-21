package _04_interfaces;

import _04_interfaces.interfaces.Drawable;

/*
 * INTERFACE REFERENCES
 *
 * An interface can be used as a reference type.
 *
 * A variable declared with an interface type can reference any object
 * whose class implements that interface.
 *
 * The reference can access only the methods declared by the interface,
 * even if the actual object has additional methods.
 */
public class _03_InterfaceReferences {

    static void main(String[] args) {

        // The reference type is Drawable; the actual object is Circle.
        Drawable drawable = new Circle();

        // Allowed because draw() is declared in Drawable.
        drawable.draw();

        // Not allowed through a Drawable reference:
        // drawable.calculateArea();
        //
        // calculateArea() belongs to Circle, not Drawable.
    }

    static class Circle implements Drawable {

        @Override
        public void draw() {
            System.out.println("Drawing a circle.");
        }

        public void calculateArea() {
            System.out.println("Calculating circle area.");
        }
    }
}