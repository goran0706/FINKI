package _2_classes._1_inner_classes;

public class Main {
    public static void main(String[] args) {
        OuterClass myOuter = new OuterClass();
        OuterClass.InnerClass myInner = myOuter.new InnerClass();
        System.out.println(myInner.y + myOuter.x);


        Country usa = new Country();
        usa.countryName = "United States of America";
        usa.countryAbbreviation = "USA";

        Country.Citizen citizen = usa.new Citizen();
        citizen.name = "John";
        citizen.country = usa;

        citizen.citizenCountryName();
        citizen.citizenCountryAbbreviation();
        citizen.citizenCountry();
    }
}
