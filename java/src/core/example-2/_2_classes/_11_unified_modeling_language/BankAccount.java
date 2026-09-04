package _2_classes._11_unified_modeling_language;

/*
    Unified Modeling Language (UML)
    UML class diagrams help us organize and describe classes

    - owner:String
    - balance:String
    --------------------------
    + BankAccount(owner:String)
    + BankAccount(owner:String, balance:double)
    + getOwner():String
    + getBalance():double
    + deposit():void
    + withdraw():void
    --------------------------
*/

public class BankAccount {
    private final String owner;
    private double balance;

    public BankAccount(String owner) {
        this.owner = owner;
        this.balance = 0;
    }

    public BankAccount(String owner, double balance) {
        this.owner = owner;
        this.balance = balance;
    }

    public String getOwner() {
        return owner;
    }

    public double getBalance() {
        return balance;
    }

    public void deposit(double amount) {
        if (amount <= 0) {
            System.out.println("Amount cannot be 0 or less");
        }

        this.balance += amount;
    }

    public void withdraw(double amount) {
        if (amount <= 0) {
            System.out.println("Amount cannot be 0 or less");
        }

        if (amount > this.balance) {
            System.out.println("Not enough balance");
        }

        this.balance -= amount;
    }
}
