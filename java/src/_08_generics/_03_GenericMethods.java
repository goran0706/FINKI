package _08_generics;

/*
 * GENERIC METHODS
 *
 * A generic method declares its own type parameter before its return type.
 *
 * Syntax:
 *     public static <T> T methodName(T value)
 *
 * The type parameter belongs to the method, not to the surrounding class.
 * Java can often infer the type from the supplied arguments.
 */
public class _03_GenericMethods {

    // Accepts a value of any reference type and returns the same value.
    public static <T> T getValue(T value) {
        return value;
    }

    // Accepts and prints an array containing elements of type T.
    public static <T> void printValues(T[] values) {
        for (T value : values) {
            System.out.println(value);
        }
    }

    static void main(String[] args) {

        // Java infers T as String.
        String name = getValue("Account holder");
        System.out.println(name);

        // Java infers T as Integer.
        Integer accountNumber = getValue(12345);
        System.out.println(accountNumber);

        // Java infers T as Double.
        Double balance = getValue(250.75);
        System.out.println(balance);

        // The method works with arrays of different element types.
        String[] accountTypes = {"Checking", "Savings", "Business"};
        printValues(accountTypes);

        Integer[] transactionIds = {101, 102, 103};
        printValues(transactionIds);
    }
}