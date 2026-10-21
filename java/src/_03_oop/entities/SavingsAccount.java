package _03_oop.entities;

public class SavingsAccount extends BankAccount {

    private final double interestRate;

    public SavingsAccount(String accountNumber, Money initialBalance, double interestRate) {
        super(accountNumber, initialBalance);
        this.interestRate = interestRate;
    }

    public double getInterestRate() {
        return interestRate;
    }

    public void applyInterest() {
        double interest = getBalance().amount().doubleValue() * interestRate / 100;

        Money interestAmount = new Money(
                java.math.BigDecimal.valueOf(interest),
                getBalance().currency()
        );

        deposit(interestAmount);
    }

    @Override
    public String toString() {
        return super.toString() + ", Interest Rate: " + interestRate + "%";
    }
}