package _04_interfaces;

import java.time.LocalDateTime;

/*
 * PRIVATE METHODS IN INTERFACES
 *
 * Since Java 9, interfaces can declare private methods.
 *
 * Private interface methods:
 * - Have a method body.
 * - Can be called only from other methods inside the same interface.
 * - Cannot be called directly by implementing classes.
 * - Help share implementation logic between default or static methods.
 */
public class _05_PrivateMethods {

    static void main(String[] args) {

        BankAccount account = new BankAccount();

        // Calls the inherited default method, which internally calls
        // the private formatMessage() method.
        account.log("Bank account accessed.");

        // Not allowed: private interface methods are inaccessible here.
        // account.formatMessage("This will not compile.");
    }

    interface Loggable {

        // Default methods can call private methods inside the interface.
        default void log(String message) {
            System.out.println(formatMessage(message));
        }

        // Private method shared internally by interface methods.
        private String formatMessage(String message) {
            return "[" + LocalDateTime.now() + "] " + message;
        }
    }

    static class BankAccount implements Loggable {
        // Inherits log() without implementing it.
    }
}