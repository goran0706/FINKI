public class _9_ControlStatements {
    public static void main(String[] args) {
        // Control statements
        // 1) Control flow - the order in which instructions are executed within a program
        // 2) With control statements, we can produce exciting and sophisticated applications

        // 3 Categories of Control statements
        // 1) Sequential (Sequence)
        // 2) Selection (Decision)
        // 3) Repetition (Loops)

        // Sequence
        int age = 15;
        System.out.println(age);

        // Decision
        if (age >=16) {
            System.out.println("You can drive.");
        } else {
            System.out.println("You cannot drive yet!");
        }

        // Repetition
        for (int i = 0; i <= age; i++) {
            System.out.println(i);
        }
    }
}
