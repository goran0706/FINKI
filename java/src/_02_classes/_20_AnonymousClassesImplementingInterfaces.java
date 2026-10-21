package _02_classes;

import _02_classes.interfaces.Soundable;

/*
 * An anonymous class can implement an interface without declaring a
 * separate named implementation class.
 *
 * The interface defines a contract; the anonymous class provides its
 * implementation at the point where the object is created.
 */
public class _20_AnonymousClassesImplementingInterfaces {

    static void main(String[] args) {
        Soundable soundable = new Soundable() {
            @Override
            public void makeSound() {
                System.out.println("The object makes a sound.");
            }
        };

        soundable.makeSound();
    }
}
