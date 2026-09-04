//package lessons._1_oop;
//
//import lessons._1_oop.entities.Rectangle;
//import lessons._1_oop.entities.Shape;
//
//public class Casting {
//    public static void main(String[] args) {
//        Shape rectangle = new Rectangle(5,5);
//        rectangle.getWidth();
//        rectangle.getHeight();
//
//        // Downward Casting
//        // The compiler must be satisfied that the cast is possible.
//        Rectangle rect = (Rectangle) rectangle;
//        rect.getWidth();
//        rect.getHeight();
//        rect.getColor(); // Access color through the more specific class type
//
//        // Upward Casting
//        // The compiler do not require a cast operator.
//        Shape s = rect;
//        s.getWidth();
//        s.getHeight();
//    }
//}
//
