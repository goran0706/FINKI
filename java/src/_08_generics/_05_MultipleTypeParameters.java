package _08_generics;

/*
 * MULTIPLE TYPE PARAMETERS
 *
 * A generic class can declare multiple type parameters.
 *
 * Each type parameter represents a separate type.
 *
 * Conventionally:
 * - T represents a general type.
 * - K represents a key type.
 * - V represents a value type.
 *
 * These letters are conventions, not Java keywords.
 */
public class _05_MultipleTypeParameters {

    static void main(String[] args) {

        // K is String; V is Integer.
        Entry<String, Integer> account = new Entry<>("ACC-001", 1001);

        System.out.println("Account number: " + account.key());
        System.out.println("Account ID: " + account.value());

        // K is Integer; V is String.
        Entry<Integer, String> transaction = new Entry<>(5001, "COMPLETED");

        System.out.println("Transaction ID: " + transaction.key());
        System.out.println("Transaction status: " + transaction.value());
    }

    record Entry<K, V>(K key, V value) {

    }
}