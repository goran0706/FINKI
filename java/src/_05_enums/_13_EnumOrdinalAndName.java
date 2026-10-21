package _05_enums;

/*
 * ENUM ORDINAL AND NAME
 *
 * Every enum inherits these methods:
 *
 * name():
 *     Returns the exact name of the enum constant as declared.
 *
 * ordinal():
 *     Returns the constant's zero-based position in its declaration.
 *
 * Avoid using ordinal() to represent business values or persist enum
 * positions. Reordering constants changes their ordinal values.
 */
public class _13_EnumOrdinalAndName {

    static void main(String[] args) {

        AccountStatus status = AccountStatus.SUSPENDED;

        // name() returns the declared constant name.
        System.out.println("Name: " + status.name());

        // ordinal() returns the zero-based declaration position.
        System.out.println("Ordinal: " + status.ordinal());

        // Display the name and ordinal of every constant.
        for (AccountStatus accountStatus : AccountStatus.values()) {
            System.out.println(
                    accountStatus.name() + " -> " + accountStatus.ordinal()
            );
        }
    }

    enum AccountStatus {
        ACTIVE,
        INACTIVE,
        SUSPENDED,
        CLOSED
    }
}