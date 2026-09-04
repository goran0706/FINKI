public class _19_Methods {
    public static void main(String[] args) {
        printHello();
        printNumber(5);
        System.out.println(addTwoNumbers(10, 10.50));
    }

    //void, parameterless
    public static void printHello() {
        System.out.println("Hello!");
    }

    //void, parameterized
    public static void printNumber(int n) {
        System.out.println(n);
    }

    //value-returning, parameterless
    public static double giveMe10() {
        return 10;
    }

    //value-returning, parameterized
    public static double addTwoNumbers(double a, double b) {
        return a + b;
    }

    // Pass-by-value
    // 1) A copy is made of the data being passed in
    // 2) Changes made to the copy inside the method do not affect the original

    // Pass-by-reference
    // 1) The address is passed in
    // 2) Any changes made to the parameter in the method affects the argument that was passed in when the method was called
}
