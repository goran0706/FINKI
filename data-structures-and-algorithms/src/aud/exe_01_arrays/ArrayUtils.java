package aud.exe_01_arrays;

import java.util.Objects;

public class ArrayUtils {
    public static void changeArrays(Array<?> a, Array<?> b) {
        if (a.getSize() != b.getSize()) {
            throw new IllegalArgumentException("Array sizes do not match");
        }

        int size = a.getSize();

        for (int i = 0; i < size; ) {
            if (Objects.equals(a.get(i), b.get(i))) {
                a.delete(i);
                b.delete(i);
                size--;
            } else {
                i++;
            }
        }

//        or backwards
//        for (int i = a.getSize() - 1; i >= 0; i--) {
//            if (Objects.equals(a.get(i), b.get(i))) {
//                a.delete(i);
//                b.delete(i);
//            }
//        }
    }
}
