package labs.labs_03_one_dimensional_data_structures;

import impl.Queue.ArrayQueue;

import java.util.Scanner;

/*
    Дадени се N процеси, каде секој процес е претставен со име и време потребно за негово извршување.
    Процесите се обработуваат според принципот на редица, по редоследот на нивното внесување. (FIFO)

    Процесорот во секој круг обработува еден процес најмногу T временски единици.
    Доколку процесот не е завршен, преостанатото време се намалува за T, а процесот се додава на крајот од редицата.
    Доколку процесот е завршен, неговото име се печати.

    Ваша задача е да го определите редоследот по кој завршуваат процесите.
*/

public class ExeHome {
    static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        int n = input.nextInt();
        int t = input.nextInt();

        ArrayQueue<Process> queue = new ArrayQueue<>(n);

        for (int i = 0; i < n; i++) {
            String name = input.next();
            int time = input.nextInt();
            queue.enqueue(new Process(name, time));
        }

        int sequenceNo = 1;

        while (!queue.isEmpty()) {
            Process curr = queue.dequeue();

            if (curr.time <= t) {
                System.out.println(sequenceNo + " " + curr.name);
                sequenceNo++;
            } else {
                curr.time -= t;
                queue.enqueue(curr);
            }
        }
    }
}
