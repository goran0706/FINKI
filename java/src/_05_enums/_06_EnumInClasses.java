package _05_enums;

/*
 * ENUMS IN CLASSES
 *
 * An enum can be used as a field type inside a class.
 *
 * This allows an object to store one value from a predefined set
 * of options instead of using arbitrary strings.
 *
 * Here, each BankAccount has an AccountStatus.
 */
public class _06_EnumInClasses {

    static void main(String[] args) {

        BankAccount account = new BankAccount(
                "ACC-001",
                AccountStatus.ACTIVE
        );

        account.displayDetails();

        // Change the status to another valid enum constant.
        account.setStatus(AccountStatus.SUSPENDED);

        account.displayDetails();
    }

    enum AccountStatus {
        ACTIVE,
        INACTIVE,
        SUSPENDED,
        CLOSED
    }

    static class BankAccount {

        private final String accountNumber;
        private AccountStatus status;

        public BankAccount(String accountNumber, AccountStatus status) {
            this.accountNumber = accountNumber;
            this.status = status;
        }

        public String getAccountNumber() {
            return accountNumber;
        }

        public AccountStatus getStatus() {
            return status;
        }

        public void setStatus(AccountStatus status) {
            this.status = status;
        }

        public void displayDetails() {
            System.out.println("Account: " + accountNumber);
            System.out.println("Status: " + status);
        }
    }
}