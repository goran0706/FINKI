public class _22_Methods {
    public static void main(String[] args) {
        /*
         * Methods:
         * - A reusable piece of code.
         * - Code is executed when the method gets called or invoked.
         * - The return type void means nothing is returned from this method.
         * - The return statement terminates a method, so no code belongs after the return statement.
         * */

        // Method invocation
        sayHello();
        System.out.println(factorial(3));
    }

    // Method declaration and method definition
    private static void sayHello() {
        System.out.println("Hello World");
    }

    private static void methodParams(int age) {
        System.out.println("My age is " + age);
    }

    private static int methodReturn() {
        return 10;
    }

    private static int factorial(int n) {
        if (n == 0) return 0;
        if (n == 1 || n == 2) return 1;
        return factorial(n - 2) + factorial(n - 1);
    }
}
