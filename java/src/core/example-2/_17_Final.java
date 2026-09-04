public class _17_Final {
    /*
     *   The final modifier means "unable to change". The final keyword can be used for three different things
     *   - 'final' before a variable makes the variable a constant.
     *   - 'final' before a method makes it so the method cannot be overridden.
     *   - 'Final' before a class makes that class cannot be extended.
     * */
    final double PI = 3.14;

    final void printPI() {
        System.out.println("PI is " + PI);
    }

    static final class ImmutableClass {

    }
}
