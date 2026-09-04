package _4_enums;

public enum Choice {
    // Each constant represents an instance of the Enum, so we pass the constructor arguments here.
    YES("Good..."), NO("Nah..."), MAYBE("Confused...");

    private final String mood;

    // Access modifiers can only be default or private
    Choice(String mood) {
        this.mood = mood;
    }

    void getUserMood() {
        System.out.println(mood);
    }
}
