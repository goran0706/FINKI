/*
Да се дефинира класа Account со следните информации:

    ownerName (string)

    amount (float)

Потребно е да се имплементираат потребните конструктори, деструктор, getters и setters за Account (5 поени).

Да се дефинира апстрактна класа Taxable со следните чисто виртуелни функции (5 поени):

    float getAmount() — ја враќа состојбата на сметката пред каков било данок или камата

    float getTaxedAmount() — ја враќа конечната состојба по сите пресметки на данок

    void printDetails() — печати детали за Taxable

Да се дефинираат две класи SavingsAccount и BusinessAccount кои наследуваат од Account и Taxable (5 поени).

За класата SavingsAccount, се чуваат следните дополнителни атрибути:

    interestRate (float) — годишната каматна стапка (пр. 0.05 за 5%)
    interestTaxRate (float) — даночната стапка применета на заработената камата, е иста за секој објект од SavingsAccount, иницијална вредност е 0.10 (10%)

Да се имплементираат getter getInterestTaxRate() и setter setInterestTaxRate() за interestTaxRate. (5 поени)

getTaxedAmount() се пресметува на следниов начин (5 поени):

InterestEarned = amount * interestRate

TaxOnInterest = interestEarned * interestTaxRate

Конечна состојба = amount + interestEarned - taxOnInterest



getAmount() ја враќа состојбата без никакви измени. (2 поени)

printDetails() го печати секој SavingsAccount во следниот формат (2 поени):

[ownerName] (Savings) - Interest Rate: [interestRate] - Raw Amount: [amount] - After Tax: [taxedAmount]

За класата BusinessAccount, се чуваат следните дополнителни атрибути:

    businessType (string) — типот на бизнис (пр. "LLC", "Corp")
    corporateTaxRate (float) — даночната стапка применета на целата состојба на сметката, е иста за секој објект од BusinessAccount, почетна вредност е 0.20 (20%)



Да се имплементираат getter getCorporateTaxRate() и setter setCorporateTaxRate() за corporateTaxRate. (5 поени)



getTaxedAmount() се пресметува на следниов начин (5 поени):

TaxOnBalance = amount * corporateTaxRate

Конечна состојба = amount - taxOnBalance



getAmount() ја враќа состојбата без никакви измени. (2 поени)



printDetails() го печати секој BusinessAccount во следниот формат (2 поени):

[ownerName] (Business) - Type: [businessType] - Raw Amount: [amount] - After Tax: [taxedAmount]

Да се дефинира следнава глобална функција (7 поени):

void printBusinessAccountStats(Taxable** accounts, int n)

Оваа функција прима низа од покажувачи од Taxable објекти, ги филтрира само оние од тип BusinessAccount, ги печати нивните детали и ја пресметува и прикажува просечната конечна состојба (по данок) само за нив. Доколку нема деловни сметки, треба да се испечати пораката "There are no business accounts".

Искористете #include <iomanip> и cout << fixed << setprecision(2) за заокружување.

Define a class Account with the following specifications:

    ownerName (string)
    amount (float)

Implement the needed constructors, destructor, getters and setters for Account. (5 points)

Define an abstract class Taxable with the following pure virtual functions (5 points):

    float getAmount() — returns the raw account balance before any tax or interest
    float getTaxedAmount() — returns the final balance after all tax calculations are applied
    void printDetails() - prints details for Taxable

Define two classes SavingsAccount and BusinessAccount that inherit from both Account and Taxable (5 points).

For the SavingsAccount class, the following additional attributes are stored:

    interestRate (float) — the annual interest rate (e.g. 0.05 for 5%)
    interestTaxRate (float) — the tax rate applied on the interest earned, is the same for each object of SavingsAccount, default value is 0.10 (10%)

Implement a getter getInterestTaxRate() and a setter setInterestTaxRate() for interestTaxRate. (5 points)

getTaxedAmount() is calculated as follows (5 points):

InterestEarned = amount * interestRate
TaxOnInterest = interestEarned * interestTaxRate
Final balance = amount + interestEarned - taxOnInterest

getAmount() returns the raw amount with no modifications. (2 points)

printDetails() prints each SavingsAccount in the following format (2 points):
[ownerName] (Savings) - Interest Rate: [interestRate] - Raw Amount: [amount] - After Tax: [taxedAmount]

For the BusinessAccount class, the following additional attributes are stored:

    businessType (string) — the type of business (e.g. "LLC", "Corp")
    corporateTaxRate (float) — the tax rate applied on the full account balance, is the same for each object of BusinessAccount, default value is 0.20 (20%)

Implement a getter getCorporateTaxRate() and a setter setCorporateTaxRate() for corporateTaxRate. (5 points)

getTaxedAmount() is calculated as follows (5 points):

TaxOnBalance = amount * corporateTaxRate
Final balance = amount - taxOnBalance

getAmount() returns the raw amount with no modifications. (2 points)

printDetails prints each BusinessAccount in the following format (2 points):
[ownerName] (Business) - Type: [businessType] - Raw Amount: [amount] - After Tax: [taxedAmount]

Define the following global function (7 points):
void printBusinessAccountStats(Taxable** accounts, int n)
This function receives an array of pointers to Taxable objects, filters out only those of type BusinessAccount, prints their details, and calculates and displays the average final balance (after tax) for them only. If there are no business accounts print the message "There are no business accounts"

Use #include <iomanip> and cout << fixed << setprecision(2) for rounding.

For example:

Test 	Result

Account a = Account("Owner", 100.00);
cout<<"Account owner: "<<a.getOwnerName()<<endl;
cout<<"Account amount: "<<a.getAmount()<<endl;
a.setOwnerName("New Owner");
cout<<"Account owner: "<<a.getOwnerName()<<endl;
cout<<"Account amount: "<<a.getAmount()<<endl;
a.setAmount(150.00);
cout<<"Account owner: "<<a.getOwnerName()<<endl;
cout<<"Account amount: "<<a.getAmount()<<endl;



Account owner: Owner
Account amount: 100
Account owner: New Owner
Account amount: 100
Account owner: New Owner
Account amount: 150
----------------------------------
cout<<"Savings account tax rate: "<<SavingsAccount::getInterestTaxRate()<<endl;
SavingsAccount::setInterestTaxRate(0.15);
cout<<"Savings account tax rate: "<<SavingsAccount::getInterestTaxRate()<<endl;



Savings account tax rate: 0.1
Savings account tax rate: 0.15
----------------------------------
SavingsAccount sa1("Owner1", 100.00, 0.05);
SavingsAccount sa2("Owner2", 500.00, 0.15);
SavingsAccount sa3("Owner3", 700.00, 0.08);
cout<<"Testing getTaxedAmount() for SavingsAccount"<<endl;
cout<<sa1.getTaxedAmount()<<endl;
cout<<sa2.getTaxedAmount()<<endl;
cout<<sa3.getTaxedAmount()<<endl;



Testing getTaxedAmount() for SavingsAccount
104.5
567.5
750.4
----------------------------------
SavingsAccount sa1("Owner1", 100.00, 0.05);
SavingsAccount sa2("Owner2", 500.00, 0.15);
SavingsAccount sa3("Owner3", 700.00, 0.08);
cout<<"Testing getAmount() for SavingsAccount"<<endl;
cout<<sa1.getAmount()<<endl;
cout<<sa2.getAmount()<<endl;
cout<<sa3.getAmount()<<endl;



Testing getAmount() for SavingsAccount
100
500
700
----------------------------------
SavingsAccount sa1("Owner1", 100.00, 0.05);
SavingsAccount sa2("Owner2", 500.00, 0.15);
SavingsAccount sa3("Owner3", 700.00, 0.08);
cout<<"Testing printDetails() for SavingsAccount"<<endl;
sa1.printDetails();
sa2.printDetails();
sa3.printDetails();



Testing printDetails() for SavingsAccount
Owner1 (Savings) - Interest Rate: 0.05 - Raw Amount: 100.00 - After Tax: 104.50
Owner2 (Savings) - Interest Rate: 0.15 - Raw Amount: 500.00 - After Tax: 567.50
Owner3 (Savings) - Interest Rate: 0.08 - Raw Amount: 700.00 - After Tax: 750.40
----------------------------------
cout<<"Business account tax rate: "<<BusinessAccount::getCorporateTaxRate()<<endl;
BusinessAccount::setCorporateTaxRate(0.15);
cout<<"Business account tax rate: "<<BusinessAccount::getCorporateTaxRate()<<endl;



Business account tax rate: 0.2
Business account tax rate: 0.15
----------------------------------
BusinessAccount ba1("Owner1", 100.00, "Corp");
BusinessAccount ba2("Owner2", 500.00, "LLC");
BusinessAccount ba3("Owner3", 700.00, "Corp");
cout<<"Testing getTaxedAmount() for BusinessAccount"<<endl;
cout<<ba1.getTaxedAmount()<<endl;
cout<<ba2.getTaxedAmount()<<endl;
cout<<ba3.getTaxedAmount()<<endl;



Testing getTaxedAmount() for BusinessAccount
80
400
560
----------------------------------
BusinessAccount ba1("Owner1", 100.00, "Corp");
BusinessAccount ba2("Owner2", 500.00, "LLC");
BusinessAccount ba3("Owner3", 700.00, "Corp");
cout<<"Testing getAmount() for BusinessAccount"<<endl;
cout<<ba1.getAmount()<<endl;
cout<<ba2.getAmount()<<endl;
cout<<ba3.getAmount()<<endl;



Testing getAmount() for BusinessAccount
100
500
700
----------------------------------
BusinessAccount ba1("Owner1", 100.00, "Corp");
BusinessAccount ba2("Owner2", 500.00, "LLC");
BusinessAccount ba3("Owner3", 700.00, "LLC");
cout<<"Testing printDetails() for BusinessAccount"<<endl;
ba1.printDetails();
ba2.printDetails();
ba3.printDetails();



Testing printDetails() for BusinessAccount
Owner1 (Business) - Type: Corp - Raw Amount: 100.00 - After Tax: 80.00
Owner2 (Business) - Type: LLC - Raw Amount: 500.00 - After Tax: 400.00
Owner3 (Business) - Type: LLC - Raw Amount: 700.00 - After Tax: 560.00
----------------------------------
Taxable ** t = new Taxable *[10];
t[0] = new SavingsAccount("Owner1", 100.00, 0.05);
t[1] = new BusinessAccount("Owner1", 150.00, "Corp");
t[2] = new SavingsAccount("Owner2", 500.00, 0.15);
t[3] = new SavingsAccount("Owner3", 700.00, 0.08);
t[4] = new BusinessAccount("Owner3", 750.00, "LLC");
t[5] = new BusinessAccount("Owner2", 1305.00, "Corp");
t[6] = new BusinessAccount("Owner3", 2000.00, "Corp");
t[7] = new SavingsAccount("Owner3", 1700.00, 0.07);
t[8] = new BusinessAccount("Owner1", 300.00, "LLC");
t[9] = new BusinessAccount("Owner4", 553.00, "LLC");

printBusinessAccountStats(t, 10);



Owner1 (Business) - Type: Corp - Raw Amount: 150.00 - After Tax: 120.00
Owner3 (Business) - Type: LLC - Raw Amount: 750.00 - After Tax: 600.00
Owner2 (Business) - Type: Corp - Raw Amount: 1305.00 - After Tax: 1044.00
Owner3 (Business) - Type: Corp - Raw Amount: 2000.00 - After Tax: 1600.00
Owner1 (Business) - Type: LLC - Raw Amount: 300.00 - After Tax: 240.00
Owner4 (Business) - Type: LLC - Raw Amount: 553.00 - After Tax: 442.40
Average final balance (Business): 674.40
----------------------------------
Taxable ** t = new Taxable *[10];
t[0] = new SavingsAccount("Owner1", 100.00, 0.05);
t[1] = new BusinessAccount("Owner1", 150.00, "Corp");
t[2] = new SavingsAccount("Owner2", 500.00, 0.15);
t[3] = new SavingsAccount("Owner3", 700.00, 0.08);
t[4] = new BusinessAccount("Owner3", 750.00, "LLC");
t[5] = new BusinessAccount("Owner2", 1305.00, "Corp");
t[6] = new BusinessAccount("Owner3", 2100.00, "Corp");
t[7] = new SavingsAccount("Owner3", 1700.00, 0.07);
t[8] = new BusinessAccount("Owner1", 300.00, "LLC");
t[9] = new BusinessAccount("Owner4", 1400.00, "LLC");

printBusinessAccountStats(t, 10);



Owner1 (Business) - Type: Corp - Raw Amount: 150.00 - After Tax: 120.00
Owner3 (Business) - Type: LLC - Raw Amount: 750.00 - After Tax: 600.00
Owner2 (Business) - Type: Corp - Raw Amount: 1305.00 - After Tax: 1044.00
Owner3 (Business) - Type: Corp - Raw Amount: 2100.00 - After Tax: 1680.00
Owner1 (Business) - Type: LLC - Raw Amount: 300.00 - After Tax: 240.00
Owner4 (Business) - Type: LLC - Raw Amount: 1400.00 - After Tax: 1120.00
Average final balance (Business): 800.67
----------------------------------
Taxable ** t = new Taxable *[10];
t[0] = new SavingsAccount("Owner1", 100.00, 0.05);
t[1] = new BusinessAccount("Owner1", 80.00, "Corp");
t[2] = new SavingsAccount("Owner2", 500.00, 0.15);
t[3] = new SavingsAccount("Owner3", 700.00, 0.08);
t[4] = new BusinessAccount("Owner3", 750.00, "LLC");
t[5] = new BusinessAccount("Owner2", 1305.00, "Corp");
t[6] = new BusinessAccount("Owner3", 2100.00, "Corp");
t[7] = new SavingsAccount("Owner3", 2500.00, 0.07);
t[8] = new BusinessAccount("Owner1", 300.00, "LLC");
t[9] = new BusinessAccount("Owner4", 1400.00, "LLC");

printBusinessAccountStats(t, 10);



Owner1 (Business) - Type: Corp - Raw Amount: 80.00 - After Tax: 64.00
Owner3 (Business) - Type: LLC - Raw Amount: 750.00 - After Tax: 600.00
Owner2 (Business) - Type: Corp - Raw Amount: 1305.00 - After Tax: 1044.00
Owner3 (Business) - Type: Corp - Raw Amount: 2100.00 - After Tax: 1680.00
Owner1 (Business) - Type: LLC - Raw Amount: 300.00 - After Tax: 240.00
Owner4 (Business) - Type: LLC - Raw Amount: 1400.00 - After Tax: 1120.00
Average final balance (Business): 791.33
----------------------------------
Taxable ** t = new Taxable *[10];
t[0] = new SavingsAccount("Owner1", 100.00, 0.05);
t[1] = new SavingsAccount("Owner1", 80.00, 0.05);
t[2] = new SavingsAccount("Owner2", 500.00, 0.15);
t[3] = new SavingsAccount("Owner3", 700.00, 0.08);
t[4] = new SavingsAccount("Owner3", 750.00, 0.05);
t[5] = new SavingsAccount("Owner2", 1305.00, 0.05);
t[6] = new SavingsAccount("Owner3", 2100.00, 0.05);
t[7] = new SavingsAccount("Owner3", 2500.00, 0.07);
t[8] = new SavingsAccount("Owner1", 300.00, 0.05);
t[9] = new SavingsAccount("Owner4", 1400.00, 0.05);

printBusinessAccountStats(t, 10);



There are no business accounts
----------------------------------
Taxable ** t = new Taxable *[10];
t[0] = new SavingsAccount("Owner1", 100.00, 0.05);
t[1] = new BusinessAccount("Owner1", 80.00, "Corp");
t[2] = new SavingsAccount("Owner2", 500.00, 0.15);
t[3] = new SavingsAccount("Owner3", 700.00, 0.08);
t[4] = new BusinessAccount("Owner3", 750.00, "LLC");
t[5] = new BusinessAccount("Owner2", 1305.00, "Corp");
t[6] = new BusinessAccount("Owner3", 2100.00, "Corp");
t[7] = new SavingsAccount("Owner3", 2500.00, 0.07);
t[8] = new BusinessAccount("Owner1", 300.00, "LLC");
t[9] = new BusinessAccount("Owner4", 1400.00, "LLC");

for (int i=0;i<10;i++){
    t[i]->printDetails();
}
cout<<endl;
printBusinessAccountStats(t, 10);



Owner1 (Savings) - Interest Rate: 0.05 - Raw Amount: 100.00 - After Tax: 104.50
Owner1 (Business) - Type: Corp - Raw Amount: 80.00 - After Tax: 64.00
Owner2 (Savings) - Interest Rate: 0.15 - Raw Amount: 500.00 - After Tax: 567.50
Owner3 (Savings) - Interest Rate: 0.08 - Raw Amount: 700.00 - After Tax: 750.40
Owner3 (Business) - Type: LLC - Raw Amount: 750.00 - After Tax: 600.00
Owner2 (Business) - Type: Corp - Raw Amount: 1305.00 - After Tax: 1044.00
Owner3 (Business) - Type: Corp - Raw Amount: 2100.00 - After Tax: 1680.00
Owner3 (Savings) - Interest Rate: 0.07 - Raw Amount: 2500.00 - After Tax: 2657.50
Owner1 (Business) - Type: LLC - Raw Amount: 300.00 - After Tax: 240.00
Owner4 (Business) - Type: LLC - Raw Amount: 1400.00 - After Tax: 1120.00

Owner1 (Business) - Type: Corp - Raw Amount: 80.00 - After Tax: 64.00
Owner3 (Business) - Type: LLC - Raw Amount: 750.00 - After Tax: 600.00
Owner2 (Business) - Type: Corp - Raw Amount: 1305.00 - After Tax: 1044.00
Owner3 (Business) - Type: Corp - Raw Amount: 2100.00 - After Tax: 1680.00
Owner1 (Business) - Type: LLC - Raw Amount: 300.00 - After Tax: 240.00
Owner4 (Business) - Type: LLC - Raw Amount: 1400.00 - After Tax: 1120.00
Average final balance (Business): 791.33
----------------------------------
Taxable ** t = new Taxable *[10];
t[0] = new SavingsAccount("Owner1", 120.00, 0.08);
t[1] = new BusinessAccount("Owner1", 90.00, "LLC");
t[2] = new SavingsAccount("Owner2", 520.00, 0.11);
t[3] = new SavingsAccount("Owner3", 700.00, 0.10);
t[4] = new BusinessAccount("Owner5", 7200.00, "Corp");
t[5] = new BusinessAccount("Owner2", 1305.00, "Corp");
t[6] = new BusinessAccount("Owner2", 200.00, "LLC");
t[7] = new SavingsAccount("Owner2", 250.00, 0.17);
t[8] = new BusinessAccount("Owner5", 315.00, "LLC");
t[9] = new BusinessAccount("Owner4", 1400.00, "LLC");

for (int i=0;i<10;i++){
    t[i]->printDetails();
}
cout<<endl;
printBusinessAccountStats(t, 10);



Owner1 (Savings) - Interest Rate: 0.08 - Raw Amount: 120.00 - After Tax: 128.64
Owner1 (Business) - Type: LLC - Raw Amount: 90.00 - After Tax: 72.00
Owner2 (Savings) - Interest Rate: 0.11 - Raw Amount: 520.00 - After Tax: 571.48
Owner3 (Savings) - Interest Rate: 0.10 - Raw Amount: 700.00 - After Tax: 763.00
Owner5 (Business) - Type: Corp - Raw Amount: 7200.00 - After Tax: 5760.00
Owner2 (Business) - Type: Corp - Raw Amount: 1305.00 - After Tax: 1044.00
Owner2 (Business) - Type: LLC - Raw Amount: 200.00 - After Tax: 160.00
Owner2 (Savings) - Interest Rate: 0.17 - Raw Amount: 250.00 - After Tax: 288.25
Owner5 (Business) - Type: LLC - Raw Amount: 315.00 - After Tax: 252.00
Owner4 (Business) - Type: LLC - Raw Amount: 1400.00 - After Tax: 1120.00

Owner1 (Business) - Type: LLC - Raw Amount: 90.00 - After Tax: 72.00
Owner5 (Business) - Type: Corp - Raw Amount: 7200.00 - After Tax: 5760.00
Owner2 (Business) - Type: Corp - Raw Amount: 1305.00 - After Tax: 1044.00
Owner2 (Business) - Type: LLC - Raw Amount: 200.00 - After Tax: 160.00
Owner5 (Business) - Type: LLC - Raw Amount: 315.00 - After Tax: 252.00
Owner4 (Business) - Type: LLC - Raw Amount: 1400.00 - After Tax: 1120.00
Average final balance (Business): 1401.33
*/
