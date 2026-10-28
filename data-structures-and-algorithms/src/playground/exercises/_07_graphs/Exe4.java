package playground.exercises._07_graphs;

/*
Дадени се градови и патишта кои постојат помеѓу нив. Дел од патиштата се поплавени и не може да се користат, што може да доведе до тоа градовите да се поделат на групи што не се меѓусебно поврзани. Секој град од една група е поврзан со барем еден друг град од групата преку достапни (непоплавени) патишта, а не е поврзан со градови надвор од групата. Да се одреди колку вакви групи ќе има во случај на поплава.


Влез: Во првиот ред е даден бројот на патишта M. Во следните M редови се дадени градовите кои ги поврзува секој пат. Потоа е даден бројот k на поплавени патишта, а во следните k редови се дадени поплавените патишта.

Излез:  Бројот на групи на градови кои ќе останат меѓусебно поврзани.

Пример:

Влез:

6
London Paris
Paris Brussels
Brussels Amsterdam
London Brussels
Paris Berlin
Berlin Warsaw
2
Paris Berlin
London Brussels

Излез: 2 (Објаснување: Ако не може да се користат патиштата Paris-Berlin и London-Brussels, градовите ќе се поделат во две групи: {London, Paris, Brussels, Amsterdam} и {Berlin, Warsaw})


/

Given cities and roads that exist between them, some roads are flooded and cannot be used. This may cause the cities to split into groups that are no longer connected. Each city in a group is connected to at least one other city in the same group via accessible (non-flooded) roads and is not connected to cities outside the group. Determine how many such groups will exist in the event of a flood.


Input: The first line contains the number of roads M. The next M lines specify the cities connected with each road. In the next line, you're given the number of flooded roads k, followed by k lines which give the flooded roads.

Output: The number of groups of still connected cities.

Example:

Input:

6
London Paris
Paris Brussels
Brussels Amsterdam
London Brussels
Paris Berlin
Berlin Warsaw
2
Paris Berlin
London Brussels


Output: 2 (Explanation: If the roads Paris-Berlin and London-Brussels can't be used, the cities will be split into two groups: {London, Paris, Brussels, Amsterdam} and {Berlin, Warsaw}.)

For example:
Input 	Result

6
London Paris
Paris Brussels
Brussels Amsterdam
London Brussels
Paris Berlin
Berlin Warsaw
2
Paris Berlin
London Brussels



2

5
Chicago Boston
Boston Philadelphia
Philadelphia Washington
Washington Atlanta
Atlanta Miami
2
Boston Philadelphia
Atlanta Miami



3

* */
public class Exe4 {
}
