//package lessons._1_oop;
//
//// Java supports only single inheritance
//
//import lessons._1_oop.entities.Square;
//import lessons._1_oop.entities.Rectangle;
//
//import java.util.Date;
//
//// Inheritance or Subclassing
//public class Inheritance {
//    public static void main(String[] args) {
//        Employee emp = new Employee(new Date(2023, 31, 1), 1000);
//        System.out.println(emp.getDate());
//        System.out.println(emp.getFirstName());
//        System.out.println(emp.getLastName());
//
//        Square square = new Square(10, 10);
//        System.out.println(square.getWidth());
//        System.out.println(square.getHeight());
//        System.out.println(Square.count);
//
//        Rectangle rect = new Rectangle(5, 10, "Red");
//        System.out.println(rect.getWidth());
//        System.out.println(rect.getHeight());
//        System.out.println(rect.getColor());
//
//        // Polymorphism applied (Using the more generic supper class)
//        Shape triangle = new Shape(10, 5);
//        System.out.println(triangle.getWidth());
//        System.out.println(triangle.getHeight());
//    }
//}
//
