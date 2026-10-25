package labs.exe_01_intro;

// has-a relationship (composition)
public class Company {
    private final String name;
    private final Employee[] employees;
    private int employeeCount;

    public Company(String name, int capacity) {
        this.name = name;
        this.employees = new Employee[capacity];
        this.employeeCount = 0;
    }

    public String getName() {
        return name;
    }

    public void hire(Employee e) {
        if (employeeCount >= employees.length) {
            throw new IllegalStateException("Employee capacity limit");
        }

        employees[employeeCount++] = e;
    }

    public void printAll() {
        System.out.println("=== " + name + " ===");

        for (int i = 0; i < employeeCount; i++) {
            System.out.println(employees[i]);
        }
    }

    public void printStatistics() {
        int teamLeaders = 0;
        int developers = 0;
        int interns = 0;
        int others = 0;

        for (int i = 0; i < employeeCount; i++) {
            switch (employees[i]) {
                case TeamLead teamLead -> teamLeaders++;
                case Developer developer -> developers++;
                case Intern intern -> interns++;
                case null, default -> others++;
            }
        }

        System.out.println("Developers: " + developers + ", Team leads: " + teamLeaders + ", Interns: " + interns + ", " + "Others: " + others);
    }

    public double totalPayroll() {
        double totalSalary = 0;

        for (int i = 0; i < employeeCount; i++) {
            totalSalary += employees[i].calculateSalary();
        }

        return totalSalary;
    }

    public double averageSalary() {
        if (employeeCount == 0) {
            return 0.0;
        }

        return totalPayroll() / employeeCount;
    }

    public Employee highestPaid() {
        if (employeeCount == 0) {
            return null;
        }

        int highestIndex = 0;

        for (int i = 1; i < employeeCount; i++) {
            if (employees[i].calculateSalary() > employees[highestIndex].calculateSalary()) {
                highestIndex = i;
            }
        }

        return employees[highestIndex];
    }

    public int countAbove(double threshold) {
        int count = 0;

        for (int i = 0; i < employeeCount; i++) {
            if (employees[i].calculateSalary() > threshold) {
                count++;
            }
        }

        return count;
    }
}
