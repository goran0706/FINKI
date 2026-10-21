package _04_interfaces;

import _04_interfaces.interfaces.Auditable;
import _04_interfaces.interfaces.Identifiable;
import _04_interfaces.interfaces.Printable;

/*
 * INTERFACE COMPOSITION
 *
 * Interface composition combines small, focused interfaces to define
 * a class's capabilities.
 *
 * Instead of creating one large interface with unrelated methods,
 * separate contracts can describe individual responsibilities.
 *
 * A class can implement multiple interfaces and fulfill all their
 * contracts.
 */
public class _18_InterfaceComposition {

    static void main(String[] args) {

        BankAccount account = new BankAccount("ACC-001", 500.00);

        account.deposit(150.00);

        // Use the object through each interface contract.
        Identifiable identifiable = account;
        Auditable auditable = account;
        Printable printable = account;

        System.out.println(
                "Implements Identifiable: "
                        + (identifiable instanceof Identifiable)
        );

        auditable.audit();
        printable.print();
    }

    static class BankAccount implements Identifiable, Auditable, Printable {

        private final String accountNumber;
        private double balance;

        public BankAccount(String accountNumber, double balance) {
            this.accountNumber = accountNumber;
            this.balance = balance;
        }

        public void deposit(double amount) {
            if (amount <= 0) {
                System.out.println("Deposit amount must be positive.");
                return;
            }

            balance += amount;
        }

        @Override
        public void audit() {
            System.out.println("Auditing account: " + accountNumber);
        }

        @Override
        public void print() {
            System.out.println("Account: " + accountNumber);
            System.out.printf("Balance: %.2f%n", balance);
        }
    }
}