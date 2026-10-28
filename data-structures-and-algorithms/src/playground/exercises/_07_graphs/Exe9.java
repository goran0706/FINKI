package playground.exercises._07_graphs;

/*
Дадени се состојки за рецепт, при што не се достапни сите потребни состојки. Можно е достапните состојки да се транформираат во потребните, при што секоја трансофрмација има одредена цена. Дадени се можните директни трансформации и цената за секоја од нив. Да се одреди најмалата цена за да се транформираат достапните состојки во потребните.


Влез: Во првиот ред е даден бројот на состојки N во секоја група (достапни и потребни). Потоа во следните N редови се дадени парови на состојки: достапната состојка и состојката во кој треба да се трансформира. Во следниот ред е даден бројот на можни трансформации M, а потоа во следните M редови се дадени трансформациите и нивните цени.

Излез:  Минималната цена да се трансформираат сите состојки.

Пример:

Влез:

4
Flour Flour
Pork Bacon
Bacon Pork
Chicken Ham
6
Flour Pork 2
Pork Bacon 5
Bacon Pork 5
Bacon Ham 1
Ham Pork 2
Chicken Ham 20

Излез: 28

(Објаснување:

транформација flour->flour 0

транформација pork->bacon 5

транформација bacon->pork 3

транформација chicken->ham 20

вкупно: 28

)


/

You're given recipe ingredients, where some needed ingredients aren't available. It's possible to transform the available ingredients into the ones needed for the recipe and each transformation has a price. You're given the possible direct transformations and the price of each transformation. Determine the minimum price to transform the available ingredients into the needed ingredients.


Input: The first line contains the number of ingredients in each set (available/needed) N. The next N lines contain the pairs of ingredients: available ingredient and the ingredient it needs to be transformed into. The next line contains the number of possible transformations M, followed by M lines that contain the transformations and their prices.

Output: The minimum cost to transform all ingredients.

Example:

Input:

4
Flour Flour
Pork Bacon
Bacon Pork
Chicken Ham
6
Flour Pork 2
Pork Bacon 5
Bacon Pork 5
Bacon Ham 1
Ham Pork 2
Chicken Ham 20

Output: 28

(Explanation:

transformation flour->flour 0

transformation pork->bacon 5

transformation bacon->pork 3

transformation chicken->ham 20

total: 28

)


For example:
Input 	Result

4
Flour Flour
Pork Bacon
Bacon Pork
Chicken Ham
6
Flour Pork 2
Pork Bacon 5
Bacon Pork 5
Bacon Ham 1
Ham Pork 2
Chicken Ham 20



28

3
Flour Dough
Milk Cheese
Sugar Syrup
6
Flour Dough 3
Dough Bread 6
Milk Cheese 8
Sugar Syrup 9
Sugar Honey 4
Honey Syrup 2



17


*/
public class Exe9 {
}
