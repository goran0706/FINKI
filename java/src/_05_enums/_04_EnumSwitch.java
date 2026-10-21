package _05_enums;

/*
 * ENUMS WITH SWITCH
 *
 * A switch statement can select behavior based on an enum constant.
 *
 * This example uses the traditional switch statement with case labels
 * and break statements.
 *
 * Each case handles one possible transaction status.
 */
public class _04_EnumSwitch {

    static void main(String[] args) {

        TransactionStatus status = TransactionStatus.PROCESSING;

        switch (status) {
            case PENDING:
                System.out.println("Transaction is waiting to be processed.");
                break;

            case PROCESSING:
                System.out.println("Transaction is being processed.");
                break;

            case COMPLETED:
                System.out.println("Transaction completed successfully.");
                break;

            case FAILED:
                System.out.println("Transaction failed.");
                break;
        }

        // Switch expressions, available since Java 14, can return a value.
        String message = switch (status) {
            case PENDING -> "Waiting";
            case PROCESSING -> "In progress";
            case COMPLETED -> "Successful";
            case FAILED -> "Unsuccessful";
        };

        System.out.println(message);
    }

    enum TransactionStatus {
        PENDING,
        PROCESSING,
        COMPLETED,
        FAILED
    }
}