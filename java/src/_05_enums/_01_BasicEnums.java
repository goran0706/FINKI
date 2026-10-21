package _05_enums;

/*
 * BASIC ENUMS
 *
 * An enum defines a fixed set of named constants.
 *
 * Use enums when a variable should represent one value from a
 * predefined set of options.
 *
 * Here, AccountStatus represents the possible states of a bank account.
 */
public class _01_BasicEnums {

    static void main(String[] args) {

        // Assign an enum constant to a variable.
        AccountStatus status = AccountStatus.ACTIVE;

        System.out.println("Account status: " + status);

        // Compare enum constants using ==.
        if (status == AccountStatus.ACTIVE) {
            System.out.println("The account is active.");
        }

        // Iterate through all constants declared in the enum.
        for (AccountStatus accountStatus : AccountStatus.values()) {
            System.out.println(accountStatus);
        }

        // Convert a matching String into an enum constant.
        AccountStatus parsedStatus = AccountStatus.valueOf("SUSPENDED");

        System.out.println("Parsed status: " + parsedStatus);
    }

    enum AccountStatus {
        ACTIVE,
        INACTIVE,
        SUSPENDED,
        CLOSED
    }
}