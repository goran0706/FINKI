package playground.exercises._08_midterm_1;

/*
Потребно е да се оптимизира одржувањето на N машини. Процесот на одржување се извршува во две фази - подесување и калибрација.

Подесувањето се прави рачно и во еден ден може да се работи само на подесување на една машина. Откако машината ќе биде подесена, калибрацијата се извршува автоматски и може да се одвива паралелно со други задачи.

За секоја машина е дадено времето во денови потребно за подесување и за калибрација. Да се одреди минималното време за да се заврши одржувањето на сите машини.

Влез:

На влез прво е даден бројот на машини, па за секоја машина времето во денови за подесување, па времето за калибрација. Форматот е

setup_time calibration_time

Излез:

На излез треба да се испечати минималниот број на денови за одржување на сите машини.

Пример:

Влез:

3
1 2
4 3
3 1

Излез:

9

Објаснување:

Еден оптимален редослед е: прво се подесува втората машина почнувајќи од првиот ден (денови 1, 2, 3 и 4), а потоа се калибрира следните 3 (5, 6 и 7). Првата машина се подесува во ден 5, а се калибрира ден 6 и 7. Последната машина се подесува денови 6, 7 и 8 и се калибрира ден 9.

=========================================

The maintenance of N machines must be optimized. The maintenance process is executed in two phases: setup and calibration.

Setup is performed manually, and in one day, work can be done on the setup of only one machine. Once a machine has been set up, calibration is performed automatically and can run in parallel with other tasks.

For each machine, the time required for setup and for calibration, both in days, is given. Determine the minimum time required to complete the maintenance of all machines.



Input:

First, the number of machines is given, and then for each machine, the time in days for setup, followed by the time for calibration. The format is:

setup_time calibration_time

Output:

The minimum number of days required to complete the maintenance of all machines should be printed.

Example:

Input:

3
1 2
4 3
3 1





Output:

9


Explanation:

One optimal order is: first, the second machine is set up starting from the first day (days 1, 2, 3, and 4), and then it is calibrated for the next 3 (days 5, 6, and 7). The first machine is set up on day 5, and it is calibrated on days 6 and 7. The last machine is set up on days 6, 7, and 8, and it is calibrated on day 9.

For example:
Input 	Result

3
1 2
4 3
3 1



9

4
1 2
2 1
3 2
2 1



9
*/
public class Exe8 {
}
