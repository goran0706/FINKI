package lessons._3_nested_classes;

public class StaticCountry {
    String countryName;
    String countryPresident;

    public static class Citizen {
        String name;
        Country country;
    }
}
