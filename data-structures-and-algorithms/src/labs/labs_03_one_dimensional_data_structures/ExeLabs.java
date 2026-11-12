package labs.labs_03_one_dimensional_data_structures;

import impl.Queue.ArrayQueue;
import impl.Queue.Queue;
import impl.Stack.ArrayStack;
import impl.Stack.Stack;

import java.util.Scanner;

/*
Во еден оперативен систем пристигнуваат N процеси кои се обработуваат според принципот на редица (Queue), по редоследот на нивното внесување.
Процесорот во еден круг обработува еден процес најмногу T временски единици (квантум).
Системот води историја на прекинувања во вид на стек (Stack).

Правила:
Се зема процесот од почетокот на редицата и се извршува најмногу T временски единици.
Ако процесот заврши, неговото име се печати со реден број.
Ако квантумот истече, а процесот не е завршен, тој се враќа на крајот од редицата,
а во историјата (на врвот на стекот) се запишува пар (ИмеНаПроцес, ПреостанатоВреме), односно преостанатото време по тој квантум.
Кога сите процеси ќе завршат, се печати редоследот на завршување, а потоа содржината на стекот на историјата,
од врвот кон дното (последното прекинување прво).

Влез
Првиот ред содржи два броја: N (број на процеси) и T (времетраење на квантумот).
Во следните N редови се внесува името на процесот и времето потребно за негово извршување.

Пример:
3 2
Process-A 5
Process-B 3
Process-C 2

Излез
Прво се печати редоследот на завршување на процесите (реден број. име), потоа линијата "Undo stack:",
а по неа секој запис од историјата во посебен ред, во формат ИмеНаПроцес ПреостанатоВреме.
Записите се печатат од врвот кон дното на стекот.

Пример:
    1. Process-C
    2. Process-B
    3. Process-A
        Undo stack:
        Process-A 1
        Process-B 1
        Process-A 3

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

In an operating system, N processes arrive and are handled using a queue (Queue), in the order they were entered. In each round, the processor handles one process for at most T time units (the quantum).
The system keeps a history of preemptions in the form of a stack (Stack).

Rules:
    The process at the front of the queue is taken and runs for at most T time units.
    If the process finishes, its name is printed with a sequence number.
    If the quantum expires and the process is not finished, it is moved to the back of the queue, and a pair (ProcessName, RemainingTime), representing the remaining execution time after that quantum, is pushed onto the history stack.
    When all processes have finished, the completion order is printed, followed by the contents of the history stack from top to bottom (the most recent preemption first).

Input
The first line contains two numbers: N (the number of processes) and T (the duration of the quantum).
Each of the next N lines contains the process name and the time required for its execution.

Example:
3 2
Process-A 5
Process-B 3
Process-C 2

Output
First, print the order in which the processes finish (sequence number. name), followed by the line "Undo stack:", and then each history entry on a separate line in the format ProcessName RemainingTime. The entries must be printed from the top to the bottom of the stack.

Example:
    1. Process-C
    2. Process-B
    3. Process-A
        Undo stack:
        Process-A 1
        Process-B 1
        Process-A 3
*/
public class ExeLabs {
    static void main() {
        Scanner sc = new Scanner(System.in);

        int n = sc.nextInt();
        int t = sc.nextInt();

        Queue<Process> queue = new ArrayQueue<>(n);
        Stack<Process> stack = new ArrayStack<>(n);

        for (int i = 0; i < n; i++) {
            String name = sc.next();
            int time = sc.nextInt();

            queue.enqueue(new Process(name, time));
        }

        // Execute processes using Round Robin scheduling.
        int processNumber = 1;

        while (!queue.isEmpty()) {
            Process process = queue.dequeue();
            process.time -= t;

            if (process.time <= 0) {
                System.out.println(processNumber++ + ". " + process.name);
            } else {
                queue.enqueue(process);
                stack.push(new Process(process.name, process.time));
            }
        }

        System.out.println("Undo stack:");

        while (!stack.isEmpty()) {
            Process process = stack.pop();
            System.out.println("\t" + process.name + " " + process.time);
        }

        sc.close();
    }
}
