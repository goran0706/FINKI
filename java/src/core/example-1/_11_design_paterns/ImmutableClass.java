package lessons._11_design_paterns;

public final class ImmutableClass {
    private final String firstName;
    private final String lastName;

    public ImmutableClass(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    @Override
    public String toString() {
        return "ImmutableClass{ " + "firstName='" + firstName + '\'' + ", lastName='" + lastName + '\'' + " } ";
    }
}

class ImmutableClassDemo {
    public static void main(String[] args) {
        ImmutableClass obj1 = new ImmutableClass("John", "Doe");
        System.out.println(obj1.getFirstName());
        System.out.println(obj1.getLastName());
        System.out.println(obj1);
    }
}
