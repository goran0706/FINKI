package lessons._1_oop;


    public class Encapsulation {
    public static void main(String[] args) {
        Employee obj = new Employee("John", "Doe", 33);
        obj.getFirstName();

        // Step 1. Declare fields private
        // Step 2. Implement constructor to set the value of all fields (remove no-args constructor)
        // Step 3. Declare getters and setters that make sense depending on the content

        // Data variables, or fields are hidden from the user of the object.
        // Constructors or methods are created in order to initialize the data variables
        // Methods provide explicit access to the user of the object, but hide the implementation
        // Methods provide more control for checking values when setting new data.
        // Methods provide the "Public API of the class"
        // Methods provide a way to change the implementation without impacting the user of the object.

        // Encapsulation Benefits:
        // Protects an object from unwanted access by clients
        // Prevents assigning undesired values
        // Allows changing the class implementation without modifying the client interface (programming towards the interface)

    }
}

class Employee {
    private String firstName;
    private String lastName;
    private int age;

    public Employee(String firstName, String lastName, int age) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
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
        this.age = age;
    }
}