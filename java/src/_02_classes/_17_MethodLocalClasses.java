package _02_classes;

/*
 * A method-local class is declared inside a method.
 *
 * It can be instantiated and used only within the method where it is declared.
 * It can access the enclosing class's members and final or effectively final
 * local variables from the enclosing method.
 */
public class _17_MethodLocalClasses {

    private final String department = "Engineering";

    static void main(String[] args) {
        _17_MethodLocalClasses company = new _17_MethodLocalClasses();
        company.displayEmployee();
    }

    public void displayEmployee() {
        String employeeName = "Alice";

        // This class exists only within displayEmployee().
        class Employee {

            public void introduce() {
                // Access the enclosing object's instance field.
                System.out.println("Department: " + department);

                // Access a local variable that is effectively final.
                System.out.println("Employee: " + employeeName);
            }
        }

        Employee employee = new Employee();
        employee.introduce();
    }
}