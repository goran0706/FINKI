package _08_generics;

/*
 * TYPE PARAMETER NAMING CONVENTIONS
 *
 * Java does not require specific names for generic type parameters.
 * However, conventional single-letter names make generic declarations
 * easier to recognize and understand.
 *
 * Common conventions:
 *
 * T - Type
 * E - Element, commonly used with collections
 * K - Key, commonly used in maps and key-value structures
 * V - Value, commonly used in maps and key-value structures
 * N - Number
 * R - Return type
 * S, U - Additional type parameters when needed
 *
 * These are conventions, not Java keywords.
 *
 * Descriptive names can also be appropriate when they make complex
 * generic declarations easier to understand.
 */
public class _16_TypeParameterNaming {

    /*
     * R represents the result type of a generic method.
     *
     * T represents the input type, while R represents the returned type.
     */
    public static <T, R> R convert(T input, java.util.function.Function<T, R> converter) {
        return converter.apply(input);
    }

    static void main(String[] args) {

        Box<String> box = new Box<>("Account-001");
        System.out.println(box.value());

        Entry<String, Double> accountEntry =
                new Entry<>("ACC-001", 1500.75);

        System.out.println(accountEntry.key());
        System.out.println(accountEntry.value());

        CollectionHolder<String> holder =
                new CollectionHolder<>("Transaction");

        System.out.println(holder.element());

        NumericHolder<Integer> numericHolder =
                new NumericHolder<>(100);

        System.out.println(numericHolder.getAsDouble());

        // T is String and R is Integer.
        Integer length = convert("Acme", String::length);
        System.out.println(length);

        /*
         * The compiler does not care whether you use T, E, or another
         * valid identifier. The names communicate the intended role
         * of each type parameter to developers.
         */
    }

    /*
     * T represents a general type.
     */
    record Box<T>(T value) {

    }

    /*
     * K and V represent a key-value pair.
     */
    record Entry<K, V>(K key, V value) {

    }

    /*
     * E represents the element type of a collection.
     */
    record CollectionHolder<E>(E element) {

    }

    /*
     * N represents a numeric type.
     *
     * The extends Number bound restricts N to Number or one of its
     * subclasses, allowing methods such as doubleValue() to be called.
     */
    static class NumericHolder<N extends Number> {

        private final N number;

        public NumericHolder(N number) {
            this.number = number;
        }

        public double getAsDouble() {
            return number.doubleValue();
        }
    }
}