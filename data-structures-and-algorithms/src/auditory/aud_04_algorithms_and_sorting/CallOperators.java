package aud.aud_04_algorithms_and_sorting;

import impl.Queue.LinkedQueue;
import impl.Queue.Queue;

import java.util.Scanner;

public class CallOperators {
    static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int n = scanner.nextInt();
        int totalOperators = scanner.nextInt();

        Queue<String> queue = new LinkedQueue<>();
        int busyOperators = 0;

        scanner.nextLine();

        for (int i = 0; i < n; i++) {
            String[] parts = scanner.nextLine().trim().split("\\s+");

            switch (parts[0]) {
                case "call":
                    queue.enqueue(parts[1]);
                    break;

                case "start":
                    if (!queue.isEmpty() && busyOperators < totalOperators) {
                        queue.dequeue();
                        busyOperators++;
                    }
                    break;

                case "end":
                    if (busyOperators > 0) {
                        busyOperators--;
                    }
                    break;

                case "status":
                    System.out.println("status:");
                    System.out.println("busy operators: " + busyOperators);
                    System.out.println("clients waiting: " + queue.size());
                    break;
            }
        }

        scanner.close();
    }
}