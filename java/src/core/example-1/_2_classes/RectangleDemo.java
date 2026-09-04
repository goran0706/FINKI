package lessons._2_classes;

import lessons._1_oop.entities.Rectangle;

public class RectangleDemo {
    public static void main(String[] args) {
        Rectangle box = new Rectangle(2, 4);
        Rectangle square = new Rectangle(4, 4);

        System.out.println(box);
        System.out.println("box area: " + box.area());
        System.out.println(System.lineSeparator());
        System.out.println(square);
        System.out.println("square area: " + square.area());
        System.out.println("Number of rectangles: " + Rectangle.getNumRectangles());
    }
}
