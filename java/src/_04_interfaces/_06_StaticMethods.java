package _04_interfaces;

/*
 * STATIC METHODS IN INTERFACES
 *
 * An interface can declare static methods with an implementation.
 *
 * Static interface methods:
 * - Belong to the interface itself, not to implementing objects.
 * - Are called using the interface name.
 * - Are not inherited as callable static methods by implementing classes.
 */
public class _06_StaticMethods {

    static void main(String[] args) {

        BankAccount validAccount = new BankAccount("ACC-123");
        BankAccount invalidAccount = new BankAccount("INVALID");

        System.out.println(validAccount.isValid());   // true
        System.out.println(invalidAccount.isValid()); // false

        // Correct: call a static interface method using its interface.
        System.out.println(
                AccountValidator.isValidAccountNumber("ACC-456")
        );

        // Not allowed: static interface methods are not called
        // through an implementing class or an implementing object.
        // BankAccount.isValidAccountNumber("ACC-456");
    }

    interface AccountValidator {

        static boolean isValidAccountNumber(String accountNumber) {
            return accountNumber != null
                    && accountNumber.matches("ACC-\\d{3}");
        }
    }

    static class BankAccount {

        private final String accountNumber;

        public BankAccount(String accountNumber) {
            this.accountNumber = accountNumber;
        }

        public boolean isValid() {
            // Call the static method through the interface name.
            return AccountValidator.isValidAccountNumber(accountNumber);
        }
    }
}