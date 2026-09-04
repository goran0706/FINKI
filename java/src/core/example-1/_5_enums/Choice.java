package lessons._5_enums;

public enum Choice {
    // How to pass an argument to an enum constructor?
    //  Each constant represents an instance of the Choice enum.
    //  The constructor is called each time we create a constant.
    YES("Awesome"), NO("Sad"), MAYBE("Neutral"), yes("Awesome");

    private final String feeling;

    // Only Private or Default access modifier are allowed
    Choice(String feel) {
        feeling = feel;
    }

    void howUserFeels() {
        System.out.println(feeling);
    }
}
