package _01_fundamentals;

public class _06_Var {

    /*
     * The var keyword (introduced in Java 10) enables local variable type inference.
     * The compiler infers the variable's type from its initializer.
     *
     * Limitations:
     * - Can only declare local variables with var.
     * - Cannot declare instance or static fields with var.
     * - Cannot use var for method parameters or return types.
     * - Cannot declare a local variable without an initializer.
     * - Cannot initialize a variable with null alone because its type cannot be inferred.
     * - Cannot use var in compound declarations, such as var x = 1, y = 2.
     *
     * Important:
     * var is not dynamic typing. The inferred type is fixed at compile time.
     */

    static void main(String[] args) {

        // Integer
        var x = 10;

        // Double
        var y = 2.10;

        // Char
        var z = 'a';

        // String
        var p = "John";

        // Boolean
        var q = false;

        // The compiler infers each variable's type from its initializer.
        // These variables remain statically typed.
        System.out.println(x);
        System.out.println(y);
        System.out.println(z);
        System.out.println(p);
        System.out.println(q);
    }
}