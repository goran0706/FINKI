package exercises;

public class Car {
    static int carCount; //static member variable

    static {
        carCount = 0;
    }//static initialization block

    String color; //instance variable
    String model; //instance variable

    {
        color = "red";
    }//initialization block

    public Car() {
        // default no-args constructor
    }

    public Car(String color, String model) {
        this.color = color;
        this.model = model;
    }

    public void printDescription() {
        System.out.println("color: " + color);
        System.out.println("model: " + model);
    }

    public static int getCarCount() {
        // use static methods to access class static variables
        // use static methods when object instance is not needed
        return carCount;
    }
}
