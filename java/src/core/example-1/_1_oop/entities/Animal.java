package lessons._1_oop.entities;

public class Animal {
    int age;
    double weight;

    public Animal(int age, double weight) {
        this.age = age;
        this.weight = weight;
    }

    public Animal() {

    }

    void eat(String food) {
        System.out.println("Eating...");
    }

    void move(String food) {
        System.out.println("Moving...");
    }

    void reproduce(String food) {
        System.out.println("...");
    }
}
