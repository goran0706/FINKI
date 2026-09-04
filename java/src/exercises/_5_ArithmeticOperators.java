public class _5_ArithmeticOperators {
    public static void main(String[] args) {
        int a = 10;
        int b = 15;

        // e.g. BINARY operators (take two operands)
        int result = a + b;
        int difference = a - b;
        int product = a * b;
        int quotient = b / a;
        int remainder = b % a;

        System.out.println("Result: " + result);
        System.out.println("Difference: " + difference);
        System.out.println("Product: " + product);
        System.out.println("Quotient: " + quotient);
        System.out.println("Remainder: " + remainder);

        // e.g. UNARY operators (take only one operand)
        result += 20;
        System.out.println(result);

        ++result; // pre-increment
        System.out.println(result);

        --result; // pre-decrement
        System.out.println(result);

        result++; // post-increment
        System.out.println(result);

        result--; // post-decrement
        System.out.println(result);
    }
}