package _04_interfaces;

import _04_interfaces.interfaces.Printable;

/*
 * LAMBDA IMPLEMENTATION
 *
 * A lambda expression provides a concise implementation of a functional
 * interface: an interface with exactly one abstract method.
 *
 * Syntax:
 *     (parameters) -> expression
 *     (parameters) -> { statements; }
 *
 * The compiler determines which interface method the lambda implements
 * from the type of the variable receiving it.
 */
public class _11_LambdaImplementation {

    static void main(String[] args) {

        // Implement Printable's single abstract method, print().
        Printable statement = () ->
                System.out.println("Printing bank statement.");

        statement.print();

        // A block body can contain multiple statements.
        Printable receipt = () -> {
            System.out.println("Preparing transaction receipt.");
            System.out.println("Printing transaction receipt.");
        };

        receipt.print();
    }
}