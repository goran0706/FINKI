package _02_classes;

/*
 * A static nested class is declared inside another class using `static`.
 *
 * Unlike a non-static inner class, it does not require an instance of
 * the enclosing class to be created.
 *
 * A static nested class can directly access the enclosing class's static
 * members, but it needs an enclosing-class instance to access instance members.
 */
public class _15_StaticNestedClasses {

    private static final String companyName = "Acme";
    private final String department = "Engineering";

    static void main(String[] args) {
        // Create the nested class without creating the enclosing class first.
        Employee employee = new Employee();

        employee.displayCompany();

        // Supply an enclosing-class instance to access its instance field.
        _15_StaticNestedClasses company = new _15_StaticNestedClasses();
        employee.displayDepartment(company);
    }

    static class Employee {

        public void displayCompany() {
            // Static nested classes can directly access static members.
            System.out.println(companyName);
        }

        public void displayDepartment(_15_StaticNestedClasses company) {
            // Instance members require an instance of the enclosing class.
            System.out.println(company.department);
        }
    }
}