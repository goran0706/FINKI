package _04_interfaces;

/*
 * INTERFACE CONSTANTS
 *
 * Fields declared in an interface are implicitly:
 * - public
 * - static
 * - final
 *
 * Therefore, interface fields are constants shared by all code that
 * accesses the interface.
 *
 * They must be initialized when declared and cannot be reassigned.
 */
public class _13_InterfaceConstants {

    static void main(String[] args) {

        BankAccount account = new BankAccount();

        System.out.println(account.canTransfer(500.00));    // true
        System.out.println(account.canTransfer(15_000.00)); // false

        System.out.println(BankingLimits.MAX_TRANSFER);
        System.out.println(BankingLimits.MAX_DAILY_TRANSFERS);

        // Not allowed: interface constants are final.
        // BankingLimits.MAX_TRANSFER = 20_000.00;
    }

    interface BankingLimits {

        // Equivalent to: public static final double MAX_TRANSFER = 10_000.00;
        double MAX_TRANSFER = 10_000.00;

        // Equivalent to: public static final int MAX_DAILY_TRANSFERS = 20;
        int MAX_DAILY_TRANSFERS = 20;
    }

    static class BankAccount {

        public boolean canTransfer(double amount) {
            // Access the constant through the interface name.
            return amount > 0 && amount <= BankingLimits.MAX_TRANSFER;
        }
    }
}