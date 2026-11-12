package aud.aud_02_one_dimensional_data_structures.Queue;

// Задача 3)
// Студентската служба на факултет работи со студенти од 09:00 до 12:00.
// Ако знаеме за секој студент од редицата колку време е потребно за студентската служба да го опслужи,
// да се одреди кој студент ќе биде првиот студент кој нема да биде опслужен и колку студенти што чекале
// во редицата за тој ден не се опслужени.

// Задача 4)
// Да се одреди колку работно време (во минути) е потребно на студентската служба за да ги опслужи студентите
// кои не биле опслужени за тој ден.

import impl.Queue.ArrayQueue;
import impl.Queue.Queue;

import java.util.Scanner;

record Student(String name, int serviceTime) {
}

public class StudentService {
    static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = sc.nextInt();

        Queue<Student> queue = new ArrayQueue<>(n);

        for (int i = 0; i < n; i++) {
            String name = sc.next();
            int serviceTime = sc.nextInt();

            queue.enqueue(new Student(name, serviceTime));
        }

        // ===================== SOLUTION ========================

        // The student service operates from 09:00 to 12:00 (180 minutes).
        int remainingTime = 180;

        // Serve students while there is enough working time.
        while (!queue.isEmpty() && queue.peek().serviceTime() <= remainingTime) {
            Student student = queue.dequeue();
            remainingTime -= student.serviceTime();
        }

        // Task 3: Find the first unserved student and count unserved students.
        System.out.println("First unserved student: " + (queue.isEmpty() ? "None" : queue.peek().name()));
        System.out.println("Unserved students: " + queue.size());

        // Task 4: Calculate the additional working time required.
        int additionalTime = 0;

        for (int i = 0; i < queue.size(); i++) {
            Student student = queue.dequeue();
            additionalTime += student.serviceTime();
        }

        System.out.println("Additional working time: " + additionalTime + " minutes");
    }
}
