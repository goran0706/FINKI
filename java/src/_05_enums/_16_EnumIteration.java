package _05_enums;

/*
 * ENUM ITERATION
 *
 * Use values() to iterate through every constant declared in an enum.
 *
 * The returned array follows the order in which the constants
 * are declared.
 */
public class _16_EnumIteration {

    static void main(String[] args) {

        // Iterate using an enhanced for loop.
        for (AccountStatus status : AccountStatus.values()) {
            System.out.println(status);
        }

        // Iterate and access each constant's name and ordinal position.
        for (AccountStatus status : AccountStatus.values()) {
            System.out.println(
                    "Name: " + status.name()
                            + ", position: " + status.ordinal()
            );
        }

        // Use a regular for loop when the index is needed.
        AccountStatus[] statuses = AccountStatus.values();

        for (int i = 0; i < statuses.length; i++) {
            System.out.println(i + ": " + statuses[i]);
        }
    }

    enum AccountStatus {
        ACTIVE,
        INACTIVE,
        SUSPENDED,
        CLOSED
    }
}