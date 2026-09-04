package _2_classes;

public class ComparingObjects {
    public static void main(String[] args) {
        String str1 = "Object 1";
        String str2 = "Object 2";
        String str3 = str2;

        System.out.println(str1 == str2);
        System.out.println(str2 == str3);

        System.out.println(str1.equals(str2));
        System.out.println(str2.equals(str3));

        /*
         * == operator checks if both object references point to the same address in memory
         * equals method check if the content of the objects is the same. Usually we need to override the equals and hashCode methods.
         * */
    }
}
