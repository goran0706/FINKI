package _08_generics;

import java.util.ArrayList;
import java.util.List;

/*
 * GENERIC RESTRICTIONS
 *
 * Java generics provide compile-time type safety, but they have several
 * restrictions because generic type information is erased at runtime.
 *
 * This example demonstrates common operations that Java does not allow.
 */
public class _17_GenericRestrictions<T> {

    /*
     * Restriction 1: Primitive types cannot be generic type arguments.
     *
     * Invalid:
     *     List<int> numbers;
     *
     * Use wrapper classes instead:
     *     List<Integer> numbers;
     */
    private final List<Integer> numbers = new ArrayList<>();

    /*
     * Restriction 2: You cannot instantiate a type parameter directly.
     *
     * Invalid:
     *     T value = new T();
     *
     * The runtime does not know which concrete class T represents.
     */

    /*
     * Restriction 3: You cannot create arrays of a type parameter.
     *
     * Invalid:
     *     T[] values = new T[10];
     *
     * Generic type information is erased, so Java cannot reliably
     * enforce the array's element type at runtime.
     */

    /*
     * Restriction 4: You cannot create arrays of parameterized types.
     *
     * Invalid:
     *     List<String>[] lists = new List<String>[10];
     *
     * Arrays perform runtime type checks, while generic type arguments
     * are erased. These mechanisms are incompatible in this situation.
     */

    /*
     * Restriction 5: You cannot use a type parameter in a static field.
     *
     * Invalid:
     *     static T value;
     *
     * A static field belongs to the class itself, but T can differ
     * between instances such as GenericBox<String> and GenericBox<Integer>.
     */

    /*
     * Restriction 6: You cannot use instanceof with a specific
     * parameterized type.
     *
     * Invalid:
     *     if (value instanceof List<String>) { }
     *
     * The runtime cannot determine whether the object is a List<String>
     * or a List<Integer>.
     *
     * A wildcard is allowed:
     *     if (value instanceof List<?>) { }
     */

    /*
     * Restriction 7: Generic classes cannot extend Throwable.
     *
     * Invalid:
     *     class GenericException<T> extends Exception { }
     *
     * Java does not allow generic subclasses of Throwable because
     * exception handling relies on runtime type information.
     */

    /*
     * Restriction 8: Methods cannot be overloaded when their signatures
     * become identical after type erasure.
     *
     * Invalid:
     *
     * void process(List<String> values) { }
     * void process(List<Integer> values) { }
     *
     * Both signatures erase to process(List values).
     */

    static void main(String[] args) {

        _17_GenericRestrictions<String> example =
                new _17_GenericRestrictions<>();

        example.addNumber(10);
        example.addNumber(20);

        System.out.println(example.getNumbers());

        /*
         * Wrapper classes allow primitive values to be used with generics.
         *
         * Java automatically converts between int and Integer in many
         * contexts through a feature called autoboxing and unboxing.
         */
        List<Integer> quantities = new ArrayList<>();
        quantities.add(100); // Autoboxing: int -> Integer

        int quantity = quantities.get(0); // Unboxing: Integer -> int

        System.out.println(quantity);

        /*
         * A static generic method can declare its own type parameter.
         * This is allowed because the parameter belongs to the method,
         * not to the generic class.
         */
    }

    public static <U> U identity(U value) {
        return value;
    }

    public void addNumber(Integer number) {
        numbers.add(number);
    }

    public List<Integer> getNumbers() {
        return numbers;
    }
}