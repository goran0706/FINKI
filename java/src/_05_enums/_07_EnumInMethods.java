package _05_enums;

/*
 * ENUMS IN METHODS
 *
 * An enum can be used as a method's return type or as a local variable.
 *
 * This allows methods to return one of a fixed set of valid values
 * instead of arbitrary strings.
 */
public class _07_EnumInMethods {

    // The method returns a TransactionStatus enum constant.
    static TransactionStatus processTransaction(boolean successful) {
        if (successful) {
            return TransactionStatus.COMPLETED;
        }

        return TransactionStatus.FAILED;
    }

    static void main(String[] args) {

        TransactionStatus status = processTransaction(true);

        System.out.println("Transaction status: " + status);

        TransactionStatus failedStatus = processTransaction(false);

        System.out.println("Transaction status: " + failedStatus);
    }

    enum TransactionStatus {
        PENDING,
        COMPLETED,
        FAILED
    }
}