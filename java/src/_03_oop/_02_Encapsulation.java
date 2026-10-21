package _03_oop;

import _03_oop.entities.BankAccount;
import _03_oop.entities.Money;

import java.math.BigDecimal;

public class _02_Encapsulation {

    static void main(String[] args) {
        BankAccount account = new BankAccount("ACC-001", new Money(new BigDecimal("1000.00"), "EUR"));

        // Encapsulation means keeping an object's fields private and
        // controlling access to its internal state through public methods.
        //
        // BankAccount's accountNumber and balance fields are private.
        // We cannot access or modify them directly from this class.
        //
        // Instead, we interact with the object through its public methods.
        account.deposit(new Money(new BigDecimal("500.00"), "EUR"));
        account.withdraw(new Money(new BigDecimal("200.00"), "EUR"));

        // Getters provide controlled read access to private fields.
        System.out.println("Account Number: " + account.getAccountNumber());
        System.out.println("Balance: " + account.getBalance());

        // This would not compile because balance is private:
        // account.balance = new Money(new BigDecimal("0.00"), "EUR");
        //
        // The deposit() and withdraw() methods define how the balance
        // can change instead of allowing arbitrary direct modification.
    }
}