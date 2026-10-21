package _03_oop;

import _03_oop.entities.Money;
import _03_oop.entities.SavingsAccount;

import java.math.BigDecimal;

public class _08_Overriding {

    static void main(String[] args) {
        SavingsAccount account = new SavingsAccount(
                "ACC-001",
                new Money(new BigDecimal("1000.00"), "EUR"),
                5.0
        );

        // Method overriding occurs when a subclass provides its own
        // implementation of a method inherited from its parent class.
        //
        // SavingsAccount overrides toString() from BankAccount.
        // Java calls the overridden version belonging to SavingsAccount.
        System.out.println(account);
    }
}