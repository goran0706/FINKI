package lessons._7_lambda_expressions;

public class FunctionalInterfaceDemo {
    public static void main(String[] args) {
        // Anonymous implementation of the Calculator interface
        Calculator c = new Calculator() {
            @Override
            public double calc(double a, double b) {
                return a + b;
            }
        };

        System.out.println(c.calc(5, 5));

        // Using lambda expression

        Calculator c1 = (a, b) -> a + b;
        Calculator c2 = Double::sum;
        System.out.println(c1.calc(5, 5));
        System.out.println(c2.calc(5, 5));
    }
}
