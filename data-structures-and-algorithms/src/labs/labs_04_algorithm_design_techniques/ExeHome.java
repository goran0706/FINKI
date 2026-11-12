package labs.labs_04_algorithm_design_techniques;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

/*
Дадени се N задачи кои треба да се извршат една по една (секвенцијално).
За секоја задача i се познати нејзиното време на извршување (Ti) и нејзината тежина на приоритет (Wi).

Првата задача во редоследот започнува со извршување во време t = 0.
Секоја следна задача започнува веднаш по завршувањето на претходната.

Цената на извршување за поединечна задача се пресметува како: Цена=(време на почеток на задачата)×(тежина на приоритет)

Напишете програма која ќе го одреди оптималниот редослед на извршување на задачите
така што вкупната цена (сумата од цените на сите задачи) ќе биде минимална.

Влез:
    Во првата линија е даден бројот на задачи N.
    Во следните N редови се дадени по два цели броја одделени со празно место:
        времето на извршување Ti и тежината на приоритетот Wi за соодветната задача.

Излез:
    Цел број кој ја претставува најмалата можна вкупна цена за извршување на сите задачи.

Пример:

Влез:
3
2 3
1 2
4 1

Излез:
6

Објаснување:

Оптимален редослед:
- задача 1 (време 1, тежина 2) почнува во време 0. Цена=0×2=0.
- задача 0 (време 2, тежина 3) почнува во време 1. Цена=1×3=3.
- задача 2 (време 4, тежина 1) почнува во време 1 + 2 = 3. Цена=3×1=3.
Вкупна цена = 0 + 3 + 3 = 6

-------------------------------------------------

You are given N tasks that must be executed sequentially (one after another). For each task i, its execution time (Ti) and its priority weight (Wi) are given.
The first task in the sequence begins execution at time t = 0. Every subsequent task begins immediately after the preceding task completes.
The execution cost of an individual task is calculated as: Cost=(start time of the task)×(priority weight)
Write a program to find an optimal sequence for executing all tasks such that the total cost (the sum of costs across all tasks) is minimized.
Input: The first line contains an integer N, the number of tasks. The next N lines each contain two space-separated integers: the execution time Ti and the priority weight Wi of a task.
Output: A single integer representing the minimum total cost to execute all tasks.

Example:
Input:
3
2 3
1 2
4 1

Output:
6

Explanation:
Optimal execution sequence:
- Task with (T=1, W=2) starts at t = 0. Cost=0×2=0.
- Task with (T=2, W=3) starts at t = 1. Cost=1×3=3.
- Task with (T=4, W=1) starts at t = 1 + 2 = 3. Cost=3×1=3.
Total cost = 0 + 3 + 3 = 6.

For example:
Input
3
2 3
1 2
4 1

Result
6
*/

public class ExeHome {
    static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        List<Task> tasks = new ArrayList<>();

        long n = scanner.nextInt();

        for (int i = 0; i < n; i++) {
            int time = scanner.nextInt();
            int weight = scanner.nextInt();
            tasks.add(new Task(time, weight));
        }

        tasks.sort((a, b) -> Long.compare((long) a.time * b.weight, (long) b.time * a.weight));

        long totalCost = 0;
        long currentTime = 0;

        for (Task task : tasks) {
            totalCost += currentTime * task.weight;
            currentTime += task.time;
        }

        System.out.println(totalCost);

        scanner.close();
    }
}
