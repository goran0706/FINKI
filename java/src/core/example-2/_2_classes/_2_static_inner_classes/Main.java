package _2_classes._2_static_inner_classes;

public class Main {
    public static void main(String[] args) {
        Country usa = new Country();
        usa.countryName = "United States of America";
        usa.countryAbbreviation = "USA";

        Country.Citizen citizen = new Country.Citizen();
        citizen.name = "John";
        citizen.country = usa;

        System.out.println(citizen.name);
        System.out.println(citizen.country);

        OuterClass.InnerClass myInner = new OuterClass.InnerClass();
        System.out.println(myInner.y);
    }
}
