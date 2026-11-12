/*
Да се креира апстрактна класа Book за опишување на книга во библиотечки систем. Класата треба да ги содржи следните два виртуелни методи:

•       calculateTotalPrice - за пресметување на крајната цена на книгата

•       printInfo - принтање



За секој модел на книга се чуваат следните информации:

•       Наслов (динамички алоцирана низа од знаци)

•       Издавач (низа од максимум 50 знаци)

•       Основна цена (реален број)



Од оваа класа да се изведат класите PrintedBook и EBook за опишување на печатени книги и електронски книги, соодветно.

 За секоја печатена книга (PrintedBook) дополнително се чуваат следните информации:

•       број на страници (цел број)



За секоја електронска книга (EBook) дополнително се чуваат следните информации:

•       DRM заштита (bool вредност)



За секој тип на книга потребно е да се обезбеди метод (calculateTotalPrice) за пресметување на крајната цена:

Цената на печатена книга (PrintedBook) се пресметува според следните правила:

•       доколку бројот на страници е поголем од 300, основната цена се зголемува за 5% за секои 100 страници над 300



Цената на електронска книга (EBook) се пресметува според следните правила:

•       доколку книгата има DRM заштита, тогаш цената се зголемува за 15%



Функцијата за печатење на податоци за книга треба да биде во следниов формат:

За печатени книги (PrintedBook):

[наслов], [издавач], [број на страници] - [крајна цена]



За електронски книги (EBook):

[наслов], [издавач], [DRM: 0 или 1] - [крајна цена]



Да се дефинира глобална функција float mostExpensiveBook(Book *books[], int n) што на влез прима низа од покажувачи кон објекти од класата Book и нивниот број, а како резултат ги печати информациите за објектот којшто се карактеризира со најголема крајна цена.


-------------------------------------------------------

Create an abstract class Book to describe a book in a library system. The class must contain the following two virtual methods:

    calculateTotalPrice — for calculating the final price of the book
    printInfo — for printing

For each book model, the following information is stored:

    Title (dynamically allocated character array)
    Publisher (array of maximum 50 characters)
    Base price (floating point number)



From this class, derive the classes PrintedBook and EBook to describe printed books and electronic books, respectively.

For each printed book (PrintedBook), the following additional information is stored:

    Number of pages (integer)

For each electronic book (EBook), the following additional information is stored:

    DRM protection (bool value)

Price calculation (calculateTotalPrice)

PrintedBook pricing rules:

    If the number of pages exceeds 300, the base price increases by 5% for every 100 pages above 300

EBook pricing rules:

    If the book has DRM protection, the price increases by 15%

Print format (printInfo)

PrintedBook:



[title], [publisher], [number of pages] - [final price]

EBook:



[title], [publisher], [DRM: 0 or 1] - [final price]

Global function

Define a global function float mostExpensiveBook(Book *books[], int n) that takes as input an array of pointers to Book objects and their count, and prints the information for the object with the highest final price.



For example:
Input 	Result

5
EBook HarryPotter PubA 500 1
PrintedBook TheLordOfTheRings PubB 300 650
EBook TheDaVinciCode PubC 400 0
PrintedBook AnimalFarm PubD 200 100
EBook TheGreatGatsby PubE 550 1



Most expensive Book:
TheGreatGatsby, PubE, 1 - 632.5
*/