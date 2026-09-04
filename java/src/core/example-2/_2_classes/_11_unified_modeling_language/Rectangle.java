package _2_classes._11_unified_modeling_language;
/*
    Unified Modeling Language (UML)
    UML class diagrams help us organize and describe classes

    - length:double
    - width:double
    - numRectangles:int
    --------------------------
    + Rectangle()
    + Rectangle(length:double, width:double)
    + getLength():double
    + getWidth():double
    + setLength(length:double):void
    + setWidth(width:double):void
    + area():double
    + getNumRectangles():int
    --------------------------
*/

public class Rectangle {
    private static int numRectangles;
    private double length;
    private double width;

    public Rectangle() {
    }

    public Rectangle(double length, double width) {
        this.length = length;
        this.width = width;
        numRectangles++;
    }

    public static int getNumRectangles() {
        return numRectangles;
    }

    public double getLength() {
        return length;
    }

    public void setLength(double length) {
        this.length = length;
    }

    public double getWidth() {
        return width;
    }

    public void setWidth(double width) {
        this.width = width;
    }

    public double area() {
        return length * width;
    }
}
