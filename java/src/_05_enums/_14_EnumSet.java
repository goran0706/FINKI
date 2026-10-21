package _05_enums;

import java.util.EnumSet;
import java.util.Set;

/*
 * ENUMSET
 *
 * EnumSet is a specialized Set implementation designed specifically
 * for enum constants.
 *
 * It provides an efficient way to store and manipulate collections
 * of values belonging to the same enum type.
 *
 * EnumSet cannot contain null and preserves enum declaration order.
 */
public class _14_EnumSet {

    static void main(String[] args) {

        // Create an EnumSet containing selected permissions.
        Set<Permission> permissions = EnumSet.of(
                Permission.VIEW_ACCOUNT,
                Permission.DEPOSIT,
                Permission.WITHDRAW
        );

        System.out.println("Permissions: " + permissions);

        // Check whether a permission exists in the set.
        System.out.println(
                "Can deposit: " + permissions.contains(Permission.DEPOSIT)
        );

        // Add another permission.
        permissions.add(Permission.TRANSFER);

        // Remove a permission.
        permissions.remove(Permission.WITHDRAW);

        System.out.println("Updated permissions: " + permissions);

        // Create an EnumSet containing every permission.
        EnumSet<Permission> allPermissions =
                EnumSet.allOf(Permission.class);

        System.out.println("All permissions: " + allPermissions);

        // Create an EnumSet containing every permission except the selected
        // ones. This demonstrates set complement operations.
        EnumSet<Permission> otherPermissions =
                EnumSet.complementOf(EnumSet.of(Permission.VIEW_ACCOUNT));

        System.out.println("Other permissions: " + otherPermissions);
    }

    enum Permission {
        VIEW_ACCOUNT,
        DEPOSIT,
        WITHDRAW,
        TRANSFER,
        CLOSE_ACCOUNT
    }
}