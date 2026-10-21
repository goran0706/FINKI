package _05_enums;

/*
 * ENUM FIELDS AND CONSTRUCTORS
 *
 * Enums can have fields and constructors, just like classes.
 *
 * Each enum constant can pass arguments to the enum constructor.
 *
 * Enum constructors cannot be public or protected. They are typically
 * private, and Java prevents creating enum instances with "new".
 */
public class _02_EnumFieldsAndConstructors {

    static void main(String[] args) {

        AccountType accountType = AccountType.SAVINGS;

        System.out.println("Type: " + accountType);
        System.out.println("Description: " + accountType.getDescription());
        System.out.println(
                "Annual interest rate: "
                        + accountType.getAnnualInterestRate()
        );

        // Each constant has its own initialized field values.
        for (AccountType type : AccountType.values()) {
            System.out.println(
                    type + ": " + type.getDescription()
                            + ", interest rate: "
                            + type.getAnnualInterestRate()
            );
        }
    }

    enum AccountType {
        CHECKING("Checking Account", 0.01),
        SAVINGS("Savings Account", 0.035),
        BUSINESS("Business Account", 0.02);

        private final String description;
        private final double annualInterestRate;

        // The constructor initializes each enum constant's fields.
        AccountType(String description, double annualInterestRate) {
            this.description = description;
            this.annualInterestRate = annualInterestRate;
        }

        public String getDescription() {
            return description;
        }

        public double getAnnualInterestRate() {
            return annualInterestRate;
        }
    }
}