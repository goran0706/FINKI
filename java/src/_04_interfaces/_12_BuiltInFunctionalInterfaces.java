package _04_interfaces;

import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;

/*
 * BUILT-IN FUNCTIONAL INTERFACES
 *
 * Java provides functional interfaces in java.util.function.
 * They represent common operations and can be implemented with lambdas.
 *
 * Predicate<T>:
 *     Accepts a value and returns a boolean.
 *
 * Function<T, R>:
 *     Accepts a value of type T and returns a value of type R.
 *
 * Consumer<T>:
 *     Accepts a value and performs an operation without returning a result.
 *
 * Supplier<T>:
 *     Supplies a value without accepting an argument.
 */
public class _12_BuiltInFunctionalInterfaces {

    static void main(String[] args) {

        // Predicate: checks whether the account balance is positive.
        Predicate<Double> hasPositiveBalance =
                balance -> balance > 0;

        System.out.println(hasPositiveBalance.test(250.00)); // true
        System.out.println(hasPositiveBalance.test(0.00));   // false

        // Function: converts a balance into a formatted String.
        Function<Double, String> formatBalance =
                balance -> String.format("%.2f EUR", balance);

        System.out.println(formatBalance.apply(250.50)); // 250.50 EUR

        // Consumer: accepts and prints a transaction description.
        Consumer<String> printTransaction =
                description -> System.out.println(description);

        printTransaction.accept("Transfer completed.");

        // Supplier: provides an initial account balance.
        Supplier<Double> initialBalance =
                () -> 100.00;

        System.out.println(initialBalance.get()); // 100.0
    }
}