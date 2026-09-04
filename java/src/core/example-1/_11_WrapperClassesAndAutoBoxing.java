package lessons;

public class _11_WrapperClassesAndAutoBoxing {
    int x = 10;
    Integer x1 = Integer.valueOf(10);
    Integer x2 = Integer.valueOf(x);


    boolean bp = true;
    Boolean bw = Boolean.valueOf(bp);

    boolean unbp = bw;
}
