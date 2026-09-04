public class _18_StringBuilder {
    public static void main(String[] args) {
        // String objects are immutable (cannot be modified)
        // StringBuilder is the mutable counterpart to String (can be modified)

        StringBuilder sb = new StringBuilder("John");
        sb.append("Doe");
        sb.insert(4, " ");
        sb.replace(0, 4, "Jane");
        sb.insert(8,"!");
        sb.delete(8, 9);

        System.out.println(sb);
    }
}
