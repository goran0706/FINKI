package _03_oop;

import _03_oop.entities.BankAccount;
import _03_oop.entities.CheckingAccount;
import _03_oop.entities.Money;

import java.math.BigDecimal;

public class _05_Polymorphism {

    static void main(String[] args) {
        // A parent-class reference can refer to an object of a child class.
        BankAccount account = new CheckingAccount(
                "ACC-001",
                new Money(new BigDecimal("1000.00"), "EUR"),
                500.0
        );

        // Polymorphism allows the overridden method of the actual object
        // (CheckingAccount) to execute through a BankAccount reference.
        account.withdraw(new Money(new BigDecimal("1200.00"), "EUR"));

        System.out.println("Account Number: " + account.getAccountNumber());
        System.out.println("Balance: " + account.getBalance());
    }
}