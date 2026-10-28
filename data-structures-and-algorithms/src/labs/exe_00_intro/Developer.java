package labs.exe_00_intro;

// is-a relationship
public class Developer extends Employee {
    private final int RATE = 300;
    private int overtimeHours;

    public Developer(String id, String name, double baseSalary, int overtimeHours) {
        super(id, name, baseSalary);
        this.overtimeHours = overtimeHours;
    }

    public int getOvertimeHours() {
        return overtimeHours;
    }

    public void setOvertimeHours(int overtimeHours) {
        this.overtimeHours = overtimeHours;
    }

    @Override
    public double calculateSalary() {
        return super.calculateSalary() + (overtimeHours * RATE);
    }

    @Override
    public String toString() {
        return super.toString() + " overtime=" + overtimeHours;
    }
}
