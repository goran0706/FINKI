package labs.exe_03_lists;

import java.util.Scanner;

/*

Дадени се две еднострано поврзани листи чии јазли содржат цели броеви. Дополнително, даден е и ненегативен реален број x.

За секој јазол од првата листа да се спореди неговата вредност a со вредноста b на јазолот на истата позиција во втората листа. Ако a е надвор од интервалот [b − x, b + x], односно ако |a − b| > x, вредноста во првата листа да се замени со текстот Outlier a, а соодветниот јазол да се избрише од втората листа. Во ознаката се задржува првичната вредност на a.

Споредбите се вршат според првичните позиции на јазлите. Бришењето јазол од втората листа не ги менува паровите што ќе се споредуваат понатаму. Ако разликата е точно x, двата јазла остануваат непроменети.

Ако првата листа има повеќе јазли од втората, вредноста на секој непроверен јазол од првата листа да се замени со Unchecked a, каде што a е неговата првична вредност. Ако втората листа е подолга, нејзините преостанати јазли остануваат непроменети.

По промените да се испечатат двете листи, прво првата, а потоа втората.

Пример за првичните позиции: За првата листа 10->20, втората листа 1->20 и x = 2, резултантната прва листа е Outlier 10->20, а резултантната втора листа е 20.

Објаснување на примерот: Прво се споредуваат јазлите со вредности 10 и 1. Бидејќи нивната разлика е поголема од 2, вредноста 10 во првата листа се заменува со Outlier 10, а јазолот со вредност 1 се брише од втората листа. Потоа се споредуваат јазлите со вредност 20 од двете листи, бидејќи тие биле на истата првична позиција. Нивната разлика е 0, па тие остануваат непроменети.

Влез: Во првиот ред е даден бројот на елементи во првата листа: N (N ≥ 0). Во следните N редови се дадени нејзините елементи. Потоа е даден бројот на елементи во втората листа: M (M ≥ 0), па во следните M редови се дадени нејзините елементи. Во последниот ред е даден реалниот број x.

Излез: Во првиот ред да се испечати првата листа по промените, а во вториот ред втората листа по промените. Елементите се одделуваат со ->. За празна листа да се испечати Prazna lista!!!.

You are given two singly linked lists whose nodes contain integers. Additionally, you are given a non-negative real number x.

For each node in the first list, compare its value a with the value b at the same position in the second list. If a is outside the interval [b − x, b + x], that is, if |a − b| > x, replace its value in the first list with the text Outlier a and remove the corresponding node from the second list. Keep the original value of a in the label.

Compare nodes by their original positions. Removing a node from the second list does not change the pairs used in later comparisons. If the difference is exactly x, both nodes remain unchanged.

If the first list is longer than the second, replace the value of every unpaired node in the first list with Unchecked a, where a is its original value. If the second list is longer, its remaining nodes stay unchanged.

After the changes, print both lists, first the first list and then the second.

Original positions example: For the first list 10->20, the second list 1->20, and x = 2, the resulting first list is Outlier 10->20 and the resulting second list is 20.

Example explained: First, compare the nodes with values 10 and 1. Their difference exceeds 2, so replace 10 in the first list with Outlier 10 and remove the node containing 1 from the second list. Next, compare the nodes containing 20 in both lists, because they occupied the same original position. Their difference is 0, so both remain unchanged.

Input: The first line contains the number of elements in the first list, N (N ≥ 0). The next N lines contain its elements. The next line contains the number of elements in the second list, M (M ≥ 0), followed by M lines containing its elements. The last line contains the real number x.

Output: Print the first list after the changes on the first line and the second list after the changes on the second line. Separate elements with ->. For an empty list, print Prazna lista!!!.

For example:
Input 	Result

1
10
1
1
2

Outlier 10
Prazna lista!!!

*/

public class Main {
    static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        SinglyLinkedList<Object> a = new SinglyLinkedList<>();
        SinglyLinkedList<Object> b = new SinglyLinkedList<>();

        // List A
        int N = scanner.nextInt();

        for (int i = 0; i < N; i++) {
            a.insertLast(scanner.nextInt());
        }

        // List B
        int M = scanner.nextInt();

        for (int i = 0; i < M; i++) {
            b.insertLast(scanner.nextInt());
        }

        // Negative number
        double x = scanner.nextDouble();

        // PSEUDO CODE:
        // aFirst = a.getFirst()
        // firstB = b.getFirst()
        // while(aFirst.next != null && aFirst.next != null) ...
        //      COMPARE a.getData == b.getData ?
        //      IF |a-b| > x
        //          a.data = "Outlier a"
        //          b.delete
        //      MOVE cursor to next node
        // CHECK larger list iterate rest elements
        // PRINT both lists

        Node<Object> currentA = a.getFirst();
        Node<Object> currentB = b.getFirst();

        while (currentA.next != null && currentB.next != null) {
            Node<Object> nextA = currentA.next;
            Node<Object> nextB = currentB.next;

            int valueA = (Integer) currentA.data;
            int valueB = (Integer) currentA.data;
            double diff = Math.abs((double) valueA - valueB);

            if (diff > x) {
                currentA.data = "Outlier " + valueA;
                b.delete(currentB);
            }

            currentA = nextA;
            currentB = nextB;
        }

//        if (a.getSize() > b.getSize()) {
//            while (currentA.next != null) {
//                int valueA = (Integer) currentA.data;
//                currentA.data = "Unchecked " + valueA;
//                currentA = currentA.next;
//            }
//        } else {
//            while (currentB.next != null) {
//                int valueB = (Integer) currentB.data;
//                currentB.data = "Unchecked " + valueB;
//                currentB = currentB.next;
//            }
//        }

        while (currentA.next != null) {
            int valueA = (Integer) currentA.data;
            currentA.data = "Unchecked " + valueA;
            currentA = currentA.next;
        }

        System.out.println(a);
        System.out.println(b);

        scanner.close();
    }
}
