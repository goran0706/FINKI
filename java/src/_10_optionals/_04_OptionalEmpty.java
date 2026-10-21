package _10_optionals;

import java.util.Optional;

/*
 * OPTIONAL.EMPTY()
 *
 * Optional.empty() creates an Optional that contains no value.
 *
 * Use it when a value is unavailable or when a lookup produces no result.
 *
 * Unlike Optional.of(null), Optional.empty() does not throw
 * NullPointerException.
 *
 * An empty Optional is useful when absence is an expected outcome,
 * rather than an exceptional failure.
 */
public class _04_OptionalEmpty {

    /*
     * Returns an account when one is found.
     * Returns Optional.empty() when no matching account exists.
     */
    public static Optional<BankAccount> findAccount(String accountNumber) {

        if ("ACC-001".equals(accountNumber)) {
            return Optional.of(new BankAccount("ACC-001", 1500.00));
        }

        return Optional.empty();
    }

    static void main(String[] args) {

        Optional<BankAccount> existingAccount = findAccount("ACC-001");

        System.out.println(
                "Existing account present: " + existingAccount.isPresent()
        );

        Optional<BankAccount> missingAccount = findAccount("ACC-999");

        System.out.println(
                "Missing account present: " + missingAccount.isPresent()
        );

        System.out.println(
                "Missing account empty: " + missingAccount.isEmpty()
        );

        /*
         * Optional.empty() can also be used when a method cannot provide
         * a result, provided that absence is a normal, expected outcome.
         */
        Optional<String> noName = Optional.empty();

        System.out.println("Name present: " + noName.isPresent());

        /*
         * Do not use Optional.empty() to hide unexpected failures.
         * Database outages, permission failures, and other exceptional
         * conditions should be handled according to their actual meaning.
         */
    }

    record BankAccount(String accountNumber, double balance) {

    }
}