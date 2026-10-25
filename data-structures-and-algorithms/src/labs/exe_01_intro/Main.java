package labs.exe_01_intro;

import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.util.Scanner;

/*
Да се напише програма за пресметка на плати во софтверската компанија FINKI Soft.

Класата Employee е основната класа. Секој вработен има:

    id (String)
    name (String)
    baseSalary (double)

Методот calculateSalary() ја враќа основната плата. Методот toString() враќа текст во формат ID NAME salary=SALARY, каде SALARY е резултатот од calculateSalary(), печатен на 2 децимали.

Класата Developer наследува од Employee и има дополнителен атрибут overtimeHours (int). Платата се пресметува како основната плата плус 300 за секој прекувремен час. На toString() се додава overtime=H.

Класата TeamLead наследува од Developer и има дополнителен атрибут teamSize (int). Платата е платата од Developerплус 1000 за секој член на тимот. Ако тимот има 5 или повеќе членови, вкупната плата се зголемува за 5%. На toString() се додава team=T.

Класата Intern наследува од Employee и има дополнителен атрибут months (int). Практикантот добива 60% од основната плата, или 80% ако е во компанијата 6 или повеќе месеци. На toString() се додава months=M.

Класата Company ги чува вработените во низа Employee[]. Се креира со име и капацитет. Треба да ги има следниве методи:

    hire(Employee e) – додава вработен
    printAll() – печати === NAME ===, а потоа секој вработен во посебен ред
    printStatistics() – печати Developers: X, Team leads: Y, Interns: Z, Others: W. Водачите на тимови не се бројат како програмери, а Others се обичните вработени.
    totalPayroll() – збир на сите плати
    averageSalary() – просечна плата
    highestPaid() – вработениот со највисока плата; при еднаквост се враќа првиот
    countAbove(double threshold) – број на вработени со плата строго поголема од прагот

Сите конструктори на изведените класи мора да го повикаат super(...). Сите пресметки во изведените класи мора да го користат super.calculateSalary(). Не смеат да се користат генерици (ArrayList<>, List<> итн.).

Влез:

    во првиот ред е N, бројот на вработени
    потоа следуваат N редови, секој во еден од следниве формати:
        E id name base
        D id name base overtime
        L id name base overtime teamSize
        I id name base months
    во последниот ред е прагот X

Излез:
Се креира компанија со име FINKI Soft и се печати по следниов редослед:

    листата на вработени (printAll)
    статистиката (printStatistics)
    Total payroll: TOTAL
    Average salary: AVG
    Highest paid: ID NAME (SALARY)
    Employees with salary above X: COUNT

Сите децимални броеви се печатат на 2 децимали.

Write a program that calculates salaries in the software company FINKI Soft.

The class Employee is the base class. Each employee has:

    id (String)
    name (String)
    baseSalary (double)

The method calculateSalary() returns the base salary. The method toString() returns a string in the format ID NAME salary=SALARY, where SALARY is the result of calculateSalary(), printed with 2 decimals.

The class Developer extends Employee and adds the attribute overtimeHours (int). The salary is the base salary plus 300 per overtime hour. toString() appends overtime=H.

The class TeamLead extends Developer and adds the attribute teamSize (int). The salary is the Developer salary plus 1000 per team member. If the team has 5 or more members, the total salary is increased by 5%. toString() appends team=T.

The class Intern extends Employee and adds the attribute months (int). An intern receives 60% of the base salary, or 80% if they have been with the company 6 or more months. toString() appends months=M.

The class Company stores employees in an Employee[] array. It is created with a name and a capacity. It must have the following methods:

    hire(Employee e) – adds an employee
    printAll() – prints === NAME ===, then each employee on a separate line
    printStatistics() – prints Developers: X, Team leads: Y, Interns: Z, Others: W. Team leads are not counted as developers, and Others are plain employees.
    totalPayroll() – the sum of all salaries
    averageSalary() – the average salary
    highestPaid() – the employee with the highest salary; on a tie, return the first one
    countAbove(double threshold) – the number of employees whose salary is strictly greater than the threshold

All subclass constructors must call super(...). All subclass calculations must use super.calculateSalary(). Generics are not allowed (ArrayList<>, List<>, etc.).

Input:

    the first line contains N, the number of employees
    then follow N lines, each in one of these formats:
        E id name base
        D id name base overtime
        L id name base overtime teamSize
        I id name base months
    the last line contains the threshold X

Output:
Create a company named FINKI Soft and print the following, in this order:

    the list of employees (printAll)
    the statistics (printStatistics)
    Total payroll: TOTAL
    Average salary: AVG
    Highest paid: ID NAME (SALARY)
    Employees with salary above X: COUNT

All decimal values are printed with 2 decimals.
*/
public class Main {
    // Notes:
    // Use old syntax e.g. Java SE 8 or similar
    // Courses/ispit will complain for short static void main()
    static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int n = scanner.nextInt();
        Company company = new Company("FINKI Soft", n);

        for (int i = 0; i < n; i++) {
            String type = scanner.next();
            String id = scanner.next();
            String name = scanner.next();
            double baseSalary = scanner.nextDouble();

            // use regular switch or if
            // do not use lambda with switch
            switch (type) {
                case "E":
                    company.hire(new Employee(id, name, baseSalary));
                    break;

                case "D": {
                    int overtime = scanner.nextInt();
                    company.hire(new Developer(id, name, baseSalary, overtime));
                    break;
                }

                case "L": {
                    int overtime = scanner.nextInt();
                    int teamSize = scanner.nextInt();
                    company.hire(new TeamLead(id, name, baseSalary, overtime, teamSize));
                    break;
                }

                case "I": {
                    int months = scanner.nextInt();
                    company.hire(new Intern(id, name, baseSalary, months));
                    break;
                }

                default:
                    throw new IllegalArgumentException("Unknown employee type: " + type);
            }
        }

        double threshold = scanner.nextDouble();

        DecimalFormat formatter = new DecimalFormat("0.00");
        formatter.setRoundingMode(RoundingMode.HALF_UP);

        company.printAll();
        company.printStatistics();
        System.out.println("Total payroll: " + formatter.format(company.totalPayroll()));

        // System.out.println("Average salary: " + formatter.format(Math.ceil(company.averageSalary())));
        System.out.println("Average salary: " + formatter.format(company.averageSalary()));

        Employee highestPaid = company.highestPaid();
        System.out.println("Highest paid: " + highestPaid.getId() + " " + highestPaid.getName() + " " + "(" + formatter.format(highestPaid.calculateSalary()) + ")");
        System.out.println("Employees with salary above " + formatter.format(threshold) + ": " + company.countAbove(threshold));

        scanner.close();
    }
}

// TEST DATA
//4
//E 1 John 100
//D 2 Jane 100 10
//L 3 Tom 100 20 5
//I 4 Ana 100 6
