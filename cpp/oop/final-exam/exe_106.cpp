/*
Да се дефинира класа Shipment со следните информации:

    senderName (string) - име на испраќачот

    baseCost (float) - основна цена на пратката

Потребно е да се имплементираат потребните конструктори, деструктор, методи get и set за класата Shipment.

Да се дефинира апстрактна класа Deliverable со следните чисто виртуелни функции:

    float getBaseCost() - ја враќа основната цена на пратката пред каква било пресметка

    float getFinalCost() - ја враќа конечната цена што треба да се плати по сите додатоци

    void printDetails() - печати детали за објектот

Да се дефинираат две класи ExpressParcel и FreightCargo кои наследуваат од Shipment и Deliverable.

За класата ExpressParcel, се чуваат следните дополнителни атрибути:

    distanceKm (float) - растојанието на доставата во километри
    fuelSurchargeRate (float) - стапката на додаток за гориво применета на цената, иста е за сите објекти од класата ExpressParcel, со почетна вредност 0.12

Да се имплементираат методите getFuelSurchargeRate() и setFuelSurchargeRate() за fuelSurchargeRate.

Функцијата getFinalCost() ја враќа конечната цена. За класата ЕxpressParcel таа се пресметува така што се започнува од основната цена (baseCost), а потоа се применуваат следните правила:

    Се додава надоместок за растојание, пресметан како поминатото растојание (distanceKm) помножено со 0.5.
    На крај, на добиената сума ѝ се додава додаток за гориво, кој изнесува fuelSurchargeRate (иницијално 12%) од таа сума; резултатот е конечната цена.

Функцијата getBaseCost() ја враќа основната цена без никакви измени.

printDetails() го печати секој ExpressParcel во следниот формат:

[senderName] (Express) - Distance: [distanceKm]km - Base Cost: [baseCost] - Final Cost: [finalCost]

За класата FreightCargo, се чуваат следните дополнителни атрибути:

    volumeM3 (float) - зафатнината на товарот во кубни метри
    customsRate (float) - царинската стапка применета на цената, иста e за сите објекти од класата FreightCargo, со почетна вредност  0.20

Да се имплементираат методите getCustomsRate() и setCustomsRate() за customsRate.

Функцијата getFinalCost() ја враќа конечната цена. Таа се пресметува така што се започнува од основната цена (baseCost), а потоа се применуваат следните правила:

    Се додава надоместок за зафатнина, пресметан како зафатнината на товарот (volumeM3) помножена со 8.
    На крај, на добиената сума ѝ се додава царина, која изнесува customsRate (иницијално 20%) од таа сума; резултатот е конечната цена.

Функцијата getBaseCost() ја враќа основната цена без никакви измени.

Функцијата printDetails() го печати секој FreightCargo во следниот формат:

[senderName] (Freight) - Volume: [volumeM3]m3 - Base Cost: [baseCost] - Final Cost: [finalCost]

Да се дефинира класа за исклучок NoExpressParcelException, а потоа да се дефинираат следните глобални функции:

ExpressParcel* findMostExpensiveExpressParcel(Deliverable** shipments, int n)

Оваа функција прима низа од покажувачи од Deliverable објекти, ги филтрира само оние од тип ExpressParcel и ја враќа најскапата меѓу нив (онаа со највисока конечна цена). Доколку повеќе ExpressParcel објекти имаат иста конечна цена, се враќа онаа со поголемо растојание (distanceKm). Доколку во низата нема ниту еден ExpressParcel, функцијата треба да фрли исклучок од тип NoExpressParcelException.

void printMostExpensiveExpressParcel(Deliverable** shipments, int n)

Оваа функција ја повикува findMostExpensiveExpressParcel. Доколку е вратен ExpressParcel, ги печати неговите детали. Доколку се фати исклучок од тип NoExpressParcelException, се печати пораката "There are no express parcels".

Искористете #include <iomanip> и cout << fixed << setprecision(2) за заокружување.

Define a class Shipment with the following specifications:

    senderName (string)
    baseCost (float)

Implement the needed constructors, destructor, getters and setters for Shipment.

Define an abstract class Deliverable with the following pure virtual functions:

    float getBaseCost() - returns the raw base cost of the shipment before any calculation
    float getFinalCost() - returns the final cost to be paid after all surcharges are applied
    void printDetails() - prints details for Deliverable

Define two classes ExpressParcel and FreightCargo that inherit from both Shipment and Deliverable (5 points).

For the ExpressParcel class, the following additional attributes are stored:

    distanceKm (float) - the delivery distance in kilometers (e.g. 300.0)
    fuelSurchargeRate (float) - the fuel surcharge rate applied on the cost, is the same for each object of ExpressParcel, default value is 0.12

Implement a getter getFuelSurchargeRate() and a setter setFuelSurchargeRate() for fuelSurchargeRate.

Function getFinalCost() returns the final cost. It is calculated by starting from the base cost (baseCost) and then:

    Add the distance fee, calculated as the distance travelled (distanceKm) multiplied by 0.5.
    Finally, to the resulting amount add the fuel surcharge, which is fuelSurchargeRate (initially 12%) of that amount; the result is the final cost.

Function getBaseCost() returns the raw base cost with no modifications.

Function printDetails() prints each ExpressParcel in the following format:
[senderName] (Express) - Distance: [distanceKm]km - Base Cost: [baseCost] - Final Cost: [finalCost]

For the FreightCargo class, the following additional attributes are stored:

    volumeM3 (float) - the cargo volume in cubic meters
    customsRate (float) - the customs duty rate applied on the cost, is the same for each object of FreightCargo, default value is 0.20

Implement a getter getCustomsRate() and a setter setCustomsRate() for customsRate.

Function getFinalCost() returns the final cost. It is calculated by starting from the base cost (baseCost) and then:

    Add the volume fee, calculated as the cargo volume (volumeM3) multiplied by 8.
    Finally, to the resulting amount add the customs duty, which is customsRate (initially 20%) of that amount; the result is the final cost.

Function getBaseCost() returns the raw base cost with no modifications.

Function printDetails() prints each FreightCargo in the following format:
[senderName] (Freight) - Volume: [volumeM3]m3 - Base Cost: [baseCost] - Final Cost: [finalCost]

Define an exception class NoExpressParcelException, and then define the following global functions:

ExpressParcel* findMostExpensiveExpressParcel(Deliverable** shipments, int n)
This function receives an array of pointers to Deliverable objects, filters out only those of type ExpressParcel, and returns the most expensive one among them (the one with the highest final cost). If multiple ExpressParcel objects have the same final cost, return the one with the larger distance (distanceKm). If there is no ExpressParcel in the array, the function should throw an exception of type NoExpressParcelException.

void printMostExpensiveExpressParcel(Deliverable** shipments, int n)
This function calls findMostExpensiveExpressParcel. If an ExpressParcel is returned, it prints its details. If a NoExpressParcelException is caught, it prints the message "There are no express parcels".

Use #include <iomanip> and cout << fixed << setprecision(2) for rounding.

For example:
Test 	Result

Shipment s = Shipment("Alice", 120.00);
cout << "Shipment sender: " << s.getSenderName() << endl;
cout << "Shipment base cost: " << s.getBaseCost() << endl;
s.setSenderName("Bob");
cout << "Shipment sender: " << s.getSenderName() << endl;
cout << "Shipment base cost: " << s.getBaseCost() << endl;
s.setBaseCost(150.00);
cout << "Shipment sender: " << s.getSenderName() << endl;
cout << "Shipment base cost: " << s.getBaseCost() << endl;


Shipment sender: Alice
Shipment base cost: 120
Shipment sender: Bob
Shipment base cost: 120
Shipment sender: Bob
Shipment base cost: 150
----------------------------------
cout << "Express fuel surcharge rate: " << ExpressParcel::getFuelSurchargeRate() << endl;
ExpressParcel::setFuelSurchargeRate(0.15);
cout << "Express fuel surcharge rate: " << ExpressParcel::getFuelSurchargeRate() << endl;


Express fuel surcharge rate: 0.12
Express fuel surcharge rate: 0.15
----------------------------------
ExpressParcel e1("Alice", 100.00, 300.0);
ExpressParcel e2("Bob", 250.00, 600.0);
ExpressParcel e3("Carol", 80.00, 120.0);
cout << "Testing getFinalCost() for ExpressParcel" << endl;
cout << e1.getFinalCost() << endl;
cout << e2.getFinalCost() << endl;
cout << e3.getFinalCost() << endl;


Testing getFinalCost() for ExpressParcel
280
616
156.8
----------------------------------
ExpressParcel e1("Alice", 100.00, 300.0);
ExpressParcel e2("Bob", 250.00, 600.0);
ExpressParcel e3("Carol", 80.00, 120.0);
cout << "Testing getBaseCost() for ExpressParcel" << endl;
cout << e1.getBaseCost() << endl;
cout << e2.getBaseCost() << endl;
cout << e3.getBaseCost() << endl;


Testing getBaseCost() for ExpressParcel
100
250
80
----------------------------------
ExpressParcel e1("Alice", 100.00, 300.0);
ExpressParcel e2("Bob", 250.00, 600.0);
ExpressParcel e3("Carol", 80.00, 120.0);
cout << "Testing printDetails() for ExpressParcel" << endl;
e1.printDetails();
e2.printDetails();
e3.printDetails();


Testing printDetails() for ExpressParcel
Alice (Express) - Distance: 300.00km - Base Cost: 100.00 - Final Cost: 280.00
Bob (Express) - Distance: 600.00km - Base Cost: 250.00 - Final Cost: 616.00
Carol (Express) - Distance: 120.00km - Base Cost: 80.00 - Final Cost: 156.80
----------------------------------
cout << "Freight customs rate: " << FreightCargo::getCustomsRate() << endl;
FreightCargo::setCustomsRate(0.25);
cout << "Freight customs rate: " << FreightCargo::getCustomsRate() << endl;


Freight customs rate: 0.2
Freight customs rate: 0.25
----------------------------------
FreightCargo f1("Dave", 150.00, 10.0);
FreightCargo f2("Eve", 300.00, 25.0);
FreightCargo f3("Frank", 100.00, 50.0);
cout << "Testing getFinalCost() for FreightCargo" << endl;
cout << f1.getFinalCost() << endl;
cout << f2.getFinalCost() << endl;
cout << f3.getFinalCost() << endl;


Testing getFinalCost() for FreightCargo
276
600
600
----------------------------------
FreightCargo f1("Dave", 150.00, 10.0);
FreightCargo f2("Eve", 300.00, 25.0);
FreightCargo f3("Frank", 100.00, 50.0);
cout << "Testing getBaseCost() for FreightCargo" << endl;
cout << f1.getBaseCost() << endl;
cout << f2.getBaseCost() << endl;
cout << f3.getBaseCost() << endl;


Testing getBaseCost() for FreightCargo
150
300
100
----------------------------------
FreightCargo f1("Dave", 150.00, 10.0);
FreightCargo f2("Eve", 300.00, 25.0);
FreightCargo f3("Frank", 100.00, 50.0);
cout << "Testing printDetails() for FreightCargo" << endl;
f1.printDetails();
f2.printDetails();
f3.printDetails();


Testing printDetails() for FreightCargo
Dave (Freight) - Volume: 10.00m3 - Base Cost: 150.00 - Final Cost: 276.00
Eve (Freight) - Volume: 25.00m3 - Base Cost: 300.00 - Final Cost: 600.00
Frank (Freight) - Volume: 50.00m3 - Base Cost: 100.00 - Final Cost: 600.00
----------------------------------
Deliverable **v = new Deliverable *[10];
v[0] = new ExpressParcel("Alice", 100.00, 300.0);
v[1] = new FreightCargo("Dave", 150.00, 10.0);
v[2] = new ExpressParcel("Bob", 250.00, 600.0);
v[3] = new ExpressParcel("Carol", 80.00, 120.0);
v[4] = new FreightCargo("Eve", 300.00, 25.0);
v[5] = new ExpressParcel("Alice", 300.00, 800.0);
v[6] = new ExpressParcel("Frank", 150.00, 200.0);
v[7] = new FreightCargo("Grace", 70.00, 40.0);
v[8] = new ExpressParcel("Bob", 95.00, 120.0);
v[9] = new ExpressParcel("Carol", 220.00, 350.0);

printMostExpensiveExpressParcel(v, 10);


Alice (Express) - Distance: 800.00km - Base Cost: 300.00 - Final Cost: 784.00
----------------------------------
Deliverable **v = new Deliverable *[10];
v[0] = new ExpressParcel("Alice", 100.00, 300.0);
v[1] = new FreightCargo("Dave", 150.00, 10.0);
v[2] = new ExpressParcel("Bob", 250.00, 600.0);
v[3] = new ExpressParcel("Carol", 80.00, 120.0);
v[4] = new FreightCargo("Eve", 300.00, 25.0);
v[5] = new ExpressParcel("Alice", 300.00, 400.0);
v[6] = new ExpressParcel("Frank", 150.00, 200.0);
v[7] = new FreightCargo("Grace", 70.00, 40.0);
v[8] = new ExpressParcel("Bob", 95.00, 120.0);
v[9] = new ExpressParcel("Carol", 500.00, 900.0);

printMostExpensiveExpressParcel(v, 10);


Carol (Express) - Distance: 900.00km - Base Cost: 500.00 - Final Cost: 1064.00
----------------------------------
Deliverable **v = new Deliverable *[4];
v[0] = new ExpressParcel("Tie1", 100.00, 200.0);
v[1] = new ExpressParcel("Tie2", 90.00, 220.0);
v[2] = new FreightCargo("Eve", 300.00, 25.0);
v[3] = new ExpressParcel("Low", 50.00, 60.0);

printMostExpensiveExpressParcel(v, 4);


Tie2 (Express) - Distance: 220.00km - Base Cost: 90.00 - Final Cost: 224.00
----------------------------------
Deliverable **v = new Deliverable *[5];
v[0] = new FreightCargo("Dave", 150.00, 10.0);
v[1] = new FreightCargo("Eve", 300.00, 25.0);
v[2] = new FreightCargo("Frank", 100.00, 50.0);
v[3] = new FreightCargo("Grace", 70.00, 40.0);
v[4] = new FreightCargo("Hank", 500.00, 80.0);

printMostExpensiveExpressParcel(v, 5);


There are no express parcels
----------------------------------
Deliverable **v = new Deliverable *[8];
v[0] = new ExpressParcel("Alice", 100.00, 300.0);
v[1] = new FreightCargo("Dave", 150.00, 10.0);
v[2] = new ExpressParcel("Bob", 250.00, 600.0);
v[3] = new ExpressParcel("Carol", 80.00, 120.0);
v[4] = new FreightCargo("Eve", 300.00, 25.0);
v[5] = new ExpressParcel("Frank", 150.00, 200.0);
v[6] = new ExpressParcel("Bob", 95.00, 120.0);
v[7] = new ExpressParcel("Carol", 500.00, 900.0);

for (int i=0;i<8;i++){
    v[i]->printDetails();
}
cout<<endl;
printMostExpensiveExpressParcel(v, 8);


Alice (Express) - Distance: 300.00km - Base Cost: 100.00 - Final Cost: 280.00
Dave (Freight) - Volume: 10.00m3 - Base Cost: 150.00 - Final Cost: 276.00
Bob (Express) - Distance: 600.00km - Base Cost: 250.00 - Final Cost: 616.00
Carol (Express) - Distance: 120.00km - Base Cost: 80.00 - Final Cost: 156.80
Eve (Freight) - Volume: 25.00m3 - Base Cost: 300.00 - Final Cost: 600.00
Frank (Express) - Distance: 200.00km - Base Cost: 150.00 - Final Cost: 280.00
Bob (Express) - Distance: 120.00km - Base Cost: 95.00 - Final Cost: 173.60
Carol (Express) - Distance: 900.00km - Base Cost: 500.00 - Final Cost: 1064.00

Carol (Express) - Distance: 900.00km - Base Cost: 500.00 - Final Cost: 1064.00
----------------------------------
Deliverable **v = new Deliverable *[10];
v[0] = new FreightCargo("Dave", 180.00, 12.0);
v[1] = new ExpressParcel("Alice", 120.00, 250.0);
v[2] = new ExpressParcel("Bob", 260.00, 640.0);
v[3] = new FreightCargo("Eve", 320.00, 28.0);
v[4] = new ExpressParcel("Carol", 90.00, 130.0);
v[5] = new ExpressParcel("Frank", 200.00, 480.0);
v[6] = new FreightCargo("Grace", 75.00, 45.0);
v[7] = new ExpressParcel("Heidi", 410.00, 850.0);
v[8] = new ExpressParcel("Ivan", 100.00, 110.0);
v[9] = new FreightCargo("Judy", 150.00, 18.0);

for (int i=0;i<10;i++){
    v[i]->printDetails();
}
cout<<endl;
printMostExpensiveExpressParcel(v, 10);


Dave (Freight) - Volume: 12.00m3 - Base Cost: 180.00 - Final Cost: 331.20
Alice (Express) - Distance: 250.00km - Base Cost: 120.00 - Final Cost: 274.40
Bob (Express) - Distance: 640.00km - Base Cost: 260.00 - Final Cost: 649.60
Eve (Freight) - Volume: 28.00m3 - Base Cost: 320.00 - Final Cost: 652.80
Carol (Express) - Distance: 130.00km - Base Cost: 90.00 - Final Cost: 173.60
Frank (Express) - Distance: 480.00km - Base Cost: 200.00 - Final Cost: 492.80
Grace (Freight) - Volume: 45.00m3 - Base Cost: 75.00 - Final Cost: 522.00
Heidi (Express) - Distance: 850.00km - Base Cost: 410.00 - Final Cost: 935.20
Ivan (Express) - Distance: 110.00km - Base Cost: 100.00 - Final Cost: 173.60
Judy (Freight) - Volume: 18.00m3 - Base Cost: 150.00 - Final Cost: 352.80

Heidi (Express) - Distance: 850.00km - Base Cost: 410.00 - Final Cost: 935.20
*/