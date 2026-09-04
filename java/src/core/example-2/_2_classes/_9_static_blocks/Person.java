package _2_classes._9_static_blocks;

public class Person {
    static int score;

    static {
        score = 100;
        System.out.println("static block called");
    }

    String name;
    int age;

    Person() {
        System.out.println("Constructor called");
    }

    void talk() {
        System.out.println("Hi...");
    }

}
