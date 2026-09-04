package lessons._5_enums;

public class EnumsDemo {
    public static void main(String[] args) {
        DayOfWeek d = DayOfWeek.MONDAY;
        Colors c = Colors.BLUE;

        System.out.println("On " + d + " the sky was " + c);

        Choice userChoice = Choice.YES;
        userChoice.howUserFeels();
        var position = userChoice.ordinal(); // ordinal method returns the position of each constant in the enum
        System.out.println(position);

        Choice secondUserChoice = Choice.valueOf("YES");
        Choice thirdUserChoice = Choice.valueOf("yes");

        System.out.println(userChoice);
        System.out.println(secondUserChoice);
        System.out.println(thirdUserChoice);
    }
}
