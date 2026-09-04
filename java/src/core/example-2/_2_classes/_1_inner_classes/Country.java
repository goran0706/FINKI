package _2_classes._1_inner_classes;

// Static class in Java is a nested class, and it doesn't need the reference of the outer class.
// Static class can access only the static members of its outer class.
// Static class cannot access the non-static member of the outer classes.
// Inner classes can access the static and the non-static members of the outer class.
// An inner class can also be static, which means that you can access it without creating an object of the outer class.
// One advantage of inner classes, is that they can access attributes and methods of the outer class.
public class Country {
    String countryName;
    String countryAbbreviation;

    @Override
    public String toString() {
        return "Country{" +
                "countryName='" + countryName + '\'' +
                ", countryAbbreviation='" + countryAbbreviation + '\'' +
                '}';
    }

    public class Citizen {
        String name;
        Country country;

        void citizenCountryName() {
            System.out.println(countryName);
        }

        void citizenCountryAbbreviation() {
            System.out.println(countryAbbreviation);
        }

        void citizenCountry() {
            System.out.println(country);
        }
    }
}
