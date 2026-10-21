package _03_oop.entities;

public class CheckingAccount extends BankAccount {

    private final double overdraftLimit;

    public CheckingAccount(
            String accountNumber,
            Money initialBalance,
            double overdraftLimit
    ) {
        super(accountNumber, initialBalance);
        this.overdraftLimit = overdraftLimit;
    }

    public double getOverdraftLimit() {
        return overdraftLimit;
    }

    @Override
    public void withdraw(Money amount) {
        double availableBalance =
                getBalance().amount().doubleValue() + overdraftLimit;

        if (availableBalance < amount.amount().doubleValue()) {
            throw new IllegalArgumentException("Overdraft limit exceeded.");
        }

        Money newBalance = getBalance().subtract(amount);

        if (newBalance.amount().doubleValue() < -overdraftLimit) {
            throw new IllegalArgumentException("Overdraft limit exceeded.");
        }

        // Use the inherited withdrawal method when sufficient funds are available.
        if (getBalance().amount().compareTo(amount.amount()) >= 0) {
            super.withdraw(amount);
        } else {
            // The base class does not support negative balances,
            // so overdraft handling will require a change to BankAccount.
            throw new UnsupportedOperationException(
                    "Update BankAccount to support overdrafts."
            );
        }
    }
}