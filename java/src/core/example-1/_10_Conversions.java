package lessons;

public class _10_Conversions {
    public static void main(String[] args) {
        String str1 = "10";
        String str2 = "20";
        int result;

        // Converting a string to an integer
        int i = Integer.parseInt(str1);
        int j = Integer.parseInt(str2);
        result = i + j;

        System.out.println(result);

        // Converting an integer to a string
        str1 = String.valueOf(i);
        str2 = String.valueOf(j);

        System.out.println(str1 + str2);
    }
}
