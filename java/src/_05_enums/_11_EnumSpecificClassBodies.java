package _05_enums;

/*
 * ENUM CONSTANT-SPECIFIC CLASS BODIES
 *
 * An enum constant can have its own class body that overrides methods
 * declared in the enum.
 *
 * When at least one constant has a class body, that constant is
 * represented by an anonymous subclass of the enum type.
 *
 * This is useful when constants need different behavior without
 * requiring a switch statement.
 */
public class _11_EnumSpecificClassBodies {

    static void main(String[] args) {

        for (TransactionStatus status : TransactionStatus.values()) {
            System.out.println(status + ": " + status.getDescription());
        }
    }

    enum TransactionStatus {

        PENDING {
            @Override
            public String getDescription() {
                return "Transaction is waiting to be processed.";
            }
        },

        COMPLETED {
            @Override
            public String getDescription() {
                return "Transaction completed successfully.";
            }
        },

        FAILED {
            @Override
            public String getDescription() {
                return "Transaction failed.";
            }
        };

        // Each constant provides its own implementation.
        public abstract String getDescription();
    }
}