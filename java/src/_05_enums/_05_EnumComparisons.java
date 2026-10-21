package _05_enums;

/*
 * ENUM COMPARISONS
 *
 * Enum constants are singleton instances of their enum type.
 *
 * Use == to compare enum constants. It checks whether both references
 * point to the same constant.
 *
 * equals() also works, but == is the conventional choice for enums.
 *
 * Enum constants can also be compared using compareTo(), which follows
 * their declaration order.
 */
public class _05_EnumComparisons {

    static void main(String[] args) {

        AccountStatus first = AccountStatus.ACTIVE;
        AccountStatus second = AccountStatus.ACTIVE;
        AccountStatus third = AccountStatus.SUSPENDED;

        // Compare whether both variables refer to the same enum constant.
        System.out.println(first == second); // true
        System.out.println(first == third);  // false

        // equals() also compares enum identity.
        System.out.println(first.equals(second)); // true

        // compareTo() compares declaration order.
        System.out.println(
                AccountStatus.ACTIVE.compareTo(AccountStatus.SUSPENDED)
        ); // Negative value because ACTIVE comes before SUSPENDED.

        System.out.println(
                AccountStatus.CLOSED.compareTo(AccountStatus.ACTIVE)
        ); // Positive value because CLOSED comes after ACTIVE.
    }

    enum AccountStatus {
        ACTIVE,
        INACTIVE,
        SUSPENDED,
        CLOSED
    }
}