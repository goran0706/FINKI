package _04_interfaces;

import _04_interfaces.interfaces.Auditable;

/*
 * DEFAULT METHODS
 *
 * An interface can define a default method using the "default" keyword.
 *
 * Unlike an abstract interface method, a default method has a body.
 * Implementing classes inherit that implementation without needing
 * to override it.
 *
 * A class can override a default method to provide different behavior.
 */
public class _04_DefaultMethods {

    static void main(String[] args) {

        BankAccount bankAccount = new BankAccount("ACC-001");
        bankAccount.displayAccountNumber();
        bankAccount.audit();

        SavingsAccount savingsAccount = new SavingsAccount();

        // Uses the default implementation provided by Auditable.
        savingsAccount.audit();
    }

    static class BankAccount implements Auditable {

        private final String accountNumber;

        public BankAccount(String accountNumber) {
            this.accountNumber = accountNumber;
        }

        public void displayAccountNumber() {
            System.out.println("Account number: " + accountNumber);
        }

        // Override the inherited default method.
        @Override
        public void audit() {
            System.out.println("Auditing account: " + accountNumber);
        }
    }

    static class SavingsAccount implements Auditable {
        // No override: inherits the default audit() implementation.
    }
}