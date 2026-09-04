package lessons._1_oop.entities;

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
    private int width;
    private int length;

    public Rectangle(int width, int length) {
        numRectangles++;
        this.width = width;
        this.length = length;
    }

    public static int getNumRectangles() {
        return numRectangles;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getLength() {
        return length;
    }

    public void setLength(int length) {
        this.length = length;
    }

    public double area() {
        return length * width;
    }
}
