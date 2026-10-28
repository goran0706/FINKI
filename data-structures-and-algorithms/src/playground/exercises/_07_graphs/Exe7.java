package playground.exercises._07_graphs;

/*
Даден е софтверски проект што се состои од повеќе модули. За секој модул е потребно одредено време да се компајлира, а модулите може да се зависни од други модули (не може да се компајлира модул 2 пред да се заврши компајлирањето на модул 1). Да се одреди колку најмалку време е потребно да се компајлира целиот проект ако независните модули може да се компајлираат паралелно.


Влез: Во првиот ред е даден бројот на модули N. Потоа во следните N редови се дадени модулите и времето што е потребно за компајлирање на секој модул. Во следниот ред е даден бројот на зависности M, а потоа во следните M редови се дадени зависностите. (Модул2 Модул1 значи дека Модул2 зависи од Модул1).

Излез:  Минималното време да се компајлира целиот проект.

Пример:

Влез:

5
Module1 3
Module2 5
Module3 2
Module4 7
Module5 4
2
Module2 Module1
Module4 Module3

Излез: 9

(Објаснување: модулите 1, 3 и 5 може да се почнат паралелно. По компајлирање на модул 1, може да се почне модул 2, на кој му е потребно минимално време (5+3) 8. Модул 4 може да почне да се компајлира по компајлирање на модул 3 и минималното потребно време ќе биде (2 + 7) 9 . Затоа што модул 1 и 2 и модул 3 и 4 може да се компајлираат паралелно, а паралелно се компајлира и модул 5, минималното време да се компајлира целиот проект ќе биде 9.)


/

You're given a software project that consists of multiple modules. Each module takes a certain amount of time to compile, and modules can be dependent on each other (can't start compiling module 2 before module 1 is compiled). Determine the minimum time to compilethe entire project if it's possible to compile independent modules in parallel.


Input: The first line contains the number of modules N. The next N lines contain the names of the modules and the time needed for each module. The next line contains the number of dependencies M, followed by M lines that contain the dependencies. (Module2 Module1 means that Module2 depends on Module1)

Output: The minimum time to compile the project.

Example:

Input:

5
Module1 3
Module2 5
Module3 2
Module4 7
Module5 4
2
Module2 Module1
Module4 Module3

Output: 9

(Explanation: modules 1, 3 and 5 can be compiled in parallel. After module 1 is done, module 2 can be compiled, and the minimum time needed for it will be (5+3) 8. Module 4 can start after module 3 and needs a minimum time of (2 + 7) 9. Because modules 1 and 2 and modules 3 and 4 can be compiled in parallel, and module 5 can also be compiled in parallel, the minimum time to compile the entire project is 9.)

For example:
Input 	Result

5
Module1 3
Module2 5
Module3 2
Module4 7
Module5 4
2
Module2 Module1
Module4 Module3



9

5
ModuleA 3
ModuleB 2
ModuleC 4
ModuleD 5
ModuleE 1
4
ModuleC ModuleA
ModuleC ModuleB
ModuleD ModuleC
ModuleE ModuleB



12


*/
public class Exe7 {
}
