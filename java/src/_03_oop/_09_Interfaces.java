package _03_oop;

import _03_oop.entities.BankAccount;
import _03_oop.entities.Money;

import java.math.BigDecimal;

public class _09_Interfaces {

    static void main(String[] args) {
        BankAccount account = new BankAccount("ACC-001", new Money(new BigDecimal("1000.00"), "EUR"));

        // The interface reference exposes the methods defined by its contract.
        Transferable transferable = new BankTransfer(account);
        transferable.transfer(new Money(new BigDecimal("200.00"), "EUR"));

        // The same object can be referenced through another implemented interface.
        Auditable auditable = (Auditable) transferable;
        auditable.audit();

        System.out.println("Remaining balance: " + account.getBalance());
    }

    // An interface defines a contract: methods that implementing classes must provide.
    interface Transferable {
        void transfer(Money amount);
    }

    interface Auditable {
        void audit();
    }

    // A class can implement multiple interfaces.
    static class BankTransfer implements Transferable, Auditable {

        private final BankAccount sourceAccount;

        public BankTransfer(BankAccount sourceAccount) {
            this.sourceAccount = sourceAccount;
        }

        @Override
        public void transfer(Money amount) {
            sourceAccount.withdraw(amount);
            System.out.println("Transferred: " + amount);
        }

        @Override
        public void audit() {
            System.out.println("Auditing account: " + sourceAccount.getAccountNumber());
        }
    }
}