package labs.labs_04_algorithm_design_techniques;

/*
Дадени се N задачи кои треба да се извршат една по една (секвенцијално).
За секоја задача i се познати нејзиното време на извршување (Ti) и нејзината тежина на приоритет (Wi).

Првата задача во редоследот започнува со извршување во време t = 0.
Секоја следна задача започнува веднаш по завршувањето на претходната.

Цената на извршување за поединечна задача се пресметува како: Цена = (време на завршување на задачата) × (тежина на приоритет)

Напишете програма која ќе го одреди оптималниот редослед на извршување на задачите
така што вкупната цена (сумата од цените на сите задачи) ќе биде минимална.
Доколку повеќе редоследи ја даваат истата минимална цена, се печати оној во кој задачите со ист однос Ti/Wi
се подредени според нивниот реден број во влезот (прво онаа што е понапред внесена).

Влез
    Во првата линија е даден бројот на задачи N.
    Во следните N редови се дадени по два цели броја одделени со празно место: времето на извршување Ti и тежината на приоритетот Wi за соодветната задача.

Пример:

3
2 3
1 2
4 1

Излез
    Во првиот ред се печати најмалата можна вкупна цена.
    Во вториот ред се печатат редните броеви на задачите (од 1 до N, по редоследот на внесување),
    одделени со празно место, по редоследот по кој се извршуваат.

Пример:
18
2 1 3

Објаснување

Оптимален редослед: задача 2 (T=1, W=2), задача 1 (T=2, W=3), задача 3 (T=4, W=1).
- задача 2 завршува во време 1. Цена = 1 × 2 = 2.
- задача 1 завршува во време 1 + 2 = 3. Цена = 3 × 3 = 9.
- задача 3 завршува во време 3 + 4 = 7. Цена = 7 × 1 = 7.
Вкупна цена = 2 + 9 + 7 = 18.

You are given N tasks that must be executed sequentially (one after another). For each task i, its execution time (Ti) and its priority weight (Wi) are given.
The first task in the sequence begins execution at time t = 0. Every subsequent task begins immediately after the preceding task completes.
The execution cost of an individual task is calculated as: Cost = (finish time of the task) × (priority weight)
Write a program to find an optimal sequence for executing all tasks such that the total cost (the sum of costs across all tasks) is minimized. If several sequences give the same minimum cost, print the one in which tasks with an equal ratio Ti/Wi are ordered by their position in the input (the one entered earlier goes first).

Input
The first line contains an integer N, the number of tasks. Each of the next N lines contains two space-separated integers: the execution time Ti and the priority weight Wi of a task.

Example:

3
2 3
1 2
4 1

Output
The first line prints the minimum possible total cost. The second line prints the numbers of the tasks (from 1 to N, in input order), separated by spaces, in the order in which they are executed.

Example:
18
2 1 3

Explanation

Optimal sequence: task 2 (T=1, W=2), task 1 (T=2, W=3), task 3 (T=4, W=1).
- Task 2 finishes at t = 1. Cost = 1 × 2 = 2.
- Task 1 finishes at t = 1 + 2 = 3. Cost = 3 × 3 = 9.
- Task 3 finishes at t = 3 + 4 = 7. Cost = 7 × 1 = 7.
Total cost = 2 + 9 + 7 = 18.

For example:

Input 	Result
3
2 3
1 2
4 1

18
2 1 3

Input 	Result
1
5 7

35
1

Input 	Result
3
2 4
1 2
3 6

50
1 2 3

Input 	Result
4
4 2
1 1
2 1
1 2

24
4 2 1 3

Input 	Result
4
3 2
3 2
3 2
3 2

60
1 2 3 4

Input 	Result
4
5 1
2 1
8 1
1 1

28
4 2 1 3

Input 	Result
4
4 2
4 9
4 5
4 1

116
2 3 1 4

Input 	Result
4
1 10
2 5
4 2
8 1

54
1 2 3 4

Input 	Result
4
8 1
4 2
2 5
1 10

54
4 3 2 1

Input 	Result
3
1000000000 1000000000
1000000000 1000000000
1000000000 1000000000

6000000000000000000
1 2 3
*/

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class ExeLabs {
    static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        List<Task> tasks = new ArrayList<>();

        int n = scanner.nextInt();

        // Read tasks in their original input order.
        for (int i = 1; i <= n; i++) {
            int time = scanner.nextInt();
            int weight = scanner.nextInt();

            tasks.add(new Task(time, weight, i));
        }

        // Sort by ascending T/W ratio.
        // List.sort() is stable, preserving input order for equal ratios.
        tasks.sort((a, b) -> Long.compare((long) a.time * b.weight, (long) b.time * a.weight));

        // Calculate the minimum total execution cost.
        long totalCost = 0;
        long currentTime = 0;

        for (Task task : tasks) {
            currentTime += task.time;
            totalCost += currentTime * task.weight;
        }

        // Print the minimum cost.
        System.out.println(totalCost);

        // Print the optimal execution order.
        StringBuilder result = new StringBuilder();

        for (Task task : tasks) {
            if (!result.isEmpty()) {
                result.append(" ");
            }

            result.append(task.taskNo);
        }

        System.out.println(result);

        scanner.close();
    }
}