package lessons;

public class _8_RepetitionControlStatements {
    public static void main(String[] args) {
        //The while loop
        //The do-while loop
        //The for loop

        int count = 0;

        while (count < 10) {
            System.out.println("count is " + count);
            count++;
        }//end while


        do {
            System.out.println("count is " + count);
            count--;
        } while (count > 0);//end do

        for (int i = 0; i < 10; i++) {
            System.out.println("count is " + i);
        }//end for
    }//end main
}//end class
