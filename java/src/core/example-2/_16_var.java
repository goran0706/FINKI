public class _16_var {
    public static void main(String[] args) {
        /*
         * Limitations of var:
         * - We cannot use it to declare local variables inside methods. We cannot use it to declare method parameters or instance fields.
         * - We cannot use it to specify the return type of method.
         * - We cannot use it with a generic type.
         * - We cannot use it to declare class members.
         * */

        // Int
        var x = 10;

        // Double
        var y = 2.10;

        // Char
        var z = 'a';

        // String
        var p = "John";

        // Boolean
        var q = false;

        // Type inference is used in the var keyword in which it automatically detects the data type of variable.
        System.out.println(x);
        System.out.println(y);
        System.out.println(z);
        System.out.println(p);
        System.out.println(q);
    }
}
