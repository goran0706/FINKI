package _2_classes;

public class ConstructorOverloading {
    private int numCounter;
    private String strCounter;

    public ConstructorOverloading() {
    }

    public ConstructorOverloading(int numCounter) {
        this.numCounter = numCounter;
    }

    public ConstructorOverloading(int numCounter, String strCounter) {
        this.numCounter = numCounter;
        this.strCounter = strCounter;
    }
}
