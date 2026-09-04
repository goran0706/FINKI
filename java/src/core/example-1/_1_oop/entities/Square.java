package lessons._1_oop.entities;

class Square extends Shape {
    static int count;

    public Square(int width, int height) {
        super(width, height);
        count++;
    }
}
