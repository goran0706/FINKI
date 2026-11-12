package aud.aud_01_arrays_and_lists.dll;


import impl.DLL.DLL;
import impl.DLL.DLLNode;

public class Palindrome {
    // Дадена е двоjно поврзана листа со N jазли каде секоj jазел содржи по еден броj.
    // Да се провери дали двоjно поврзаната листа е палиндром:
    // односно ако jа изминете од почеток до краj и од краj до почеток, дали ќе го добиете истото.

    private static boolean isPalindromeOne(DLL<Integer> list) {
        DLLNode<Integer> first = list.getFirst();
        DLLNode<Integer> last = list.getLast();

        while (first != last && first.getPred() != last) {
            if (!first.getElement().equals(last.getElement())) {
                return false;
            }
            first = first.getSucc();
            last = last.getPred();
        }

        return true;
    }

    private static boolean isPalindromeTwo(DLL<Integer> list) {
        DLLNode<Integer> node = list.getFirst();

        int number = 0;
        int reversed = 0;

        while (node != null) {
            number = (number * 10) + node.getElement();
            node = node.getSucc();
        }

        node = list.getLast();

        while (node != null) {
            reversed = (reversed * 10) + node.getElement();
            node = node.getPred();
        }

        return number == reversed;
    }

//    private static boolean isPalindromeThree(DLL<Integer> list) {
//        for (int i = 0; i < list.getSize() / 2; i++) {
//            if (!list.get(i).equals(list.get(list.getSize() - i - 1))) {
//                return false;
//            }
//        }
//        return true;
//    }

    static void main() {
        DLL<Integer> list = new DLL<>();
        list.insertLast(1);
        list.insertLast(2);
        list.insertLast(3);
        list.insertLast(3);
        list.insertLast(2);
        list.insertLast(1);

        System.out.println(isPalindromeOne(list));
        System.out.println(isPalindromeTwo(list));
    }
}
