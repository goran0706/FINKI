package _03_oop;

import _03_oop.entities.BankAccount;
import _03_oop.entities.Money;

import java.math.BigDecimal;

public class _03_Abstraction {

    static void main(String[] args) {
        BankAccount account = new BankAccount(
                "ACC-001",
                new Money(new BigDecimal("1000.00"), "EUR")
        );

        // Abstraction means exposing essential functionality while hiding
        // the internal implementation details.
        //
        // We can deposit and withdraw money without knowing how BankAccount
        // implements these operations or manages its internal balance.
        account.deposit(new Money(new BigDecimal("500.00"), "EUR"));
        account.withdraw(new Money(new BigDecimal("200.00"), "EUR"));

        // We interact with the account through its public methods.
        System.out.println("Balance: " + account.getBalance());
    }
}