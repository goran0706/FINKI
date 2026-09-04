package _3_interfaces._9_extending_interfaces;

public class DemoClass implements SecondInterface {
    @Override
    public void foo() {
        System.out.println("FirstInterface");
    }

    @Override
    public void bar() {
        System.out.println("SecondInterface");
    }
}
