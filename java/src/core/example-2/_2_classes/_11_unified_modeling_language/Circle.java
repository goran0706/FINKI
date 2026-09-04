package _2_classes._11_unified_modeling_language;

/*
    Unified Modeling Language (UML)
    UML class diagrams help us organize and describe classes

    - radius:double
    --------------------------
    + Circle()
    + Circle(radius:double)
    + getRadius():double
    + setRadius():void
    + circumference():double
    + area():double
    --------------------------
*/

public class Circle {
    private double radius;

    public Circle() {
        this(10.00);
    } // calls the overloaded constructor

    public Circle(double radius) {
        this.radius = radius;
    }

    public double getRadius() {
        return radius;
    }

    public void setRadius(double radius) {
        this.radius = radius;
    }

    public double area() {
        return Math.PI * radius * radius;
    }

    public double circumference() {
        return Math.pow(radius, radius);
    }
}
