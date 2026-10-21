package _04_interfaces;

import _04_interfaces.interfaces.Identifiable;

/*
 * MARKER INTERFACES
 *
 * A marker interface is an interface with no methods or fields.
 *
 * It marks a class as belonging to a particular category.
 * Code can check whether an object implements the marker interface
 * using the "instanceof" operator.
 *
 * This example demonstrates the concept manually.
 * Java also has built-in marker interfaces, such as Serializable.
 */
public class _07_MarkerInterfaces {

    static void main(String[] args) {

        BankAccount account = new BankAccount("ACC-001");
        BankTransaction transaction = new BankTransaction(150.00);

        // BankAccount implements Identifiable, so this is true.
        System.out.println(account instanceof Identifiable); // true

        // BankTransaction does not implement Identifiable.
        System.out.println(transaction instanceof Identifiable); // false

        // Marker interfaces can be used to identify objects
        // that satisfy a particular classification.
        if (account instanceof Identifiable) {
            System.out.println("Account is identifiable.");
        }
    }

    record BankAccount(String accountNumber) implements Identifiable {

    }

    static class BankTransaction {

        private final double amount;

        public BankTransaction(double amount) {
            this.amount = amount;
        }
    }
}