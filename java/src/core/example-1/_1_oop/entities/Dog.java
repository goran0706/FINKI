package lessons._1_oop.entities;

public class Dog extends Animal {
    String furColor;
    String petName;

    public Dog(int age, double weight, String furColor, String petName) {
        super(age, weight);
        this.furColor = furColor;
        this.petName = petName;
    }

    public String getFurColor() {
        return furColor;
    }

    public void setFurColor(String furColor) {
        this.furColor = furColor;
    }

    public String getPetName() {
        return petName;
    }

    public void setPetName(String petName) {
        this.petName = petName;
    }
}
