package _2_classes._10_inheritance;

public class Cat extends Animal {
    String furColor;
    String petName;

    public Cat(String furColor, String petName, int age, int weight) {
        super(age, weight);
        this.furColor = furColor;
        this.petName = petName;
    }

    void meow() {
        System.out.println("Meowing...");
    }

    @Override
    void eat(String food) {
        super.eat(food);
        System.out.println("Cat likes " + food);
    }

    @Override
    void info() {
        System.out.print("A cat");
    }
}
