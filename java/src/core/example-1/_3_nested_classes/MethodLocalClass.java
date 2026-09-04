package lessons._3_nested_classes;

public class MethodLocalClass {
    public static void main(String[] args) {
        Person p = new Person();
        p.talk();
    }
}

class Person {
    String name;
    int age;

    void talk() {
        class Office {
            int salary;
            String company;
        }

        var office = new Office();
        office.salary = 100_000;
        office.company = "Company";

        System.out.println("Hello");
        System.out.println(office.salary);
        System.out.println(office.company);
    }
}
