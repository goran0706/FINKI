package _08_generics;

/*
 * TYPE ERASURE
 *
 * Java implements generics primarily through a compiler mechanism called
 * type erasure.
 *
 * During compilation, the compiler removes most generic type information
 * and replaces type parameters with their bounds or Object when no bound
 * is specified.
 *
 * For example:
 *
 *     Box<String>  -> Box
 *     Box<Integer> -> Box
 *
 * Both use the same runtime class. The compiler checks their types before
 * compilation and inserts casts where necessary.
 *
 * Consequences:
 * 1. Generic types generally do not retain their type arguments at runtime.
 * 2. You cannot create an object directly from a type parameter using new T().
 * 3. You cannot use primitive types as generic type arguments.
 * 4. You cannot overload methods based only on different generic arguments
 *    when type erasure gives them the same signature.
 */
public class _15_TypeErasure {

    /*
     * This method demonstrates that the runtime class of a generic object
     * does not reveal its type argument.
     */
    public static void printRuntimeClass(Object value) {
        System.out.println(value.getClass().getName());
    }

    static void main(String[] args) {

        Box<String> stringBox = new Box<>();
        stringBox.setValue("Account");

        Box<Integer> integerBox = new Box<>();
        integerBox.setValue(100);

        // Both objects have the same runtime class.
        System.out.println(stringBox.getClass() == integerBox.getClass());

        printRuntimeClass(stringBox);
        printRuntimeClass(integerBox);

        /*
         * The compiler preserves type safety in source code.
         * This assignment is valid because the object was declared as Box<String>.
         */
        String value = stringBox.getValue();
        System.out.println(value);

        NumericBox<Integer> numericBox = new NumericBox<>(42);
        System.out.println(numericBox.value());

        /*
         * You cannot check a generic type argument with instanceof:
         *
         * if (stringBox instanceof Box<String>) { } // Does not compile
         *
         * The runtime cannot distinguish Box<String> from Box<Integer>
         * through their erased class types.
         *
         * You can check the raw class:
         */
        if (stringBox instanceof Box<?>) {
            System.out.println("The object is a Box of some type.");
        }

        /*
         * These declarations are not allowed because T is erased:
         *
         * T value = new T();
         * T[] values = new T[10];
         *
         * Generic arrays also cannot be created directly:
         *
         * List<String>[] lists = new List<String>[10];
         *
         * The compiler prevents these operations because the runtime
         * cannot reliably enforce the generic type arguments.
         */
    }

    static class Box<T> {

        private T value;

        public T getValue() {
            return value;
        }

        public void setValue(T value) {
            this.value = value;
        }
    }

    /*
     * With no explicit bound, T is erased to Object.
     */
    static class UnboundedBox<T> {

        public T getValue() {
            return null;
        }
    }

    /*
     * With a bound, T is erased to its first bound.
     *
     * Here, T is erased to Number.
     */
    record NumericBox<T extends Number>(T value) {

    }
}