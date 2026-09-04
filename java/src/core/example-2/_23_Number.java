public class _23_Number {
    public static void main(String[] args) {
        // The wrapper classes: Integer, Double, Float, Long, Short, Byte all inherit from an Abstract class called Number.
        // Since Number is a superclass of these Wrapper classes, it can be a reference to objects of these Wrapper classes.

        Integer i = 7;
        // Double d = i;
        Number d = i;

        System.out.println(d);
        System.out.println(i.getClass());
        System.out.println(d.getClass());
    }
}
