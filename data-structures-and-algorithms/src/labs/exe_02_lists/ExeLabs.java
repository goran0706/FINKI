package labs.exe_02_lists;

/*
Дадена е непразна двојно поврзана листа од цели броеви. Потоа се зададени N команди од обликот element fromWhere howManyPositions, каде што fromWhere може да биде само left или right, а howManyPositions е позитивен цел број.

За секоја команда, со кружно броење од првиот јазол ако е зададено left, односно од последниот ако е зададено right, да се избере јазолот на позицијата howManyPositions. Потоа да се вметне нов јазол со вредност element пред избраниот јазол. Се брои според тековната листа, вклучувајќи ги претходно вметнатите јазли.

По сите вметнувања, дадена е завршна команда од обликот howMany. Потребно е последните howMany јазли да се преместат на почетокот на листата, зачувувајќи го нивниот меѓусебен редослед и редоследот на преостанатите јазли. Притоа howMany е цел број од 0 до должината на листата по вметнувањата. Ако howMany е 0 или е еднаков на должината на листата, листата останува непроменета.

Да се испечати листата по извршувањето на сите N команди за вметнување, а потоа повторно да се испечати по извршувањето на завршната команда.

Објаснување на кружното броење: За секоја команда броењето започнува од 1: од првиот јазол ако е зададено left, односно од последниот ако е зададено right. При движење одлево надесно, по последниот јазол се продолжува од првиот, а при движење оддесно налево, по првиот се продолжува од последниот. „Пред“ и „по“ се однесуваат на редоследот одлево надесно во испечатената листа, независно од насоката на броење.

Пример за кружното броење: За листата 1<->2<->3 и командата 9 left 4, јазолот пред којшто треба да се вметне вредноста 9 е оној со вредност 1 и се добива 9<->1<->2<->3. Ако врз истата почетна листа се примени 9 right 4, јазолот пред којшто треба да се вметне вредноста 9 е оној со вредност 3 и се добива 1<->2<->9<->3. По секое вметнување, следната команда ја користи новата должина на листата.

Пример за завршната команда: За листата 1<->2<->3<->4<->5<->6<->7 и команда 2, резултатот е 6<->7<->1<->2<->3<->4<->5.

Објаснување на завршната команда: Последните 2 јазли се јазлите со вредности 6 и 7. Тие се преместуваат пред јазолот со вредност 1, при што 6 и понатаму е пред 7. Јазлите со вредности 1, 2, 3, 4 и 5 го задржуваат својот редослед и остануваат по преместените јазли.

Влез: Во првиот ред е даден бројот M ≥ 1, а во следните M редови се дадени почетните елементи на листата. Потоа е даден бројот N ≥ 0, по кој следуваат N редови со командите за вметнување. Во последниот ред е дадена завршната команда howMany.

Излез: Во првиот ред да се испечати листата по сите вметнувања, а во вториот ред листата по завршната команда. При двете печатења користете го дадениот метод .toString() од DLL класата.

You are given a nonempty doubly linked list of integers. Then N commands of the form element fromWhere howManyPositions are given, where fromWhere is either left or right, and howManyPositions is a positive integer.

For each command, select the node at position howManyPositions using circular counting from the first node for left or from the last node for right. Then insert a new node with value element before the selected node. Count using the current list, including nodes inserted by earlier commands.

After all insertions, a final command is given in the form howMany. Move the last howMany nodes to the beginning of the list, preserving their relative order and the order of the remaining nodes. The value of howMany is an integer from 0 to the list length after the insertions. If howMany is 0 or equals the list length, the list remains unchanged.

Print the list after all N insertion commands, then print it again after applying the final command.

Circular counting explained: For each command, counting starts at 1: at the first node if left is given, or at the last node if right is given. When moving from left to right, continue from the first node after the last; when moving from right to left, continue from the last node after the first. “Before” and “after” refer to the left-to-right order in the printed list, regardless of the counting direction.

Circular counting example: For the list 1<->2<->3 and command 9 left 4, the node before which 9 should be inserted is the one with value 1, giving 9<->1<->2<->3. If 9 right 4 is applied to the same initial list, the node before which 9 should be inserted is the one with value 3, giving 1<->2<->9<->3. After each insertion, the next command uses the updated list length.

Final command example: For the list 1<->2<->3<->4<->5<->6<->7 and command 2, the result is 6<->7<->1<->2<->3<->4<->5.

Final command explained: The last 2 nodes contain 6 and 7. Move them before the node with value 1, keeping 6 before 7. The nodes containing 1, 2, 3, 4, and 5 retain their order and remain after the moved nodes.

Input: The first line contains M ≥ 1, and the next M lines contain the initial list elements. Then N ≥ 0 is given, followed by N lines containing the insertion commands. The last line contains the final command howMany.

Output: Print the list after all insertions on the first line and the list after the final command on the second line. Use the supplied .toString() method of the DLL class for both outputs.

For example:
Input 	Result

1
4
1
9 left 1
1



9<->4
4<->9
*/
public class ExeLabs {
}
