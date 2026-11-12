/*
Да се дефинира класа Employee со следните информации:

    name - име на вработениот(string)

    baseSalary - основна плата на вработениот (float)

Потребно е да се имплементираат потребните конструктори, деструктор, методи get и set за класата Employee.

Да се дефинира апстрактна класа Payable со следните чисто виртуелни функции:

    float getBaseSalary() - ја враќа основната плата пред каква било пресметка

    float getNetSalary() - ја враќа конечната (нето) плата по сите пресметки

    void printDetails() - печати детали за објектот

Да се дефинираат две класи FullTimeEmployee и Contractor кои наследуваат од Employee и Payable.

За класата FullTimeEmployee, се чуваат следните дополнителни атрибути:

    overtimeHours (float) - бројот на прекувремени работни часови
    incomeTaxRate (float) - даночната стапка применета на платата, иста е за сите објекти од класата FullTimeEmployee, со иницијална вредност 0.10

Да се имплементираат методите getIncomeTaxRate() и setIncomeTaxRate() за incomeTaxRate.

Функцијата getNetSalary() ја враќа нето платата. Таа се пресметува така што се започнува од основната плата (baseSalary), а потоа се применуваат следните правила:

    Се додава надомест за прекувремена работа, пресметан како бројот на прекувремени часови (overtimeHours) помножен со 20.
    На крај, на добиената сума ѝ се одзема данокот на доход, кој изнесува incomeTaxRate (иницијално 10%) од таа сума; резултатот е нето платата.

Функцијата getBaseSalary() ја враќа основната плата без никакви измени.

Функцијата printDetails() го печати секој FullTimeEmployee во следниот формат:

[name] (FullTime) - Overtime: [overtimeHours]h - Base Salary: [baseSalary] - Net Salary: [netSalary]

За класата Contractor, се чуваат следните дополнителни атрибути:

    completedProjects (int) - бројот на завршени проекти
    serviceFeeRate (float) - стапката на провизија применета на платата, иста е за сите објекти од класата Contractor, со почетна вредност 0.15

Да се имплементираат методите getServiceFeeRate() и setServiceFeeRate() за serviceFeeRate.

Функцијата getNetSalary() ја враќа нето платата. Таа се пресметува така што се започнува од основната плата (baseSalary), а потоа се применуваат следните правила:

    Се додава бонус за завршените проекти, пресметан како бројот на завршени проекти (completedProjects) помножен со 100.
    На крај, на добиената сума ѝ се одзема провизијата за услугата, која изнесува serviceFeeRate (иницијално 15%) од таа сума; резултатот е нето платата.

Функцијата getBaseSalary() ја враќа основната плата без никакви измени.

Функцијата printDetails() го печати секој Contractor во следниот формат:

[name] (Contractor) - Projects: [completedProjects] - Base Salary: [baseSalary] - Net Salary: [netSalary]

Да се дефинира класа за исклучок NoContractorException, а потоа да се дефинираат следните глобални функции:

Contractor* findHighestPaidContractor(Payable** employees, int n)

Оваа функција прима низа од покажувачи од Payable објекти, ги филтрира само оние од тип Contractor и го враќа најплатениот меѓу нив (оној со највисока нето плата). Доколку повеќе Contractor објекти имаат иста нето плата, се враќа оној со повеќе завршени проекти (completedProjects). Доколку во низата нема ниту еден Contractor, функцијата треба да фрли исклучок од тип NoContractorException.

void printHighestPaidContractor(Payable** employees, int n)

Оваа функција ја повикува findHighestPaidContractor. Доколку е вратен Contractor, ги печати неговите детали. Доколку се фати исклучок од тип NoContractorException, се печати пораката "There are no contractors".

Искористете #include <iomanip> и cout << fixed << setprecision(2) за заокружување.

Define a class Employee with the following specifications:

    name (string)
    baseSalary (float)

Implement the needed constructors, destructor, getters and setters for Employee.

Define an abstract class Payable with the following pure virtual functions:

    float getBaseSalary() - returns the raw base salary before any calculation
    float getNetSalary() - returns the final (net) salary after all calculations are applied
    void printDetails() - prints details for Payable

Define two classes FullTimeEmployee and Contractor that inherit from both Employee and Payable.

For the FullTimeEmployee class, the following additional attributes are stored:

    overtimeHours (float) - the number of overtime hours worked
    incomeTaxRate (float) - the tax rate applied on the salary, is the same for each object of FullTimeEmployee, default value is 0.10

Implement a getter getIncomeTaxRate() and a setter setIncomeTaxRate() for incomeTaxRate.

Function getNetSalary() returns the net salary. It is calculated by starting from the base salary (baseSalary) and then:

    Add the overtime pay, calculated as the number of overtime hours (overtimeHours) multiplied by 20.
    Finally, from the resulting amount subtract the income tax, which is incomeTaxRate (initially 10%) of that amount; the result is the net salary.

Function getBaseSalary() returns the raw base salary with no modifications.

printDetails() prints each FullTimeEmployee in the following format:
[name] (FullTime) - Overtime: [overtimeHours]h - Base Salary: [baseSalary] - Net Salary: [netSalary]

For the Contractor class, the following additional attributes are stored:

    completedProjects (int) - the number of completed projects
    serviceFeeRate (float) - the service fee rate applied on the salary, is the same for each object of Contractor, default value is 0.15 (15%)

Implement a getter getServiceFeeRate() and a setter setServiceFeeRate() for serviceFeeRate.

Function getNetSalary() returns the net salary. It is calculated by starting from the base salary (baseSalary) and then:

    Add a bonus for the completed projects, calculated as the number of completed projects (completedProjects) multiplied by 100.
    Finally, from the resulting amount subtract the service fee, which is serviceFeeRate (initially 15%) of that amount; the result is the net salary.

Function getBaseSalary() returns the raw base salary with no modifications.

Function printDetails prints each Contractor in the following format:
[name] (Contractor) - Projects: [completedProjects] - Base Salary: [baseSalary] - Net Salary: [netSalary]

Define an exception class NoContractorException, and then define the following global functions (3 points for the exception class):

Contractor* findHighestPaidContractor(Payable** employees, int n)
This function receives an array of pointers to Payable objects, filters out only those of type Contractor, and returns the highest paid one among them (the one with the highest net salary). If multiple Contractor objects have the same net salary, return the one with more completed projects (completedProjects). If there is no Contractor in the array, the function should throw an exception of type NoContractorException.

void printHighestPaidContractor(Payable** employees, int n)
This function calls findHighestPaidContractor. If a Contractor is returned, it prints its details. If a NoContractorException is caught, it prints the message "There are no contractors".

Use #include <iomanip> and cout << fixed << setprecision(2) for rounding.

Test 	Result

Employee e = Employee("Worker", 45000.00);
cout<<"Employee name: "<<e.getName()<<endl;
cout<<"Employee base salary: "<<e.getBaseSalary()<<endl;
e.setName("New Worker");
cout<<"Employee name: "<<e.getName()<<endl;
cout<<"Employee base salary: "<<e.getBaseSalary()<<endl;
e.setBaseSalary(50000.00);
cout<<"Employee name: "<<e.getName()<<endl;
cout<<"Employee base salary: "<<e.getBaseSalary()<<endl;


Employee name: Worker
Employee base salary: 45000
Employee name: New Worker
Employee base salary: 45000
Employee name: New Worker
Employee base salary: 50000
----------------------------------
cout<<"Full time tax rate: "<<FullTimeEmployee::getIncomeTaxRate()<<endl;
FullTimeEmployee::setIncomeTaxRate(0.15);
cout<<"Full time tax rate: "<<FullTimeEmployee::getIncomeTaxRate()<<endl;


Full time tax rate: 0.1
Full time tax rate: 0.15
----------------------------------
FullTimeEmployee f1("Owner1", 45000.00, 10);
FullTimeEmployee f2("Owner2", 28000.00, 50);
FullTimeEmployee f3("Owner3", 60000.00, 5);
cout<<"Testing getNetSalary() for FullTimeEmployee"<<endl;
cout<<f1.getNetSalary()<<endl;
cout<<f2.getNetSalary()<<endl;
cout<<f3.getNetSalary()<<endl;


Testing getNetSalary() for FullTimeEmployee
40680
26100
54090
----------------------------------
FullTimeEmployee f1("Owner1", 45000.00, 10);
FullTimeEmployee f2("Owner2", 28000.00, 50);
FullTimeEmployee f3("Owner3", 60000.00, 5);
cout<<"Testing getBaseSalary() for FullTimeEmployee"<<endl;
cout<<f1.getBaseSalary()<<endl;
cout<<f2.getBaseSalary()<<endl;
cout<<f3.getBaseSalary()<<endl;


Testing getBaseSalary() for FullTimeEmployee
45000
28000
60000
----------------------------------
FullTimeEmployee f1("Owner1", 45000.00, 10);
FullTimeEmployee f2("Owner2", 28000.00, 50);
FullTimeEmployee f3("Owner3", 60000.00, 5);
cout<<"Testing printDetails() for FullTimeEmployee"<<endl;
f1.printDetails();
f2.printDetails();
f3.printDetails();


Testing printDetails() for FullTimeEmployee
Owner1 (FullTime) - Overtime: 10.00h - Base Salary: 45000.00 - Net Salary: 40680.00
Owner2 (FullTime) - Overtime: 50.00h - Base Salary: 28000.00 - Net Salary: 26100.00
Owner3 (FullTime) - Overtime: 5.00h - Base Salary: 60000.00 - Net Salary: 54090.00
----------------------------------
cout<<"Contractor fee rate: "<<Contractor::getServiceFeeRate()<<endl;
Contractor::setServiceFeeRate(0.20);
cout<<"Contractor fee rate: "<<Contractor::getServiceFeeRate()<<endl;


Contractor fee rate: 0.15
Contractor fee rate: 0.2
----------------------------------
Contractor c1("Owner1", 40000.00, 3);
Contractor c2("Owner2", 50000.00, 7);
Contractor c3("Owner3", 30000.00, 12);
cout<<"Testing getNetSalary() for Contractor"<<endl;
cout<<c1.getNetSalary()<<endl;
cout<<c2.getNetSalary()<<endl;
cout<<c3.getNetSalary()<<endl;


Testing getNetSalary() for Contractor
34255
43095
26520
----------------------------------
Contractor c1("Owner1", 40000.00, 3);
Contractor c2("Owner2", 50000.00, 7);
Contractor c3("Owner3", 30000.00, 12);
cout<<"Testing getBaseSalary() for Contractor"<<endl;
cout<<c1.getBaseSalary()<<endl;
cout<<c2.getBaseSalary()<<endl;
cout<<c3.getBaseSalary()<<endl;


Testing getBaseSalary() for Contractor
40000
50000
30000
----------------------------------
Contractor c1("Owner1", 40000.00, 3);
Contractor c2("Owner2", 50000.00, 7);
Contractor c3("Owner3", 30000.00, 12);
cout<<"Testing printDetails() for Contractor"<<endl;
c1.printDetails();
c2.printDetails();
c3.printDetails();


Testing printDetails() for Contractor
Owner1 (Contractor) - Projects: 3 - Base Salary: 40000.00 - Net Salary: 34255.00
Owner2 (Contractor) - Projects: 7 - Base Salary: 50000.00 - Net Salary: 43095.00
Owner3 (Contractor) - Projects: 12 - Base Salary: 30000.00 - Net Salary: 26520.00
----------------------------------
Payable ** t = new Payable *[10];
t[0] = new FullTimeEmployee("Owner1", 45000.00, 10);
t[1] = new Contractor("Owner1", 40000.00, 3);
t[2] = new FullTimeEmployee("Owner2", 50000.00, 15);
t[3] = new Contractor("Owner3", 70000.00, 8);
t[4] = new FullTimeEmployee("Owner3", 75000.00, 0);
t[5] = new Contractor("Owner2", 52000.00, 12);
t[6] = new Contractor("Owner3", 30000.00, 4);
t[7] = new FullTimeEmployee("Owner3", 41000.00, 7);
t[8] = new Contractor("Owner1", 48000.00, 9);
t[9] = new Contractor("Owner4", 55300.00, 2);

printHighestPaidContractor(t, 10);


Owner3 (Contractor) - Projects: 8 - Base Salary: 70000.00 - Net Salary: 60180.00
----------------------------------
Payable ** t = new Payable *[10];
t[0] = new FullTimeEmployee("Owner1", 45000.00, 10);
t[1] = new Contractor("Owner1", 40000.00, 3);
t[2] = new FullTimeEmployee("Owner2", 50000.00, 15);
t[3] = new Contractor("Owner3", 70000.00, 8);
t[4] = new FullTimeEmployee("Owner3", 75000.00, 0);
t[5] = new Contractor("Owner2", 52000.00, 12);
t[6] = new Contractor("Owner3", 90000.00, 4);
t[7] = new FullTimeEmployee("Owner3", 41000.00, 7);
t[8] = new Contractor("Owner1", 48000.00, 9);
t[9] = new Contractor("Owner4", 55300.00, 2);

printHighestPaidContractor(t, 10);


Owner3 (Contractor) - Projects: 4 - Base Salary: 90000.00 - Net Salary: 76840.00
----------------------------------
Payable ** t = new Payable *[5];
t[0] = new FullTimeEmployee("Owner1", 45000.00, 10);
t[1] = new Contractor("Tie1", 40900.00, 6);
t[2] = new Contractor("Tie2", 40600.00, 9);
t[3] = new Contractor("Low", 20000.00, 3);
t[4] = new FullTimeEmployee("Owner2", 50000.00, 15);

printHighestPaidContractor(t, 5);


Tie2 (Contractor) - Projects: 9 - Base Salary: 40600.00 - Net Salary: 35275.00
----------------------------------
Payable ** t = new Payable *[4];
t[0] = new FullTimeEmployee("Owner1", 45000.00, 10);
t[1] = new FullTimeEmployee("Owner2", 28000.00, 50);
t[2] = new FullTimeEmployee("Owner3", 60000.00, 5);
t[3] = new FullTimeEmployee("Owner4", 33000.00, 20);

printHighestPaidContractor(t, 4);


There are no contractors
----------------------------------
Payable ** t = new Payable *[8];
t[0] = new FullTimeEmployee("Owner1", 45000.00, 10);
t[1] = new Contractor("Owner1", 40000.00, 3);
t[2] = new FullTimeEmployee("Owner2", 50000.00, 15);
t[3] = new Contractor("Owner3", 70000.00, 8);
t[4] = new Contractor("Owner2", 52000.00, 12);
t[5] = new FullTimeEmployee("Owner3", 41000.00, 7);
t[6] = new Contractor("Owner1", 48000.00, 9);
t[7] = new Contractor("Owner4", 55300.00, 2);

for (int i=0;i<8;i++){
    t[i]->printDetails();
}
cout<<endl;
printHighestPaidContractor(t, 8);


Owner1 (FullTime) - Overtime: 10.00h - Base Salary: 45000.00 - Net Salary: 40680.00
Owner1 (Contractor) - Projects: 3 - Base Salary: 40000.00 - Net Salary: 34255.00
Owner2 (FullTime) - Overtime: 15.00h - Base Salary: 50000.00 - Net Salary: 45270.00
Owner3 (Contractor) - Projects: 8 - Base Salary: 70000.00 - Net Salary: 60180.00
Owner2 (Contractor) - Projects: 12 - Base Salary: 52000.00 - Net Salary: 45220.00
Owner3 (FullTime) - Overtime: 7.00h - Base Salary: 41000.00 - Net Salary: 37026.00
Owner1 (Contractor) - Projects: 9 - Base Salary: 48000.00 - Net Salary: 41565.00
Owner4 (Contractor) - Projects: 2 - Base Salary: 55300.00 - Net Salary: 47175.00

Owner3 (Contractor) - Projects: 8 - Base Salary: 70000.00 - Net Salary: 60180.00
----------------------------------
Payable ** t = new Payable *[10];
t[0] = new Contractor("Owner1", 52000.00, 4);
t[1] = new FullTimeEmployee("Owner1", 60000.00, 12);
t[2] = new Contractor("Owner2", 47000.00, 11);
t[3] = new FullTimeEmployee("Owner3", 33000.00, 45);
t[4] = new Contractor("Owner3", 80000.00, 2);
t[5] = new Contractor("Owner2", 50000.00, 7);
t[6] = new FullTimeEmployee("Owner4", 41000.00, 8);
t[7] = new Contractor("Owner1", 65000.00, 9);
t[8] = new FullTimeEmployee("Owner5", 72000.00, 0);
t[9] = new Contractor("Owner4", 58000.00, 6);

for (int i=0;i<10;i++){
    t[i]->printDetails();
}
cout<<endl;
printHighestPaidContractor(t, 10);


Owner1 (Contractor) - Projects: 4 - Base Salary: 52000.00 - Net Salary: 44540.00
Owner1 (FullTime) - Overtime: 12.00h - Base Salary: 60000.00 - Net Salary: 54216.00
Owner2 (Contractor) - Projects: 11 - Base Salary: 47000.00 - Net Salary: 40885.00
Owner3 (FullTime) - Overtime: 45.00h - Base Salary: 33000.00 - Net Salary: 30510.00
Owner3 (Contractor) - Projects: 2 - Base Salary: 80000.00 - Net Salary: 68170.00
Owner2 (Contractor) - Projects: 7 - Base Salary: 50000.00 - Net Salary: 43095.00
Owner4 (FullTime) - Overtime: 8.00h - Base Salary: 41000.00 - Net Salary: 37044.00
Owner1 (Contractor) - Projects: 9 - Base Salary: 65000.00 - Net Salary: 56015.00
Owner5 (FullTime) - Overtime: 0.00h - Base Salary: 72000.00 - Net Salary: 64800.00
Owner4 (Contractor) - Projects: 6 - Base Salary: 58000.00 - Net Salary: 49810.00

Owner3 (Contractor) - Projects: 2 - Base Salary: 80000.00 - Net Salary: 68170.00
*/
