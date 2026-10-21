package _05_enums;

import java.util.EnumMap;
import java.util.Map;

/*
 * ENUMMAP
 *
 * EnumMap is a Map implementation whose keys belong to a single enum type.
 *
 * It is designed specifically for enum keys and stores entries in
 * the enum's declaration order.
 *
 * Unlike a regular HashMap, EnumMap requires the key type to be an enum.
 */
public class _15_EnumMap {

    static void main(String[] args) {

        // Create a map associating each transaction type with a description.
        EnumMap<TransactionType, String> descriptions =
                new EnumMap<>(TransactionType.class);

        descriptions.put(TransactionType.DEPOSIT, "Money added to an account.");
        descriptions.put(TransactionType.WITHDRAWAL, "Money removed from an account.");
        descriptions.put(TransactionType.TRANSFER, "Money moved between accounts.");

        // Retrieve a value using an enum constant as the key.
        System.out.println(descriptions.get(TransactionType.DEPOSIT));

        // Check whether a key exists.
        System.out.println(
                descriptions.containsKey(TransactionType.TRANSFER)
        );

        // Iterate over entries in enum declaration order.
        for (Map.Entry<TransactionType, String> entry : descriptions.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }

    enum TransactionType {
        DEPOSIT,
        WITHDRAWAL,
        TRANSFER
    }
}