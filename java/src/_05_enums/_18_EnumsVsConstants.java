package _05_enums;

/*
 * ENUMS VS CONSTANTS
 *
 * Enums represent a fixed set of related values with a dedicated type.
 *
 * Traditional constants are often declared using public static final
 * fields. String or numeric constants do not restrict a variable to
 * a predefined set of valid values.
 *
 * Prefer enums when a value must be one of several known options.
 * Use static final constants for individual fixed values, such as limits.
 */
public class _18_EnumsVsConstants {

    // Traditional constants: these values are not a dedicated enum type.
    static final String STATUS_ACTIVE = "ACTIVE";
    static final String STATUS_SUSPENDED = "SUSPENDED";

    static void main(String[] args) {

        String statusText = STATUS_ACTIVE;

        // Strings can contain values that are not recognized statuses.
        statusText = "UNKNOWN";
        System.out.println("String status: " + statusText);

        AccountStatus status = AccountStatus.ACTIVE;

        // Only AccountStatus constants can be assigned to this variable.
        // status = "UNKNOWN"; // Compilation error.

        System.out.println("Enum status: " + status);

        // Use static final constants for individual fixed values.
        final double MAX_TRANSFER_AMOUNT = 10_000.00;

        System.out.println("Maximum transfer: " + MAX_TRANSFER_AMOUNT);
    }

    // An enum restricts the value to one of its declared constants.
    enum AccountStatus {
        ACTIVE,
        SUSPENDED,
        CLOSED
    }
}