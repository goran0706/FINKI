package _12_streams.models;

import java.util.List;
import java.util.Objects;

public record Department(int id, String name, List<Employee> employees) {

    public Department(int id, String name, List<Employee> employees) {
        this.id = id;
        this.name = Objects.requireNonNull(name, "name cannot be null");
        this.employees = List.copyOf(
                Objects.requireNonNull(employees, "employees cannot be null")
        );
    }

    @Override
    public String toString() {
        return "Department{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", employees=" + employees.size() +
                '}';
    }
}