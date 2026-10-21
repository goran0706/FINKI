package _02_classes;

/*
 * A non-static inner class is declared inside another class without `static`.
 *
 * Each inner-class instance is associated with an instance of the enclosing
 * class. It can directly access both instance and static members of that class.
 *
 * Create an inner-class object through an enclosing-class object:
 * enclosingObject.new InnerClass()
 */
public class _16_InnerClasses {

    private final String companyName = "Acme";

    static void main(String[] args) {
        _16_InnerClasses company = new _16_InnerClasses();

        // An inner-class instance is created through its enclosing instance.
        Employee employee = company.new Employee();

        employee.introduce();
    }

    private class Employee {

        public void introduce() {
            // An inner class can directly access the enclosing object's fields.
            System.out.println("I work at " + companyName);
        }
    }
}