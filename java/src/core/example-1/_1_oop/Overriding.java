package lessons._1_oop;

import java.util.Objects;

public class Overriding {
    public static void main(String[] args) {
        Circle circle1 = new Circle(10);
        Circle circle2 = new Circle(20);
        Circle circle3 = new Circle(10);

        System.out.println(circle1);

        System.out.println(circle1.equals(circle2));
        System.out.println(circle1.equals(circle3));

        System.out.println(circle1.hashCode());
        System.out.println(circle2.hashCode());
        System.out.println(circle3.hashCode());
    }
}

class Circle {
    int radius;

    public Circle(int radius) {
        this.radius = radius;
    }

    @Override
    public String toString() {
        return "Circle{" +
                "radius=" + radius +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Circle circle)) return false;
        return radius == circle.radius;
    }

    @Override
    public int hashCode() {
        return Objects.hash(radius);
    }
}