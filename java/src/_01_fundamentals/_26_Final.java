package _01_fundamentals;

public class _26_Final {

    /*
     * The final keyword restricts reassignment, overriding, or inheritance,
     * depending on where it is used.
     *
     * 1. Final variable:
     *    Can be assigned only once. For primitive variables, the value
     *    cannot change after assignment. For reference variables, the
     *    reference cannot point to another object, but the object itself
     *    may still be mutable.
     *
     * 2. Final method:
     *    Cannot be overridden by subclasses.
     *
     * 3. Final class:
     *    Cannot be extended by another class.
     *
     * Note:
     * A final variable is not necessarily a compile-time constant.
     * A compile-time constant must be a final primitive or String variable
     * initialized with a constant expression.
     */

    // Final instance variable.
    final double PI = 3.14;

    static void main(String[] args) {

        _26_Final example = new _26_Final();
        example.printPI();

        // Compile-time constant.
        final int MAX_USERS = 100;

        // Final reference: the reference cannot be reassigned,
        // but the referenced array can still be modified.
        final int[] numbers = {1, 2, 3};
        numbers[0] = 10;

        System.out.println("Maximum users: " + MAX_USERS);
        System.out.println("First number: " + numbers[0]);

        // These would cause compilation errors:
        // example.PI = 3.14159;
        // numbers = new int[]{4, 5, 6};
        // class ExtendedClass extends ImmutableClass {}
    }

    // Final method: subclasses cannot override this method.
    final void printPI() {
        System.out.println("PI is " + PI);
    }

    // Final class: cannot be extended.
    static final class ImmutableClass {
    }
}