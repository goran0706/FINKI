package playground.exercises._08_midterm_1;

/*
Даден е процесор кој извршува задачи. Процесорот може да извршува само една задача во еден момент.

Задачите може да бидат прекинати од други задачи, при што моменталната задача се паузира и процесорот ја извршува задача што го предизвикала прекинот. Потоа паузираната задачата продолжува со извршување.

Дадени се логови за работата на процесорот во формат

job_name command timestamp

Притоа се можни следните команди:

    start - почнува да се извршува задача
    interrupt - задачата е прекината од друга, почнува да се извршува другата задача
    finish - завршува задача

Ваша задача е да се одреди колку време се извршувала секоја задача. Времето на извршување се пресметува како разлика од времето на завршување и времето на почнување. Задачите и нивното време испечатете ги во обратен редослед од времето на завршување (таа што завршила последна се печати прва). Една задача се извршува само еднаш, нема да почне или да заврши повеќе пати.

Влез:

На влез прво е бројот на логови. Потоа во секој ред е даден по еден лог во формат

job_name command timestamp

Излез:

На излез треба да се испечати името на задачата и времето на извршување. Времето на извршување се добива како разлика од времето на завршување и времето на почнување. Задачите и нивното време испечатете ги во обратен редослед од времето на завршување (таа што завршила последна се печати прва).

Пример:

Влез:

6
job0 start 0
job1 interrupt 2
job1 finish 5
job2 interrupt 6
job2 finish 7
job0 finish 10

Излез:

job0 6
job2 1
job1 3

Објаснување:

    job0 се извршува од 0-2, 5-6 и 7-10
    job1 се извршува 2-5
    job2 се извршува 6-7

=========================================

A CPU executes jobs. The CPU can execute only one job at any given moment.

Jobs can be interrupted by other jobs, in which case the current job is paused, and the CPU executes the job that caused the interruption. The paused job then resumes execution later.

Logs for the CPU's work are given in the format:

job_name command timestamp

The following commands are possible:

    start: A job begins execution.
    interrupt: The current job is interrupted by another job; the other job begins execution.

    finish: A job completes execution.

Your task is to determine how long each job executed. The execution time is calculated as the difference between the finish time and the start time. Jobs and their execution times should be printed in reverse order of their completion time (the job that finished last is printed first). Each job executes only once, it won't start or finish multiple times.

Input:

First, the number of logs is given. Then, in each line, one log is given in the format:

job_name command timestamp

Output:

The job name and its execution time should be printed. The execution time is obtained as the difference between the finish time and the start time. Jobs and their times must be printed in reverse order of their completion time (the job that finished last is printed first).

Example:

Input:

6
job0 start 0
job1 interrupt 2
job1 finish 5
job2 interrupt 6
job2 finish 7
job0 finish 10

Output:

job0 6
job2 1
job1 3

Explanation:

    job0 executes from 0-2, 5-6, and 7-10.
    job1 executes from 2-5.

    job2 executes from 6-7.

For example:
Input 	Result

6
job0 start 0
job1 interrupt 2
job1 finish 5
job2 interrupt 6
job2 finish 7
job0 finish 10




job0 6
job2 1
job1 3

6
job0 start 0
job1 interrupt 2
job2 interrupt 6
job2 finish 7
job1 finish 8
job0 finish 10



job0 4
job1 5
job2 1
*/

public class Exe7 {
}
