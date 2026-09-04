package _2_classes._10_inheritance;

public class PoliceDog extends Dog {
    String dutyNumber;
    String unit;

    public PoliceDog(String dutyNumber, String unit, String furColor, String petName, int age, int weight) {
        super(furColor, petName, age, weight);
        this.dutyNumber = dutyNumber;
        this.unit = unit;
    }

    void search() {
        System.out.println("Searching...");
    }

    @Override
    void info() {
        System.out.println("A police dog");
    }
}
