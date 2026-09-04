package _2_classes._10_inheritance;

public abstract class Animal {
    /*
     * Any class that has at least one abstract method should also be abstract.
     * Subclasses must override any abstract method.
     * */
    int age;
    int weight;

    public Animal(int age, int weight) {
        this.age = age;
        this.weight = weight;
    }

    void eat(String food) {
        System.out.println("Eating... " + food);
    }

    void run() {
        System.out.println("Running...");
    }

    void sleep() {
        System.out.println("Sleeping...");
    }

    abstract void info();
}
