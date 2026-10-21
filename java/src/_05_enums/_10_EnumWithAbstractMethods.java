package _05_enums;

/*
 * ENUMS WITH ABSTRACT METHODS
 *
 * An enum can declare an abstract method that every enum constant
 * must implement.
 *
 * Each constant provides its own implementation, allowing different
 * constants to define different behavior.
 */
public class _10_EnumWithAbstractMethods {

    static void main(String[] args) {

        double balance = 500.00;
        double amount = 100.00;

        // Calls the DEPOSIT implementation.
        double afterDeposit =
                TransactionType.DEPOSIT.calculateBalance(balance, amount);

        System.out.println("After deposit: " + afterDeposit);

        // Calls the WITHDRAWAL implementation.
        double afterWithdrawal =
                TransactionType.WITHDRAWAL.calculateBalance(balance, amount);

        System.out.println("After withdrawal: " + afterWithdrawal);
    }

    enum TransactionType {

        DEPOSIT {
            @Override
            public double calculateBalance(double balance, double amount) {
                return balance + amount;
            }
        },

        WITHDRAWAL {
            @Override
            public double calculateBalance(double balance, double amount) {
                return balance - amount;
            }
        };

        // Every enum constant must implement this abstract method.
        public abstract double calculateBalance(double balance, double amount);
    }
}