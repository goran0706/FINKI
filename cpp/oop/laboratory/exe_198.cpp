/*
Да се креира апстрактна класа Festival за опишување на музички фестивал.

Класата треба да ги содржи следните чисти виртуелни методи:

    calculateTotalCost() – пресметува вкупна цена за организација
    printInfo() – печати информации

За секој фестивал се чуваат:

    Име (динамички алоцирана низа од знаци)
    Локација (низа од максимум 50 знаци)
    Основен буџет (float)

Од оваа класа да се изведат класите  RockFestival и JazzFestival.
За секој RockFestival дополнително се чуваат следните информации:

    numberOfBands (int) – број на бендови

За секој JazzFestival дополнително се чуваат следните информации:

    openAir (bool) – дали е на отворено



За секој тип на фестивал потребно е да се обезбеди метод (calculateTotalCost) за пресметување на вкупната цена за организација:

Цената за организација на RockFestival се пресметува според следните правила:

    Ако има повеќе од 5 бендови, основната цена се зголемува за 2000$ за секој дополнителен бенд

Цената за организација на JazzFestival се пресметува според следните правила:

    доколку фестивалот е на отворено,основната цена се зголемува за 3000$

Функцијата за печатење на податоци за фестивали треба да биде во следниов формат:

За RockFestival :

[name], [location], [numberOfBands] - [totalCost]

За JazzFestival:

[name], [location], [openAir] - [totalCost]



Да се дефинира глобална функција float mostExpensiveFestival(Festival *festivals[], int n) што на влез прима низа од покажувачи кон објекти од класата Festival и нивниот број, а како резултат ја враќа најголемата вкупна цена на фестивал.

----------------------------------------------------------------------------------------------------------------------------------------------------

Create an abstract class Festival to represent a music festival.

The class should contain the following pure virtual methods:

    calculateTotalCost() – calculates the total cost of organizing the festival
    printInfo() – prints information about the festival

Each festival should store:

    Name (dynamically allocated character array)
    Location (character array with a maximum of 50 characters)
    Base budget (float)

From this class derive the classes RockFestival and JazzFestival.

For each RockFestival the following information is additionally stored:

    numberOfBands (int) – number of bands

For each JazzFestival the following information is additionally stored:

    openAir (bool) – whether it is outdoor

For each type of festival it is required to provide a method (calculateTotalCost) for calculating the total cost for organization:

The cost for organization of RockFestival is calculated according to the following rules:

    If there are more than 5 bands, the base cost is increased by 2000$ for each additional band

The cost for organization of JazzFestival is calculated according to the following rules:

    If the festival is outdoor, the base cost is increased by 3000$

The function for printing data for festivals should be in the following format:

For RockFestival:

[name], [location], [numberOfBands] - [totalCost]

For JazzFestival:

[name], [location], [openAir] - [totalCost]



Define a global function float mostExpensiveFestival(Festival *festivals[], int n) which as input receives an array of pointers to objects of the class Festival and their number, and as a result returns the maximum total cost of all festivals.



For example:
Input 	Result

3
RockFestival Exit Serbia 10000 7
JazzFestival SkopjeJazz Skopje 8000 1
RockFestival BeerFest Belgrade 9000 4



Most Expensive Festival:
Exit, Serbia, 7 - 14000

3
JazzFestival BlueNote Paris 9000 1
JazzFestival SmoothJazz Rome 8000 0
JazzFestival NightVibes Berlin 7500 1



Most Expensive Festival:
BlueNote, Paris, 1 - 12000
*/
