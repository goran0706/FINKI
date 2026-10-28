package playground.exercises._07_graphs;

/*
Потребно е дадени материјали да се трансформираат во други материјали. Дадени се можните директни трансформации и цената за секоја од нив. Да се одреди најмалата цена за да се транформираат почетните материјали во целните.


Влез: Во првиот ред е даден бројот на материјали N во секоја група (почетни и целни). Потоа во следните N редови се дадени парови на материјали: почетниот материјал и материјалот во кој треба да се трансформира. Во следниот ред е даден бројот на можни трансформации M, а потоа во следните M редови се дадени трансформациите и нивните цени.

Излез:  Минималната цена да се трансформираат сите материјали.

Пример:

Влез:

4
Wood Wood
Iron Steel
Steel Iron
Glass Mirror
6
Wood Iron 2
Iron Steel 5
Steel Iron 5
Steel Mirror 1
Mirror Iron 2
Glass Mirror 20

Излез: 28

(Објаснување:

транформација wood->wood 0

транформација iron->steel 5

транформација steel->iron 3

транформација glass->mirror 20

вкупно: 28

)


/

Given materials need to be transformed into other materials. You're given the possible direct transformations and the price of each transformation. Determine the minimum price to transform the starting materials into the goal materials.


Input: The first line contains the number of materials in each set (starting/goal) N. The next N lines contain the pairs of materials: starting material and the material it needs to be transformed into. The next line contains the number of possible transformations M, followed by M lines that contain the transformations and their prices.

Output: The minimum cost to transform all materials.

Example:

Input:

4
Wood Wood
Iron Steel
Steel Iron
Glass Mirror
6
Wood Iron 2
Iron Steel 5
Steel Iron 5
Steel Mirror 1
Mirror Iron 2
Glass Mirror 20

Output: 28

(Explanation:

transformation wood->wood 0

transformation iron->steel 5

transformation steel->iron 3

transformation glass->mirror 20

total: 28

)


For example:
Input 	Result

4
Wood Wood
Iron Steel
Steel Iron
Glass Mirror
6
Wood Iron 2
Iron Steel 5
Steel Iron 5
Steel Mirror 1
Mirror Iron 2
Glass Mirror 20



28

2
Iron Steel
Wood Plank
4
Iron Steel 5
Wood Plank 3
Iron Wood 10
Plank Steel 8



8
* */
public class Exe8 {
}
