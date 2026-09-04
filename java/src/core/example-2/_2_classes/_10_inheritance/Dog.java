package _2_classes._10_inheritance;

public class Dog extends Animal {
    String furColor;
    String petName;

    public Dog(String furColor, String petName, int age, int weight) {
        super(age, weight);
        this.furColor = furColor;
        this.petName = petName;
    }

    void bark() {
        System.out.println("Barking...");
    }

    @Override
    void eat(String food) {
        super.eat(food);
        System.out.println("Dog likes " + food);
    }

    @Override
    void info() {
        System.out.print("A dog");
    }
}
