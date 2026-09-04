package exercises;

public class MyDate {
    // Member/instance variables (a.k.a. fields/properties/attributes)
    int day;
    int month;
    int year;

    // Constructors allow you to initialize an object when it is created (instantiated).
    // Add a no-argument (no-args) constructor. The no-args constructor enables you to make a MyDate using default values.

    // Constructors:
    // 1. Same name as the class
    // 2. No return type

    //The no-args constructor
    public MyDate() {
    }

    //Constructor that takes 3 arguments
    public MyDate(int m, int d, int y) {
        setDate(m, d, y);
    }

    //Methods
    public String toString() {
        return month + "/" + day + "/" + year;
    }

    public void setDate(int m, int d, int y) {
        day = d;
        year = y;
        month = m;
    }
}

class MainClass {
    public static void main(String[] args) {
        MyDate date = new MyDate(31, 1, 2023);
        System.out.println(date);
    }
}