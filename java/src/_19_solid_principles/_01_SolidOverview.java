package _19_solid_principles;

/*
 * SOLID PRINCIPLES OVERVIEW
 *
 * SOLID is an acronym for five object-oriented design principles that help
 * developers create software that is easier to understand, maintain, extend,
 * and test.
 *
 * SOLID is not a framework, a library, or a set of design patterns.
 * It provides guidelines for organizing classes, interfaces, and dependencies.
 *
 * The five principles are:
 *
 * S - Single Responsibility Principle (SRP)
 *     A class should have one responsibility and one reason to change.
 *
 * O - Open/Closed Principle (OCP)
 *     Software entities should be open for extension but closed for modification.
 *
 * L - Liskov Substitution Principle (LSP)
 *     Objects of a subtype should be usable wherever objects of its base type
 *     are expected without breaking the correctness of the program.
 *
 * I - Interface Segregation Principle (ISP)
 *     Clients should not be forced to depend on methods they do not use.
 *
 * D - Dependency Inversion Principle (DIP)
 *     High-level and low-level modules should depend on abstractions rather
 *     than directly depending on each other.
 *
 * ------------------------------------------------------------
 * WHY SOLID MATTERS
 * ------------------------------------------------------------
 *
 * Imagine an application that manages employees.
 *
 * Initially, one class might:
 * - Store employee information.
 * - Calculate salaries.
 * - Save employees to a database.
 * - Generate employee reports.
 * - Send notifications.
 *
 * This may work for a small application, but changes become increasingly
 * difficult as the application grows.
 *
 * For example, changing database technology might require modifying a class
 * that also contains salary calculations and notification logic.
 *
 * SOLID encourages us to separate responsibilities, define useful abstractions,
 * and design extension points so unrelated changes remain independent.
 *
 * ------------------------------------------------------------
 * SIMPLE EXAMPLE
 * ------------------------------------------------------------
 *
 * The Employee class represents employee data.
 *
 * The SalaryCalculator class handles salary calculation.
 *
 * The separation illustrates the Single Responsibility Principle:
 * employee data and salary calculation are different responsibilities.
 */

public class _01_SolidOverview {

    static void main(String[] args) {

        Employee employee = new Employee("Alice", 5000.00);

        SalaryCalculator calculator = new SalaryCalculator();

        double annualSalary = calculator.calculateAnnualSalary(employee);

        System.out.println("Employee: " + employee.name());
        System.out.println("Monthly salary: " + employee.monthlySalary());
        System.out.println("Annual salary: " + annualSalary);

        /*
         * The example is intentionally simple.
         *
         * Employee is responsible for representing employee information.
         * SalaryCalculator is responsible for calculating annual salary.
         *
         * The classes can now evolve independently:
         *
         * - Employee can gain additional employee-related properties.
         * - SalaryCalculator can change its calculation logic.
         *
         * This separation does not automatically make the design perfect.
         * It demonstrates how identifying distinct responsibilities can
         * reduce unnecessary coupling.
         *
         * The remaining SOLID principles address other design problems:
         *
         * SRP: How should responsibilities be separated?
         * OCP: How can behavior be extended without repeatedly modifying
         *      existing, stable code?
         * LSP: Can a subtype safely replace its base type?
         * ISP: Are interfaces forcing classes to implement irrelevant methods?
         * DIP: Do important business rules depend directly on implementation
         *      details, or on abstractions?
         *
         * SOLID principles are guidelines, not absolute rules.
         * Applying them indiscriminately can introduce unnecessary classes,
         * interfaces, and abstractions.
         *
         * The goal is to improve design where the expected benefits justify
         * the additional complexity.
         */
    }

    record Employee(String name, double monthlySalary) {

    }

    static class SalaryCalculator {

        public double calculateAnnualSalary(Employee employee) {
            return employee.monthlySalary() * 12;
        }
    }
}