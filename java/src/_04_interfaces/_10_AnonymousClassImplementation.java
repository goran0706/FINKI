package _04_interfaces;

import _04_interfaces.interfaces.Drawable;

/*
 * ANONYMOUS CLASS IMPLEMENTATION
 *
 * An anonymous class is a class without a declared name.
 *
 * It can implement an interface and provide implementations for its
 * abstract methods at the point where an object is created.
 *
 * This is useful when an implementation is needed only once and does
 * not need its own reusable named class.
 */
public class _10_AnonymousClassImplementation {

    static void main(String[] args) {

        // Create an object of an anonymous class implementing Drawable.
        Drawable drawable = new Drawable() {

            @Override
            public void draw() {
                System.out.println("Drawing a rectangle.");
            }
        };

        // Call the method implemented by the anonymous class.
        drawable.draw();
    }
}