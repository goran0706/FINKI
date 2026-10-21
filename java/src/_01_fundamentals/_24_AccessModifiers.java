package _01_fundamentals;

public class _24_AccessModifiers {

    /*
     * Java has four access levels:
     *
     * 1. private
     *    Accessible only within the declaring class.
     *
     * 2. Default (package-private)
     *    When no access modifier is specified, accessible only
     *    within the same package.
     *
     * 3. protected
     *    Accessible within the same package and by subclasses
     *    in other packages, subject to Java's protected-access rules.
     *
     * 4. public
     *    Accessible from anywhere, provided the declaring type
     *    and its enclosing types are accessible.
     */

    private final String privateField = "Private";
    public String publicField = "Public";
    protected String protectedField = "Protected";
    String defaultField = "Default";

    private void privateMethod() {
        System.out.println(privateField);
    }

    void defaultMethod() {
        System.out.println(defaultField);
    }

    protected void protectedMethod() {
        System.out.println(protectedField);
    }

    public void publicMethod() {
        System.out.println(publicField);
    }
}