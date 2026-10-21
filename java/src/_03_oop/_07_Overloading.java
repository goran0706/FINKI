package _03_oop;

import _03_oop.entities.BankAccount;
import _03_oop.entities.Money;

import java.math.BigDecimal;

public class _07_Overloading {

    static void main(String[] args) {
        BankAccount account = new BankAccount(
                "ACC-001",
                new Money(new BigDecimal("1000.00"), "EUR")
        );

        // Method overloading means defining multiple methods with the same name
        // but different parameter lists.
        //
        // The compiler determines which method to call based on the arguments.

        // Deposit a Money object.
        deposit(account, new Money(new BigDecimal("100.00"), "EUR"));

        // Deposit an amount and currency using a different method signature.
        deposit(account, new BigDecimal("50.00"), "EUR");

        System.out.println("Balance: " + account.getBalance());
    }

    // First version: accepts a Money object.
    public static void deposit(BankAccount account, Money amount) {
        account.deposit(amount);
    }

    // Overloaded version: accepts an amount and currency separately.
    public static void deposit(
            BankAccount account,
            BigDecimal amount,
            String currency
    ) {
        account.deposit(new Money(amount, currency));
    }
}