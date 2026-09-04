package _2_classes._10_inheritance;

public class Main {
    public static void main(String[] args) {
        /*
         * - The type of reference variable determines what members of the object can be accessed.
         * If a reference type is a super-class of the object, then only those methods that are both in the subclass object and super-class can be accessed.
         *
         * - The reference variable type determines what method can be accessed in the object,
         * but the Object type determines which version of the overridden method would be used.
         *
         * Virtual Method Invocation (which method to execute is decided during the Run-time, not on compile time)
         * */

        Animal dog1 = new Dog("white", "Lina", 7, 20);
        Dog dog2 = new Dog("brown", "Max", 8, 30);
        PoliceDog policeDog = new PoliceDog("120", "K-9", "black", "Panther", 8, 30);

        Animal cat1 = new Dog("black", "Tom", 5, 10);
        Cat cat2 = new Cat("black", "Jerry", 2, 10);

        dog1.eat("bones"); // Animal reference has access to eat, run, sleep
        dog2.bark(); // Dog reference has access to eat, run, sleep, and bark
        policeDog.search();

        // Overriding the info method
        dog1.info();
        dog2.info();
        policeDog.info();

        cat1.eat("fish"); // Animal reference has access to eat, run, sleep
        cat2.meow(); // Cat reference has access to eat, run, sleep, and meow
    }
}
