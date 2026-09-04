package _4_enums;

public class Main {
    public static void main(String[] args) {
        Choice userChoiceYes = Choice.YES;
        Choice userChoiceYes2 = Choice.valueOf("YES");
        Choice userChoiceNo = Choice.NO;

        userChoiceYes.getUserMood();
        userChoiceYes2.getUserMood();
        userChoiceNo.getUserMood();

        System.out.println(userChoiceYes);
        System.out.println(userChoiceYes2);
        System.out.println(userChoiceNo);

        var choice = Choice.YES;
        var position = choice.ordinal(); // ordinal method returns the position of each constant in the enum
        System.out.println(position);
    }
}
