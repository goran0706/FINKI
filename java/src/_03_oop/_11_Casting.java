package _03_oop;

import _03_oop.entities.BankAccount;
import _03_oop.entities.Money;
import _03_oop.entities.SavingsAccount;

import java.math.BigDecimal;

public class _11_Casting {

    static void main(String[] args) {

        // UPCASTING: assigning a subclass object to a superclass reference.
        // This happens implicitly because SavingsAccount extends BankAccount.
        SavingsAccount savingsAccount = new SavingsAccount("ACC-001", new Money(new BigDecimal("1000.00"), "EUR"), 5.0);

        BankAccount bankAccount = savingsAccount;

        // DOWNCASTING: converting a superclass reference back to a subclass type.
        // An explicit cast is required.
        SavingsAccount convertedAccount = (SavingsAccount) bankAccount;

        System.out.println(convertedAccount.getInterestRate());

        // instanceof checks whether the object is compatible with the specified type.
        if (bankAccount instanceof SavingsAccount checkedAccount) {
            System.out.println(checkedAccount.getBalance());
        }

        // Unsafe downcasting causes ClassCastException at runtime.
        BankAccount anotherAccount = new BankAccount("ACC-002", new Money(new BigDecimal("500.00"), "EUR"));

        // SavingsAccount invalidAccount = (SavingsAccount) anotherAccount;
    }
}