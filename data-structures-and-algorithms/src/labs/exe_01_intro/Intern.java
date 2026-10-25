package labs.exe_01_intro;

// is-a relationship
public class Intern extends Employee {
    private int months;

    public Intern(String id, String name, double baseSalary, int months) {
        super(id, name, baseSalary);
        this.months = months;
    }

    public int getMonths() {
        return months;
    }

    public void setMonths(int months) {
        this.months = months;
    }

    @Override
    public double calculateSalary() {
        double salary = super.calculateSalary();

        if (months >= 6) {
            salary = salary * 80 / 100;
        } else {
            salary = salary * 60 / 100;
        }

        return salary;
    }

    @Override
    public String toString() {
        return super.toString() + " months=" + months;
    }
}
