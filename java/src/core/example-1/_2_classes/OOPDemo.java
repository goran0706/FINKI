package lessons._2_classes;

import lessons._1_oop.entities.Book;
import lessons._1_oop.entities.Rectangle;

public class OOPDemo {
    public static void main(String[] args) {
        // Object-oriented Programming (OOP):
        // - Focus is on objects, which have behaviors and data
        // - Classes are used as blueprints to create objects

        // Objects:
        // - An object represents an entity that has both behaviors and data
        // - This forms encapsulation
        // - There are three primary principles of OOP:
        //   - Encapsulation, Inheritance, Polymorphism

        // Encapsulation:
        // Classes have private fields and public methods to access the fields
        // -- Data cannot be unexpectedly modified from outside the class
        // -- Option to validate before modifying
        // -- Class is in control of its own data, and functionality to change or get data has to be implemented on one place only

        // Inheritance:
        // A class can get properties and methods from a parent class.
        // - Classes can inherit from a parent class. They can only have one direct parent
        // - The child class inherits all fields and methods from the parent class that are visible (access modifiers) inside the child class
        // -- Avoid duplicate code
        // -- Better structure and better maintainability
        // -- Option to bundle different classes as the same kind

        // Polymorphism:
        // You can refer to a class by its parent.
        // Referring to a class not with the class type exactly, but with another type that also represents the class.

        Rectangle square = new Rectangle(5, 5);
        System.out.println(square.area());

        Book gameOfThrones = new Book("George Martin", "Game of Thrones", "Fantasy", 864);
        Book javaBook = new Book("Joel Murach", "Java Programming", "Programming", 800);
        Book javaScriptBook = new Book("Stephen Grider", "JavaScript Programming", "Programming", 750);
    }
}
