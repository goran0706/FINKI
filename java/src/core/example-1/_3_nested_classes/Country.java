package lessons._3_nested_classes;

public class Country {
    String countryName;
    String countryPresident;

    public class Citizen {
        String name;

        void citizenCountryName() {
            System.out.println(countryName);
        }

        void citizenCountryPresident() {
            System.out.println(countryPresident);
        }
    }
}