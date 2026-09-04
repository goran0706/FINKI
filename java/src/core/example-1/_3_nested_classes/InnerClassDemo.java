package lessons._3_nested_classes;

public class InnerClassDemo {
    public static void main(String[] args) {
        // To create an instance of an inner class first create an instance of the outer class
        var country = new Country();
        country.countryName = "Russia";
        country.countryPresident = "Putin";

        // Using the outer class create an instance of the inner class
        var citizen1 = country.new Citizen();
        var citizen2 = country.new Citizen();

        citizen1.name = "Vlad";
        citizen2.name = "Alek";

        citizen1.citizenCountryName();
        citizen2.citizenCountryName();

        // Static Citizen Class
        var staticCitizen = new StaticCountry.Citizen();
        staticCitizen.country = country;
        System.out.println(staticCitizen.country.countryName);
        System.out.println(staticCitizen.country.countryPresident);
    }
}
