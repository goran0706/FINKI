/*
Да се дефинира класа User која ќе претставува корисник во некој систем. Секој корисник ги има следните атрибути:

    id (цел број)

    username (стринг)

    email (стринг)

    password (текстуален стринг, може да содржи празни места)

    connections (цел број) – претставува колку други корисници се поврзани со овој корисник

Во класата User да се имплементираат:

    Потребните конструктори

    Префикс оператор ++ кој го зголемува бројот на конекции на корисникот (2.5 п.)

    Оператор == за споредба на корисникот со друго корисничко име (string) (2.5 п.)

    Оператор << за печатење на податоците за корисникот: id, username, должина на лозинка, email и број на конекции  (5 п.)

Да се дефинира класа UserSystem во која се чуваат:

    Динамички алоцирана низа од објекти од класата User

    Бројот на корисници

Во класата UserSystem да се имплементираат:

    Потребните конструктори

    Деструктор

    copy конструктор и оператор = за доделување (5 п.)

    Оператор += за додавање нов корисник во системот (5 п.)

    Оператор [] за пристап до корисник според неговото корисничко име (username) (5 п.)

        Ако корисникот не постои, да се фрли исклучок UserNotFoundException (5 п.)

        При фаќање на исклучокот да се испечати порака: User with username "{username}" not found. (5 п.)

    Оператор << за печатење на сите корисници во системот (5 п.)

    Метод UserSystem filterByEmailDomain(string domain):

        Враќа нов објект од типот UserSystem кој ги содржи само корисниците чии email адреси завршуваат со дадениот домен (на пр. @gmail.com) (5 п.)

Да се имплементира глобална функција User readUser(ifstream& in) која ќе чита податоци за еден корисник од отворена датотека, а ќе врати објект од класата User. (5 п.)
---

Define a class User that represents a user in a system. Each user has the following attributes:

    id (integer)

    username (string)

    email (string)

    password (text string, can contain spaces)

    connections (integer) – represents how many other users are connected to this user

In the User class, implement the following:

    The necessary constructors

    Prefix operator ++ that increases the number of connections for the user

    Operator == for comparing the user with another username (string)

    Operator << for printing user data: id, username, length of password email, and number of connections (without printing the password)

Define a class UserSystem which stores:

    A dynamically allocated array of User objects

    The number of users

In the UserSystem class, implement the following:

    The necessary constructors

    Destructor

    copy constructor & operator = for assignment

    Operator += for adding a new user to the system

    Operator [] for accessing a user by their username

        If the user does not exist, throw an exception UserNotFoundException

        When catching the exception, print the message: User with username "{username}" not found.

    Operator << for printing all users in the system

    Method UserSystem filterByEmailDomain(string domain):

        Returns a new object of type UserSystem containing only the users whose email addresses end with the given domain (e.g. @gmail.com)

Implement a global function User readUser(ifstream& in) which reads user data from an open file and returns an object of class User.

For example:

Input 	Result

101
johnny
john@gmail.com
my pass 123
5
----
1


ID: 101, Username: johnny, Password length: 11, Email: john@gmail.com, Connections: 5
----------------------------------
101
johnny
john@gmail.com
my pass 123
5
102
ana
ana@yahoo.com
secret pass
6
103
marko
marko@gmail.com
another one
4
104
peter
peter@outlook.com
outlook password
2
105
lucy
lucy@gmail.com
complex pass 456!
9
----
4


ID: 101, Username: johnny, Password length: 11, Email: john@gmail.com, Connections: 5
ID: 102, Username: ana, Password length: 11, Email: ana@yahoo.com, Connections: 6
ID: 103, Username: marko, Password length: 11, Email: marko@gmail.com, Connections: 4
ID: 104, Username: peter, Password length: 16, Email: peter@outlook.com, Connections: 2
ID: 105, Username: lucy, Password length: 17, Email: lucy@gmail.com, Connections: 9
*/
