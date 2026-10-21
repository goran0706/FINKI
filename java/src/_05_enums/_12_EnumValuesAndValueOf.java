package _05_enums;

/*
 * ENUM VALUES AND VALUEOF
 *
 * Every enum automatically provides two static methods:
 *
 * values():
 *     Returns an array containing all enum constants in declaration order.
 *
 * valueOf(String name):
 *     Returns the enum constant whose name exactly matches the supplied
 *     string. Throws IllegalArgumentException if no matching constant exists.
 */
public class _12_EnumValuesAndValueOf {

    static void main(String[] args) {

        // values() returns all declared constants.
        AccountStatus[] statuses = AccountStatus.values();

        for (AccountStatus status : statuses) {
            System.out.println(status);
        }

        // valueOf() converts an exact constant name into an enum value.
        AccountStatus status = AccountStatus.valueOf("SUSPENDED");

        System.out.println("Selected status: " + status);

        // Names are case-sensitive.
        // AccountStatus.valueOf("active"); // Throws IllegalArgumentException.
    }

    enum AccountStatus {
        ACTIVE,
        INACTIVE,
        SUSPENDED,
        CLOSED
    }
}