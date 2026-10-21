package _08_generics;

/*
 * GENERIC CONSTRUCTORS
 *
 * A generic constructor declares its own type parameter, independently
 * of whether its enclosing class is generic.
 *
 * Syntax:
 *     public <T> ClassName(T value)
 *
 * The type parameter is declared before the constructor's return-less
 * declaration. Constructors do not have a return type.
 *
 * A generic constructor can infer its type parameter from the argument
 * passed when the object is created.
 *
 * Important distinction:
 * - A generic class declares type parameters for the class.
 * - A generic constructor declares type parameters for that constructor.
 * - A non-generic class can have a generic constructor.
 */
public class _13_GenericConstructors {

    private final String description;

    /*
     * This constructor has its own generic type parameter T.
     *
     * T can represent any reference type, such as String or Integer.
     * The constructor converts the supplied value to a String.
     *
     * The class itself is not generic.
     */
    public <T> _13_GenericConstructors(T value) {
        this.description = String.valueOf(value);
    }

    static void main(String[] args) {

        // The constructor infers T as String.
        _13_GenericConstructors stringExample =
                new _13_GenericConstructors("Bank account");

        System.out.println(stringExample.getDescription());

        // The constructor infers T as Integer.
        _13_GenericConstructors integerExample =
                new _13_GenericConstructors(100);

        System.out.println(integerExample.getDescription());

        /*
         * Box<String> fixes the class type parameter T as String.
         * The constructor independently infers U as Integer.
         */
        Box<String> box = new Box<>("Account-001", 42);

        System.out.println("Box value: " + box.getValue());
    }

    public String getDescription() {
        return description;
    }

    /*
     * A generic class can also declare a generic constructor.
     *
     * The class type parameter T and constructor type parameter U
     * are independent of each other.
     */
    static class Box<T> {

        private final T value;

        public <U> Box(T value, U metadata) {
            this.value = value;

            // U can be a different type from T.
            System.out.println("Metadata: " + metadata);
        }

        public T getValue() {
            return value;
        }
    }
}