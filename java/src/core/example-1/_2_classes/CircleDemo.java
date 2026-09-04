package lessons._2_classes;

import lessons._1_oop.entities.Circle;

public class CircleDemo {
    public static void main(String[] args) {
        Circle circle = new Circle();
        System.out.println(circle.area());
        System.out.println(circle.circumference());
    }
}
