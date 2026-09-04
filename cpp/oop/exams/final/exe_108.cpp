/*
Да се дефинира апстрактна класа User со следниве спецификации (5 поени):

    username (стринг)
    password (стринг)
    email (стринг)

Класата треба да содржи следниве чисто виртуелни функции:

    void printDetail() — функција која ги печати сите информации за корисникот
    int checkPasswordStrength() — функција што враќа цел број што означува колку е силна лозинката

Да се дефинираат две класи RegularUser и AdminUser кои ја наследуваат класата User (5 поени).

За класата RegularUser, дополнително се чува:

    has2FA (bool) — дали е активирана двофакторска автентикација

Јачината на лозинката кај RegularUser се пресметува на следниов начин: (10 поени)

    +2 поени ако лозинката е долга најмалку 6 карактери
    +1 ако содржи барем една мала буква
    +1 ако последниот карактер не е цифра
    +1 ако е вклучена 2FA

Функцијата printDetail() ги печати информациите во следниот формат: (5 поени)

[корисничко име] (Regular) - Email: [email] - 2FA: [Yes/No] - Strength: [јачина]

За класата AdminUser, дополнително се чуваат:

    department (стринг) — име на оддел
    usesPasswordManager (bool) — дали корисникот користи password manager

Јачината на лозинката кај AdminUser се пресметува на следниов начин: (10 поени)

    +2 поени ако должината е најмалку 10
    +2 ако содржи голема буква
    +1 ако првиот карактер не е голема буква
    +2 ако се користи password manager

Функцијата printDetail() ги печати информациите во следниот формат: (5 поени)

[корисничко име] (Admin) - Email: [email] - Dept: [оддел] - PM: [Yes/No] - Strength: [јачина]

Да се дефинира глобална функција: (10 поени)

void printAdminUserStats(User** users, int n);

Функцијата прима низа од покажувачи кон објекти од тип User, ги филтрира само објектите од тип AdminUser, ги печати нивните детали и ја пресметува и прикажува просечната јачина на лозинка само за нив. За заокружување на децималните броеви користете ја библиотеката #include <iomanip> и функцијата cout << fixed << setprecision(2).

---

Define an abstract class User with the following specifications (5 points):

    username (string)
    password (string)
    email (string)

The class should include the following pure virtual functions:

    void printDetail() — a function that prints all user information
    int checkPasswordStrength() — a function that returns an integer score representing the strength of the password

Define two classes RegularUser and AdminUser that inherit from the User class (5 points).

For the RegularUser class, the following additional attributes are stored:

    has2FA (bool) — whether two-factor authentication is enabled

Password strength for a RegularUser is calculated as follows: (10 points)

    +2 points if the password is at least 6 characters long
    +1 if it contains at least one lowercase letter
    +1 if the last character is not a digit
    +1 if 2FA is enabled

The printDetail() function should print user info in the following format: (5 points)

[username] (Regular) - Email: [email] - 2FA: [Yes/No] - Strength: [score]

For the AdminUser class, the following additional attributes are stored:

    department (string) — the name of the department
    usesPasswordManager (bool) — whether the user uses a password manager

Password strength for an AdminUser is calculated as follows: (10 points)

    +2 points if the password length is at least 10 characters
    +2 if it contains an uppercase letter
    +1 if the first character is not an uppercase letter
    +2 if a password manager is used

The printDetail() function should print admin info in the following format: (5 points)

[username] (Admin) - Email: [email] - Dept: [department] - PM: [Yes/No] - Strength: [score]

Define the following global function: (10 points)

void printAdminUserStats(User** users, int n);

This function receives an array of pointers to User objects, filters out only those of type AdminUser, prints their details, and calculates and displays the average password strength for them only. To round decimal numbers, use the library #include <iomanip> and the function cout << fixed << setprecision(2).

For example:

Input 	Result

1
2
1
alex.taylor
lozinka123a
alex.taylor@example.com
1
2
david.roberts
Secure*Pass99
david.roberts@company.com
IT Department
1


Abstract and child classes OK
----------------------------------
2
3
1
emily.clark
abc123z
emily.clark@mail.com
0
2
oliver.james
Qwe!123456
oliver.james@cybertech.io
Security
1
2
sophia.hughes
StrongPass!
sophia.hughes@itglobal.org
R&D
1


4
6
6
checkPasswordStrength method OK
----------------------------------
3
2
1
lucas.morris
passz1
lucas.morris@devhub.io
1
2
ava.bennett
XpassW0rd!
ava.bennett@infra.net
Operations
0


lucas.morris (Regular) - Email: lucas.morris@devhub.io - 2FA: Yes - Strength: 4
ava.bennett (Admin) - Email: ava.bennett@infra.net - Dept: Operations - PM: No - Strength: 4
printDetail method OK
----------------------------------
4
3
1
nathan.brooks
zxcvb2
nathan.brooks@mail.com
1
2
mia.dixon
Admin#Pass11
mia.dixon@cyber.ai
Cyber Division
1
2
noah.evans
adminpass
noah.evans@research.org
AI Lab
0


--- Admin Users ---
mia.dixon (Admin) - Email: mia.dixon@cyber.ai - Dept: Cyber Division - PM: Yes - Strength: 6
noah.evans (Admin) - Email: noah.evans@research.org - Dept: AI Lab - PM: No - Strength: 1
Average Admin Strength: 3.50
printAdminUserStats method OK
*/
