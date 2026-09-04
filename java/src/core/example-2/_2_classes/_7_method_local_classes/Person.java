package _2_classes._7_method_local_classes;

public class Person {
    String name;
    int age;

    void talk() {
        class Office {
            int salary;
            String company;

            @Override
            public String toString() {
                return "Office{" +
                        "salary=" + salary +
                        ", company='" + company + '\'' +
                        '}';
            }
        }

        Office office = new Office();
        office.salary = 10_000;
        office.company = "Company";

        System.out.println(office);
    }
}
