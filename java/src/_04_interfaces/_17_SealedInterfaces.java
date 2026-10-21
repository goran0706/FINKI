package _04_interfaces;

/*
 * SEALED INTERFACES
 *
 * Since Java 17, a sealed interface can restrict which classes or
 * interfaces are allowed to implement or extend it.
 *
 * The "permits" clause explicitly lists the permitted implementations.
 *
 * A permitted implementation must declare one of these modifiers:
 *
 * - final: cannot be subclassed.
 * - sealed: further restricts its permitted subclasses.
 * - non-sealed: removes the inheritance restriction for that branch.
 *
 * This example uses a sealed interface with final implementations.
 */
public class _17_SealedInterfaces {

    static void main(String[] args) {

        Shape circle = new Circle(5);
        Shape rectangle = new Rectangle(4, 6);

        System.out.printf("Circle area: %.2f%n", circle.area());
        System.out.printf("Rectangle area: %.2f%n", rectangle.area());
    }

    sealed interface Shape permits Circle, Rectangle {
        double area();
    }

    // A final class cannot be subclassed.
    static final class Circle implements Shape {

        private final double radius;

        Circle(double radius) {
            this.radius = radius;
        }

        @Override
        public double area() {
            return Math.PI * radius * radius;
        }
    }

    // This permitted implementation is also final.
    static final class Rectangle implements Shape {

        private final double width;
        private final double height;

        Rectangle(double width, double height) {
            this.width = width;
            this.height = height;
        }

        @Override
        public double area() {
            return width * height;
        }
    }
}