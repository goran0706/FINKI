package _02_classes.entities;

public class Person {

    private final String name;
    private int age;

    // Instance initializer block: runs for every new Person object.
    {
        age = 18;
        System.out.println("Instance initializer: default age set to " + age);
    }

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public Person(String name) {
        this(name, 0);
        System.out.println("Constructor: name set to " + name);
    }

    public Person() {
        this("Unknown");
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public void introduce() {
        System.out.println("My name is " + name + " and I am " + age + " years old.");
    }

    // Overloaded method: accepts a greeting.
    public void introduce(String greeting) {
        System.out.println(greeting + " My name is " + name + ".");
    }

    // Overloaded method: accepts a greeting and repeats it a specified number of times.
    public void introduce(String greeting, int repetitions) {
        for (int i = 0; i < repetitions; i++) {
            System.out.println(greeting);
        }

        introduce();
    }

    @Override
    public String toString() {
        return "Person{name='" + name + "', age=" + age + "}";
    }
}