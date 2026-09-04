package lessons._3_nested_classes;

public class MultipleClassesInSameFile {
    public static void main(String[] args) {
        var man = new Human();
        man.name = "John";
        System.out.println(man.name);
    }
}

class Human {
    String name;
}
