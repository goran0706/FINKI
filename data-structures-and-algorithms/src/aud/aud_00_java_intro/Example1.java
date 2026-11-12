package aud.aud_00_java_intro;

import java.util.ArrayList;
import java.util.List;

class Student {
    private String firstName;
    private String lastName;
    private int age;
    private Boolean isInternational;

    public Student(String firstName, String lastName, int age, Boolean isInternational) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.isInternational = isInternational;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        if (age < 0) {
            throw new IllegalArgumentException("Age cannot be negative");
        }
        this.age = age;
    }

    public Boolean getInternational() {
        return isInternational;
    }

    public void setInternational(Boolean international) {
        isInternational = international;
    }

    @Override
    public String toString() {
        return "Student: " + "firstName='" + firstName + "', " + "lastName='" + lastName + "', " + "age=" + age + ", " + "isInternational=" + isInternational;
    }
}

class MasterStudent extends Student {
    private final String thesisTitle;

    public MasterStudent(String firstName, String lastName, int age, Boolean isInternational, String thesisTitle) {
        super(firstName, lastName, age, isInternational);
        this.thesisTitle = thesisTitle;
    }

    @Override
    public String toString() {
        return super.toString() + ", thesisTitle='" + thesisTitle + "'";
    }
}

class PhdStudent extends MasterStudent {
    private final String researchArea;

    public PhdStudent(String firstName, String lastName, int age, Boolean isInternational, String thesisTitle, String researchArea) {
        super(firstName, lastName, age, isInternational, thesisTitle);
        this.researchArea = researchArea;
    }

    @Override
    public String toString() {
        return super.toString() + ", researchArea='" + researchArea + "'";
    }
}

public class Example1 {
    static void main(String[] args) {
        Student student1 = new Student("John", "Doe", 20, true);
        MasterStudent masterStudent1 = new MasterStudent("Jane", "Doe", 25, true, "AI in Healthcare");
        PhdStudent phdStudent1 = new PhdStudent("Jane", "Doe", 25, true, "AI in Finance", "Fintech");

        // Use a parent class reference to hold an instance of a child class.
        // This is called upcasting, and it's one of the most important concepts in inheritance and polymorphism.
        // Upcasting is useful because you can write code against the parent class instead of writing separate code for every child class.
        //
        // * Inheritance: A child class is also a type of its parent.
        // * Upcasting: Allows you to refer to a child object using a parent reference.
        // * Polymorphism: Allows different child objects to behave differently through the same parent reference.

        Student student2 = new Student("John", "Doe", 20, true);
        Student masterStudent2 = new MasterStudent("Jane", "Doe", 25, true, "AI in Healthcare");
        Student phdStudent2 = new PhdStudent("Jane", "Doe", 25, true, "AI in Finance", "Fintech");

        List<Student> list = new ArrayList<>();
        list.add(student1);
        list.add(student2);
        list.add(masterStudent1);
        list.add(masterStudent2);
        list.add(phdStudent1);
        list.add(phdStudent2);

        for (Student student : list) {
            System.out.println(student);
        }

        printStudent(student1);
        printStudent(student2);
        printStudent(masterStudent1);
        printStudent(masterStudent2);
        printStudent(phdStudent1);
        printStudent(phdStudent2);

        // Requires casting to MasterStudent
        // printMasterStudent(student1);
        printMasterStudent(masterStudent1);
        // printMasterStudent(phdStudent2);
    }

    // GOOD - more generic class/types, more flexibility
    private static void printStudent(Student o) {
        System.out.println(o);
    }

    // BAD - more specific class/type, less flexibility
    private static void printMasterStudent(MasterStudent o) {
        System.out.println(o);
    }

    private static void printPhdStudent(PhdStudent o) {
        System.out.println(o);
    }
}
