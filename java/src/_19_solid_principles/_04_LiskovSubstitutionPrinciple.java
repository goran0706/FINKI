package _19_solid_principles;

/*
 * LISKOV SUBSTITUTION PRINCIPLE (LSP)
 *
 * Definition:
 * Objects of a subtype must be usable wherever objects of their base type
 * are expected without breaking the correctness of the program.
 *
 * In simpler terms:
 * If class B extends class A, code that works with A should continue to work
 * correctly when given an instance of B.
 *
 * Inheritance represents more than sharing fields or methods. A subtype must
 * preserve the behavioral expectations established by its base type.
 *
 * ------------------------------------------------------------
 * VIOLATION: SQUARE AND RECTANGLE
 * ------------------------------------------------------------
 *
 * A mathematical square is a special kind of rectangle.
 *
 * However, a mutable Rectangle class might allow its width and height
 * to change independently.
 *
 * A Square subclass that forces both dimensions to remain equal changes
 * the behavior expected by Rectangle.
 *
 * Code that expects to change only the width of a Rectangle may unexpectedly
 * change the height when given a Square.
 *
 * This violates LSP because the subtype does not preserve the base type's
 * behavioral contract.
 *
 * ------------------------------------------------------------
 * SOLUTION
 * ------------------------------------------------------------
 *
 * If the application only needs to calculate areas, define a common
 * abstraction called Shape.
 *
 * Rectangle and Square can both implement Shape independently.
 *
 * This avoids forcing a behavioral relationship that does not fit the
 * mutable API.
 */

public class _04_LiskovSubstitutionPrinciple {

    static void main(String[] args) {

        // VIOLATION EXAMPLE
        //
        // This method expects width and height to be independently mutable.
        // It behaves incorrectly when supplied with Square.
        Rectangle rectangle = new Rectangle(5, 4);

        System.out.println("Rectangle before modification:");
        printDimensions(rectangle);

        resizeWidth(rectangle, 10);

        System.out.println("Rectangle after changing width to 10:");
        printDimensions(rectangle);

        Square square = new Square(5);

        System.out.println("\nSquare before modification:");
        printDimensions(square);

        resizeWidth(square, 10);

        System.out.println("Square after changing width to 10:");
        printDimensions(square);

        // The method expects height to remain unchanged, but Square changes it.
        // This is the behavioral incompatibility.

        // CORRECTED DESIGN
        //
        // Both shapes provide area calculation without pretending that
        // their dimensions have identical mutation behavior.
        Shape rectangleShape = new RectangleShape(10, 5);
        Shape squareShape = new SquareShape(5);

        System.out.println("\nRectangle area: " + rectangleShape.area());
        System.out.println("Square area: " + squareShape.area());

        // Both implementations can safely be used through Shape.
        printArea(rectangleShape);
        printArea(squareShape);
    }

    /*
     * This method assumes width can change independently of height.
     * Square breaks that assumption.
     */
    static void resizeWidth(Rectangle rectangle, int newWidth) {
        rectangle.setWidth(newWidth);
    }

    static void printDimensions(Rectangle rectangle) {
        System.out.println(
                "Width: " + rectangle.getWidth()
                        + ", Height: " + rectangle.getHeight()
        );
    }

    static void printArea(Shape shape) {
        System.out.println("Area: " + shape.area());
    }

    /*
     * CORRECTED DESIGN
     *
     * Shape specifies a behavior shared by both shapes: area calculation.
     * It makes no promise that every shape has independently mutable width
     * and height.
     */
    interface Shape {

        int area();
    }

    /*
     * VIOLATION EXAMPLE
     *
     * The Rectangle contract allows independent dimension changes.
     */
    static class Rectangle {

        private int width;
        private int height;

        Rectangle(int width, int height) {
            this.width = width;
            this.height = height;
        }

        public int getWidth() {
            return width;
        }

        public void setWidth(int width) {
            this.width = width;
        }

        public int getHeight() {
            return height;
        }

        public void setHeight(int height) {
            this.height = height;
        }
    }

    /*
     * Square inherits Rectangle but changes the setters' behavior.
     *
     * Setting the width also changes the height, which breaks the assumptions
     * of code that expects Rectangle's dimensions to be independent.
     */
    static class Square extends Rectangle {

        Square(int side) {
            super(side, side);
        }

        @Override
        public void setWidth(int width) {
            super.setWidth(width);
            super.setHeight(width);
        }

        @Override
        public void setHeight(int height) {
            super.setWidth(height);
            super.setHeight(height);
        }
    }

    static class RectangleShape implements Shape {

        private final int width;
        private final int height;

        RectangleShape(int width, int height) {
            this.width = width;
            this.height = height;
        }

        @Override
        public int area() {
            return width * height;
        }
    }

    static class SquareShape implements Shape {

        private final int side;

        SquareShape(int side) {
            this.side = side;
        }

        @Override
        public int area() {
            return side * side;
        }
    }
}

/*
 * IMPORTANT DISTINCTIONS
 *
 * 1. LSP is about behavior, not merely whether code compiles.
 *    A subclass can satisfy Java's type system and still violate LSP.
 *
 * 2. A subtype must honor the expectations of the base type, including
 *    relevant preconditions, postconditions, and invariants.
 *
 * 3. A subtype should not unexpectedly require stronger preconditions
 *    or weaken the guarantees provided by its base type.
 *
 * 4. Inheritance should represent a valid behavioral relationship.
 *    Sharing fields or methods is not sufficient justification.
 *
 * 5. Composition or a shared interface may be more appropriate than
 *    inheritance when types share capabilities but not the same contract.
 *
 * 6. LSP is especially important when designing APIs, frameworks, and
 *    polymorphic code that must work with multiple implementations.
 */