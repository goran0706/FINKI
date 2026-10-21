package _02_classes.entities;

public abstract class Animal {

    private final String name;

    public Animal(String name) {
        this.name = name;
    }

    public abstract void makeSound();

    public void sleep() {
        System.out.println(name + " is sleeping.");
    }

    public String getName() {
        return name;
    }
}