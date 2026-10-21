package _10_optionals;

import java.util.Optional;

/*
 * OPTIONAL.OF()
 *
 * Optional.of(value) creates an Optional containing a non-null value.
 *
 * If the supplied value is null, Optional.of() immediately throws
 * NullPointerException.
 *
 * Use Optional.of() when the value is guaranteed to be non-null.
 *
 * Related methods:
 *
 * Optional.of(value)
 *     Creates an Optional containing a non-null value.
 *
 * Optional.ofNullable(value)
 *     Creates an Optional containing the value, or an empty Optional
 *     if the value is null.
 *
 * Optional.empty()
 *     Creates an empty Optional.
 */
public class _02_OptionalOf {

    static void main(String[] args) {

        /*
         * The account object is created before being passed to Optional.of().
         * Because it is non-null, the Optional is successfully created.
         */
        BankAccount account = new BankAccount("ACC-001", 1500.00);

        Optional<BankAccount> optionalAccount = Optional.of(account);

        System.out.println(optionalAccount.get().accountNumber());
        System.out.println(optionalAccount.get().balance());

        /*
         * Optional.of(null) throws NullPointerException.
         *
         * The following line compiles but throws an exception at runtime.
         */
        // Optional<BankAccount> invalidAccount = Optional.of(null);

        /*
         * Optional.of() does not check whether the object contains valid
         * business data. It only checks that the reference is not null.
         */
        BankAccount invalidBusinessAccount = new BankAccount("", -100.00);

        Optional<BankAccount> accountWithInvalidData =
                Optional.of(invalidBusinessAccount);

        System.out.println(accountWithInvalidData.isPresent());
    }

    record BankAccount(String accountNumber, double balance) {

    }
}