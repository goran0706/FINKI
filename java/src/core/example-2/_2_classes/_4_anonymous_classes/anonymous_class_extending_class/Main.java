package _2_classes._4_anonymous_classes.anonymous_class_extending_class;


class Polygon {
    public void display() {
        System.out.println("Inside the Polygon class");
    }
}

class AnonymousDemo {
    public void createClass() {
        // creation of anonymous class extending class Polygon
        Polygon p1 = new Polygon() {
            public void display() {
                System.out.println("Inside an anonymous class.");
            }
        };
        p1.display();
    }
}

/*
 * Advantages of Anonymous Classes:
 * - In anonymous classes, objects are created whenever they are required. That is, objects are created to perform some specific tasks.
 * - Anonymous classes also help us to make our code concise.
 * */
public class Main {
    public static void main(String[] args) {
        AnonymousDemo an = new AnonymousDemo();
        an.createClass();
    }
}
