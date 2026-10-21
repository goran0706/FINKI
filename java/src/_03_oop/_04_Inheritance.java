package _03_oop;

import _03_oop.entities.Money;
import _03_oop.entities.SavingsAccount;

import java.math.BigDecimal;

public class _04_Inheritance {

    static void main(String[] args) {
        SavingsAccount account = new SavingsAccount("ACC-001", new Money(new BigDecimal("1000.00"), "EUR"), 5.0);

        // Inheritance or Subclassing
        // Java supports only single inheritance

        // Inheritance allows a class to acquire fields and methods
        // from another class.
        //
        // SavingsAccount extends BankAccount, so it inherits methods
        // such as deposit(), withdraw(), getBalance(), and getAccountNumber().
        account.deposit(new Money(new BigDecimal("200.00"), "EUR"));
        account.withdraw(new Money(new BigDecimal("100.00"), "EUR"));

        // SavingsAccount also defines its own behavior: applyInterest().
        account.applyInterest();

        System.out.println("Account Number: " + account.getAccountNumber());
        System.out.println("Balance: " + account.getBalance());
        System.out.println("Interest Rate: " + account.getInterestRate() + "%");
    }
}