package _05_enums;

/*
 * ENUM METHODS
 *
 * Enums can define methods, just like classes.
 *
 * These methods can use the enum's fields to provide behavior
 * associated with each constant.
 */
public class _03_EnumMethods {

    static void main(String[] args) {

        TransactionType type = TransactionType.TRANSFER;

        System.out.println(type.getDescription());
        System.out.println(
                "Requires destination account: "
                        + type.requiresDestinationAccount()
        );

        // Call the methods for every enum constant.
        for (TransactionType transactionType : TransactionType.values()) {
            System.out.println(
                    transactionType + ": "
                            + transactionType.getDescription()
            );
        }
    }

    enum TransactionType {
        DEPOSIT,
        WITHDRAWAL,
        TRANSFER;

        // Each constant can be handled by a method defined in the enum.
        public String getDescription() {
            switch (this) {
                case DEPOSIT:
                    return "Money deposited into an account.";
                case WITHDRAWAL:
                    return "Money withdrawn from an account.";
                case TRANSFER:
                    return "Money transferred between accounts.";
                default:
                    throw new IllegalStateException(
                            "Unexpected transaction type: " + this
                    );
            }
        }

        public boolean requiresDestinationAccount() {
            return this == TRANSFER;
        }
    }
}