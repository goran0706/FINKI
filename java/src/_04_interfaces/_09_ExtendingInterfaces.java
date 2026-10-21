package _04_interfaces;

import _04_interfaces.interfaces.Writable;

/*
 * EXTENDING INTERFACES
 *
 * An interface can extend another interface using the "extends" keyword.
 *
 * A child interface inherits the abstract method declarations of its
 * parent interface and can declare additional methods.
 *
 * A class implementing the child interface must implement all inherited
 * abstract methods and any additional abstract methods.
 *
 * In this example, Writable extends Readable and Printable.
 * Therefore, a class implementing Writable must implement read(),
 * write(), and print().
 */
public class _09_ExtendingInterfaces {

    static void main(String[] args) {

        BankStatement statement = new BankStatement();

        statement.read();
        statement.write();
        statement.print();
    }

    static class BankStatement implements Writable {

        @Override
        public void read() {
            System.out.println("Reading bank statement.");
        }

        @Override
        public void write() {
            System.out.println("Writing bank statement.");
        }

        @Override
        public void print() {
            System.out.println("Printing bank statement.");
        }
    }
}