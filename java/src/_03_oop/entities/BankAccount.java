package _03_oop.entities;

public class BankAccount {

    private final String accountNumber;
    private Money balance;

    public BankAccount(String accountNumber, Money initialBalance) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public Money getBalance() {
        return balance;
    }

    public void deposit(Money amount) {
        balance = balance.add(amount);
    }

    public void withdraw(Money amount) {
        if (balance.amount().compareTo(amount.amount()) < 0) {
            throw new IllegalArgumentException("Insufficient funds.");
        }

        balance = balance.subtract(amount);
    }

    @Override
    public String toString() {
        return "Account: " + accountNumber + ", Balance: " + balance;
    }
}