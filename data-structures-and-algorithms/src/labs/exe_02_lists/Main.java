package labs.exe_02_lists;

import java.text.DecimalFormat;
import java.util.Scanner;

/*
Да се напише програма за магацин во кој производите се чуваат во контејнери.

Класата Product има:

name (String)
price (double)

Методот finalPrice() ја враќа цената. Методот toString() враќа текст во формат NAME price=PRICE final=FINAL, каде двете цени се печатат на 2 децимали.

Класата Food наследува од Product и има атрибут daysToExpiry (int). Ако до истекот на рокот има 3 или помалку дена, крајната цена е 50% од цената. На toString() се додава days=D.

Класата Electronics наследува од Product и има атрибут warrantyMonths (int). Ако гаранцијата е подолга од 24 месеци, крајната цена се зголемува за 15%. На toString() се додава warranty=W.

Генеричката класа Pair<K, V> чува клуч и вредност. Има конструктор и методи getKey() и getValue().

Генеричката класа Container<T extends Product> чува производи од типот T. Ознаката extends Product значи дека T мора да биде Product или некоја негова поткласа, па затоа во контејнерот може да се повика finalPrice(). Контејнерот има име, капацитет и ArrayList<T>. Треба да ги има следниве методи:

boolean add(T item) – додава производ; враќа false ако контејнерот е полн
int size()
double totalValue() – збир на крајните цени
T mostExpensive() – производот со највисока крајна цена; при еднаквост се враќа првиот, а ако контејнерот е празен се враќа null
Pair<String, Double> summary() – враќа пар (име на контејнерот, вкупна вредност)
void print() – печати === NAME (SIZE/CAPACITY) ===, па сите производи, па Total: X, па Most expensive: NAME (PRICE)или Most expensive: none

Во главната класа се креираат три контејнери:

Container<Food> со име Fridge
Container<Electronics> со име Tech
Container<Product> со име Overflow

Храната се става во Fridge, а електрониката во Tech. Ако соодветниот контејнер е полн, производот се става во Overflow. Ова е можно затоа што и Food и Electronics се Product. Ако и Overflow е полн, се печати Rejected: NAME. Не смее да се користи кастирање.

Влез:

во првиот ред се капацитетите на Fridge, Tech и Overflow
во вториот ред е N, бројот на производи
потоа следуваат N редови во формат F name price days или E name price warranty

Излез:

пораките Rejected (во редоследот на читање)
print() за Fridge, Tech и Overflow, по тој редослед
Most valuable container: NAME (TOTAL), пресметано со summary() (при еднаквост се печати првиот)
Top food expires in D days, ако Fridge не е празен
Top electronics warranty: W months, ако Tech не е празен

Ставките 4 и 5 се добиваат директно од mostExpensive(), без кастирање.

Write a program for a warehouse in which products are stored in containers.

        The class Product has:

name (String)
price (double)

The method finalPrice() returns the price. The method toString() returns a string in the format NAME price=PRICE final=FINAL, with both prices printed to 2 decimals.

        The class Food extends Product and has the attribute daysToExpiry (int). If there are 3 or fewer days until expiry, the final price is 50% of the price. toString() appends days=D.

        The class Electronics extends Product and has the attribute warrantyMonths (int). If the warranty is longer than 24 months, the final price is increased by 15%. toString() appends warranty=W.

The generic class Pair<K, V> stores a key and a value. It has a constructor and the methods getKey() and getValue().

The generic class Container<T extends Product> stores products of type T. The notation extends Product means T must be Productor one of its subclasses, which is why the container can call finalPrice(). A container has a name, a capacity and an ArrayList<T>. It must have the following methods:

boolean add(T item) – adds a product; returns false if the container is full
int size()
double totalValue() – the sum of the final prices
T mostExpensive() – the product with the highest final price; on a tie, return the first one, and if the container is empty, return null
Pair<String, Double> summary() – returns a pair of (container name, total value)
void print() – prints === NAME (SIZE/CAPACITY) ===, then all products, then Total: X, then Most expensive: NAME (PRICE) or Most expensive: none

The main class creates three containers:

a Container<Food> named Fridge
a Container<Electronics> named Tech
a Container<Product> named Overflow

Food goes into Fridge and electronics into Tech. If the matching container is full, the product goes into Overflow. This works because both Food and Electronics are a Product. If Overflow is also full, print Rejected: NAME. Casting is not allowed.

Input:

the first line contains the capacities of Fridge, Tech and Overflow
the second line contains N, the number of products
then follow N lines in the format F name price days or E name price warranty

Output:

the Rejected messages (in reading order)
print() for Fridge, Tech and Overflow, in that order
Most valuable container: NAME (TOTAL), computed with summary() (on a tie, print the first one)
Top food expires in D days, if Fridge is not empty
Top electronics warranty: W months, if Tech is not empty

Items 4 and 5 are obtained directly from mostExpensive(), without casting.

*/

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        DecimalFormat formatter = new DecimalFormat("0.00");

        int foodCapacity = scanner.nextInt();
        int electronicsCapacity = scanner.nextInt();
        int overflowCapacity = scanner.nextInt();

        Container<Food> foodContainer = new Container<>("Fridge", foodCapacity);
        Container<Electronics> electronicsContainer = new Container<>("Tech", electronicsCapacity);
        Container<Product> overflowContainer = new Container<>("Overflow", overflowCapacity);

        int n = scanner.nextInt();

        for (int i = 0; i < n; i++) {
            String type = scanner.next();
            String name = scanner.next();
            double price = scanner.nextDouble();

            switch (type) {
                case "F": {
                    int days = scanner.nextInt();
                    Food food = new Food(name, price, days);

                    if (!foodContainer.add(food) && !overflowContainer.add(food)) {
                        System.out.println("Rejected: " + name);
                    }
                    break;
                }

                case "E": {
                    int warranty = scanner.nextInt();
                    Electronics electronics = new Electronics(name, price, warranty);

                    if (!electronicsContainer.add(electronics) && !overflowContainer.add(electronics)) {
                        System.out.println("Rejected: " + name);
                    }
                    break;
                }

                default:
                    throw new IllegalArgumentException("Unknown product type: " + type);
            }
        }

        foodContainer.print();
        electronicsContainer.print();
        overflowContainer.print();

        Pair<String, Double> mostValuable = foodContainer.summary();

        Pair<String, Double> techSummary = electronicsContainer.summary();
        if (techSummary.getValue() > mostValuable.getValue()) {
            mostValuable = techSummary;
        }

        Pair<String, Double> overflowSummary = overflowContainer.summary();
        if (overflowSummary.getValue() > mostValuable.getValue()) {
            mostValuable = overflowSummary;
        }

        System.out.println("Most valuable container: " + mostValuable.getKey() + " (" + formatter.format(mostValuable.getValue()) + ")");

        Food mostExpensiveFood = foodContainer.mostExpensive();
        if (mostExpensiveFood != null) {
            System.out.println("Top food expires in " + mostExpensiveFood.getDaysToExpiry() + " days");
        }

        Electronics mostExpensiveElectronics = electronicsContainer.mostExpensive();
        if (mostExpensiveElectronics != null) {
            System.out.println("Top electronics warranty: " + mostExpensiveElectronics.getWarrantyMonths() + " months");
        }

        scanner.close();
    }
}