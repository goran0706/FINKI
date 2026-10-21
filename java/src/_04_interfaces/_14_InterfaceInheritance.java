package _04_interfaces;

import _04_interfaces.interfaces.Drawable;
import _04_interfaces.interfaces.Flyable;

/*
 * INTERFACE INHERITANCE
 *
 * An interface can extend multiple interfaces.
 *
 * The child interface inherits the method contracts of all its parent
 * interfaces. A class implementing the child interface must implement
 * all inherited abstract methods.
 *
 * Here, FlyingDrawable combines Drawable and Flyable into one interface.
 */
public class _14_InterfaceInheritance {

    static void main(String[] args) {

        FlyingObject object = new FlyingObject();

        object.draw();
        object.fly();
    }

    interface FlyingDrawable extends Drawable, Flyable {
        // Inherits draw() and fly() from its parent interfaces.
    }

    static class FlyingObject implements FlyingDrawable {

        @Override
        public void draw() {
            System.out.println("Drawing a flying object.");
        }

        @Override
        public void fly() {
            System.out.println("Object is flying.");
        }
    }
}