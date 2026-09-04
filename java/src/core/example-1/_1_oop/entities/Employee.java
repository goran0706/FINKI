package lessons._1_oop.entities;

import java.util.Date;

public class Employee {
    private Date hireDate;
    private int salary;

    public Employee(Date hireDate, int salary) {
        super();
        this.hireDate = hireDate;
        this.salary = salary;
    }

    public void promote(int percent) {
        salary *= 1 + (percent / 100);
    }

    public Date getHireDate() {
        return hireDate;
    }

    public void setHireDate(Date hireDate) {
        this.hireDate = hireDate;
    }

    public int getSalary() {
        return salary;
    }

    public void setSalary(int salary) {
        this.salary = salary;
    }
}
