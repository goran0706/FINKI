package _05_enums;

/*
 * ENUM IMPLEMENTING INTERFACES
 *
 * An enum can implement one or more interfaces.
 *
 * Each enum constant uses the behavior defined by the interface.
 * This allows enum constants to be used wherever the interface type
 * is expected.
 */
public class _09_EnumImplementingInterfaces {

    static void main(String[] args) {

        // Use an enum constant through the interface reference type.
        Describable transaction = TransactionType.DEPOSIT;

        System.out.println(transaction.getDescription());

        // Every enum constant provides its own implementation.
        for (TransactionType type : TransactionType.values()) {
            System.out.println(type + ": " + type.getDescription());
        }
    }

    enum TransactionType implements Describable {
        DEPOSIT {
            @Override
            public String getDescription() {
                return "Money deposited into an account.";
            }
        },
        WITHDRAWAL {
            @Override
            public String getDescription() {
                return "Money withdrawn from an account.";
            }
        },
        TRANSFER {
            @Override
            public String getDescription() {
                return "Money transferred between accounts.";
            }
        }
    }

    interface Describable {
        String getDescription();
    }
}