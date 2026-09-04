package lessons._1_oop;

public class Overloading {
    public static void main(String[] args) {
        Box box1 = new Box();
        System.out.println(box1.volume());

        Box box2 = new Box(1);
        System.out.println(box2.volume());

        Box box3 = new Box(1,2);
        System.out.println(box3.volume());

        Box box4 = new Box(1,2,3);
        System.out.println(box4.volume());
    }
}

class Box {
    private int length, width, height;

    public Box() {
    }

    public Box(int length) {
        this.length = length;
    }

    public Box(int length, int width) {
        this.length = length;
        this.width = width;
    }

    public Box(int length, int width, int height) {
        this.length = length;
        this.width = width;
        this.height = height;
    }

    double volume() {
        return width * height * length;
    }
}