package _12_streams.models;

import java.util.Objects;

public record Employee(int id, String name, double salary, Department department) {

    public Employee(int id, String name, double salary, Department department) {
        this.id = id;
        this.name = Objects.requireNonNull(name, "name cannot be null");
        this.salary = salary;
        this.department = Objects.requireNonNull(department, "department cannot be null");
    }

    @Override
    public String toString() {
        return "Employee{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", salary=" + salary +
                ", department=" + department.name() +
                '}';
    }
}