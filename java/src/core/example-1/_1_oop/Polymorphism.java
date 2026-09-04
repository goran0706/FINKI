//package lessons._1_oop;
//
//import lessons._1_oop.entities.Rectangle;
//import lessons._1_oop.entities.Shape;
//import lessons._1_oop.entities.Square;
//
//import java.util.ArrayList;
//import java.util.List;
//
//public class Polymorphism {
//    public static void main(String[] args) {
//
//        // Polymorphism applied using the most generic object type
//        List list = new ArrayList<>();
//        list.add(Integer.valueOf(1));
//        list.add(Double.valueOf(1.50));
//        list.add(true);
//
//        System.out.println(list.get(0));
//        System.out.println(list.get(1));
//        System.out.println(list.get(2));
//
//        // Polymorphism applied using the most generic object type (Generalization)
//        Square square = new Square(2, 2);
//        square.getWidth();
//        square.getHeight();
//
//        Shape box = new Rectangle(5, 5, "Blue");
//        box.getWidth(); // Virtual Method Invocation (which method to execute is decided during the Run-time, not on compile time)
//        box.getHeight(); // Virtual Method Invocation (which method to execute is decided during the Run-time, not on compile time)
//
//        // Polymorphism through Generalization
//        ArrayList<Shape> shapes = new ArrayList<>();
//        shapes.add(square);
//        shapes.add(box);
//
//        // Polymorphic method, even better if we use Generics
//        printShapeDetails(square);
//        printShapeDetails(box);
//    }
//
//    static void printShapeDetails(Shape shape) {
//        if (shape instanceof Rectangle) {
//            System.out.println(shape.getHeight() + " " + shape.getWidth() + " " + ((Rectangle) shape).getColor());
//        } else {
//            System.out.println(shape.getHeight() + " " + shape.getWidth());
//        }
//    }
//}
//
