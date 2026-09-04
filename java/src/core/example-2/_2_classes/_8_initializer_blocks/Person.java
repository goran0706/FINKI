package _2_classes._8_initializer_blocks;

public class Person {
    String name;
    int age;

    {
        age = 18;
        System.out.println("init block called");
    }

    Person(String name) {
        this.name = name;
    }

    Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
