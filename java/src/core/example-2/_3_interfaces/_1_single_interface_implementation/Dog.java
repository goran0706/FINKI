package _3_interfaces._1_single_interface_implementation;

public class Dog implements Animal {
    @Override
    public void animalSound() {
        // The body of animalSound() is provided here
        System.out.println("The dog says: bark bark");
    }

    @Override
    public void sleep() {
        // The body of sleep() is provided here
        System.out.println("Zzz");
    }
}
