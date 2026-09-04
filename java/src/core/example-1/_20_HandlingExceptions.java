package lessons;

import java.io.IOException;

public class _20_HandlingExceptions {
    public static void main(String[] args) {
        try {
            exceptionExampleMethod();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            System.out.println("Run anyway");
        }
    }

    public static void exceptionExampleMethod() throws IOException {
        throw new IOException();
    }
}
