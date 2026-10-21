package _05_enums;

/*
 * ENUMS AS METHOD PARAMETERS
 *
 * An enum can be used as a method parameter type.
 *
 * This restricts callers to passing one of the enum's declared
 * constants, making invalid values harder to represent.
 */
public class _08_EnumAsMethodParameters {

    static void printAccountStatus(AccountStatus status) {
        System.out.println("Account status: " + status);
    }

    static boolean canWithdraw(AccountStatus status) {
        return status == AccountStatus.ACTIVE;
    }

    static void main(String[] args) {

        // Pass enum constants to methods.
        printAccountStatus(AccountStatus.ACTIVE);
        printAccountStatus(AccountStatus.SUSPENDED);

        System.out.println(
                "Can withdraw: " + canWithdraw(AccountStatus.ACTIVE)
        );

        System.out.println(
                "Can withdraw: " + canWithdraw(AccountStatus.CLOSED)
        );

        // A String cannot be passed directly where AccountStatus is required.
        // printAccountStatus("ACTIVE");
    }

    enum AccountStatus {
        ACTIVE,
        INACTIVE,
        SUSPENDED,
        CLOSED
    }
}