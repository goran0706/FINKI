package _04_interfaces;

import _04_interfaces.interfaces.Printable;

/*
 * FUNCTIONAL INTERFACES
 *
 * A functional interface has exactly one abstract method.
 *
 * It can be implemented using:
 * - A regular class.
 * - An anonymous class.
 * - A lambda expression.
 *
 * @FunctionalInterface tells the compiler to verify that the interface
 * has exactly one abstract method. If additional abstract methods are
 * added, compilation fails.
 */
public class _08_FunctionalInterfaces {

    static void main(String[] args) {

        // Implementation using a regular class.
        Printable statement = new AccountStatement();
        statement.print();

        // Implementation using a lambda expression.
        // The code before -> represents the method's parameters.
        // The code after -> represents the method's implementation.
        Printable receipt = () ->
                System.out.println("Printing transaction receipt.");

        receipt.print();
    }

    static class AccountStatement implements Printable {

        @Override
        public void print() {
            System.out.println("Printing account statement.");
        }
    }
}