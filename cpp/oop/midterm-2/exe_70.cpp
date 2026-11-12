// Дадена е класа Kurs во која се чуваат информации за име на курс (низа од знаци) и број на кредити (цел број).
//
// Дадена е класа Student што содржи инфомрации за: индекс на студентот (цел број), низа од оценки на студентот (динамички алоцирана низа на оценките кои претставуваат броеви од 5 до 10) и број на оценки.
//
// Дадена е класа Predavach што содржи инфомрации за: име на предавачот (динамички алоцирана низа од знаци), листа од курсеви кои ги предава предавачот (низа од објекти од класата Kurs) и број на курсеви (цел број).
//
// Да се креира класа Demonstrator, со која се претставуваат студентите држат лабораториските вежби на некои курсеви. Објектите од оваа класа треба да содржат инфомрации за: индекс на студентот, оценки на студентот, број на оценки, име на демонстраторот, листа од курсеви, број на курсеви чии лабораторисски вежби ги држи студентот и број на часови во неделата кога студентот држи лабораториски вежби (цел број). (5 поени)
//
// За секој студент да се овозможат следните функции:
//
//     getBodovi() - која враќа цел број кој го претставува број на бодови за даден студент. Студентите кои не се демонстратори имаат бодови кои го претставуваат процентот на преодни оценки на студентот. (На пример студент со оценки: 5 6 7 ќе има 66 бодови (цел дел од 66.666...) затоа што во 66% од оценките има оценка поголема од 5 ). Кај секој демонстратор на овие бодовите од оценките се додаваат бодовите од лабораториските вежби: (20*C)/N, каде N e бројот на курсеви кои ги држи, C бројот на часови во неделата кога студентот држи лабораториски вежби. Во случај кога некој демонстратор не држи ниту еден курс се фрла исклучокот NoCourseException. Справување со исклучокот треба да реализира онаму каде што е потребно и притоа да се испечати соодветна порака за грешка "Demonstratorot so indeks XXXX ne drzi laboratoriski vezbi", каде XXXX е индексот на демонстраторот. (15 поени)
//
//     pecati()- во која се печати само индексот на студентот ако студентот не е демонстратор, а во случај кога студентот е демонстратор во продолжение се печатат информации за курсевите чии лабораториски вежби ги држи демонстраторот. (10 поени)
//
// Форматот за печатење е:
//
// Indeks: ime (Kurs1 Krediti1 ECTS, Kurs2 Krediti2 ECTS,...)
//
// Да се имплементираат следните глобални функции:
//
//     Student& vratiNajdobroRangiran(Student ** studenti, int n ) што враќа референца кон студентот кој има најмногу бодови од листата на дадените n студенти (studenti). Да забележиме дека оние демонстратори кои не држат лабораториски вежби ќе земеме дека имаат 0 бодови. Да забележиме и дека во примерите секогаш има точно еден студент кој има најголем број на бодови. (15 поени)
//     void pecatiDemonstratoriKurs (char* kurs, Student** studenti, int n) - која од дадена листа на студенти, ќе ги испечати само оние кои држат лабораториски вежби на курсот kurs. (10 поени)
//
// Комплетна функционалност на програмата. (5 поени)
//
// Да забележиме дека веќе постоечките класи Kurs, Student и Predavach може да се дополнуваат и менуваат. Погледнете ги дадените класи. Во нив покрај конструкторите дадени се и други функциите кои можат да се користат.
//
// For example:
// Input 	Result
//
// 2
// 11133 3 10 5 9
//
//
//
// -----TEST pecati-----
// 11133

#include<iostream>

// YOUR CODE HERE


int main(){

Kurs kursevi[10];
int indeks,brojKursevi, ocenki[20],ocenka,brojOcenki,tip,brojCasovi,krediti;
char ime[20],imeIPrezime[50];

cin>>tip;

if (tip==1) //test class Demonstrator
{
    cout<<"-----TEST Demonstrator-----"<<endl;
    cin>>indeks>>brojOcenki;
    for (int i=0;i<brojOcenki;i++){
         cin>>ocenka;
         ocenki[i]=ocenka;
    }
    cin>>imeIPrezime>>brojKursevi;
    for (int i=0;i<brojKursevi;i++){
         cin>>ime>>krediti;
         kursevi[i]=Kurs(ime,krediti);
    }
    cin>>brojCasovi;

Demonstrator d(indeks,ocenki,brojOcenki,imeIPrezime,kursevi,brojKursevi,brojCasovi);
cout<<"Objekt od klasata Demonstrator e kreiran";

} else if (tip==2) //funkcija pecati vo Student
{
    cout<<"-----TEST pecati-----"<<endl;
    cin>>indeks>>brojOcenki;
    for (int i=0;i<brojOcenki;i++){
         cin>>ocenka;
         ocenki[i]=ocenka;
    }

Student s(indeks,ocenki,brojOcenki);
s.pecati();

} else if (tip==3) //funkcija getVkupnaOcenka vo Student
{
     cout<<"-----TEST getVkupnaOcenka-----"<<endl;
    cin>>indeks>>brojOcenki;
    for (int i=0;i<brojOcenki;i++){
         cin>>ocenka;
         ocenki[i]=ocenka;
    }
Student s(indeks,ocenki,brojOcenki);
cout<<"Broj na bodovi: "<<s.getBodovi()<<endl;

} else if (tip==4) //funkcija getVkupnaOcenka vo Demonstrator
{
  cout<<"-----TEST getVkupnaOcenka-----"<<endl;
  cin>>indeks>>brojOcenki;
    for (int i=0;i<brojOcenki;i++){
         cin>>ocenka;
         ocenki[i]=ocenka;
    }
    cin>>imeIPrezime>>brojKursevi;
    for (int i=0;i<brojKursevi;i++){
         cin>>ime>>krediti;
         kursevi[i]=Kurs(ime,krediti);
    }
    cin>>brojCasovi;

Demonstrator d(indeks,ocenki,brojOcenki,imeIPrezime,kursevi,brojKursevi,brojCasovi);
cout<<"Broj na bodovi: "<<d.getBodovi()<<endl;

} else if (tip==5) //funkcija pecati vo Demonstrator
{
  cout<<"-----TEST pecati -----"<<endl;
 cin>>indeks>>brojOcenki;
    for (int i=0;i<brojOcenki;i++){
         cin>>ocenka;
         ocenki[i]=ocenka;
    }
    cin>>imeIPrezime>>brojKursevi;
    for (int i=0;i<brojKursevi;i++){
         cin>>ime>>krediti;
         kursevi[i]=Kurs(ime,krediti);
    }
    cin>>brojCasovi;

Demonstrator d(indeks,ocenki,brojOcenki,imeIPrezime,kursevi,brojKursevi,brojCasovi);
d.pecati();

} else if (tip==6) //site klasi
{
    cout<<"-----TEST Student i Demonstrator-----"<<endl;
 cin>>indeks>>brojOcenki;
    for (int i=0;i<brojOcenki;i++){
         cin>>ocenka;
         ocenki[i]=ocenka;
    }
    cin>>imeIPrezime>>brojKursevi;
    for (int i=0;i<brojKursevi;i++){
         cin>>ime>>krediti;
         kursevi[i]=Kurs(ime,krediti);
    }
    cin>>brojCasovi;

Student *s=new Demonstrator(indeks,ocenki,brojOcenki,imeIPrezime,kursevi,brojKursevi,brojCasovi);
s->pecati();
cout<<"\nBroj na bodovi: "<<s->getBodovi()<<endl;
delete s;


} else if (tip==7) //funkcija vratiNajdobroRangiran
{
    cout<<"-----TEST vratiNajdobroRangiran-----"<<endl;
int k, opt;
cin>>k;
Student **studenti=new Student*[k];
for (int j=0;j<k;j++){
    cin>>opt; //1 Student 2 Demonstrator
      cin>>indeks>>brojOcenki;
   for (int i=0;i<brojOcenki;i++)
      {
         cin>>ocenka;
         ocenki[i]=ocenka;
      }
   if (opt==1){
    studenti[j]=new Student(indeks,ocenki,brojOcenki);
   }else{
   cin>>imeIPrezime>>brojKursevi;
    for (int i=0;i<brojKursevi;i++)
      {
         cin>>ime>>krediti;
         kursevi[i]=Kurs(ime,krediti);
      }
      cin>>brojCasovi;
   studenti[j]=new Demonstrator(indeks,ocenki,brojOcenki,imeIPrezime,kursevi,brojKursevi,brojCasovi);
   }
}
Student& najdobar=vratiNajdobroRangiran(studenti,k);
cout<<"Maksimalniot broj na bodovi e:"<<najdobar.getBodovi();
cout<<"\nNajdobro rangiran:";
najdobar.pecati();

for (int j=0;j<k;j++) delete studenti[j];
 delete [] studenti;

} else if (tip==8) //funkcija pecatiDemonstratoriKurs
{
cout<<"-----TEST pecatiDemonstratoriKurs-----"<<endl;
int k, opt;
cin>>k;
Student **studenti=new Student*[k];
for (int j=0;j<k;j++){
    cin>>opt; //1 Student 2 Demonstrator
      cin>>indeks>>brojOcenki;
   for (int i=0;i<brojOcenki;i++)
      {
         cin>>ocenka;
         ocenki[i]=ocenka;
      }
   if (opt==1){
    studenti[j]=new Student(indeks,ocenki,brojOcenki);
   }else{
   cin>>imeIPrezime>>brojKursevi;
    for (int i=0;i<brojKursevi;i++)
      {
         cin>>ime>>krediti;
         kursevi[i]=Kurs(ime,krediti);
      }
      cin>>brojCasovi;
   studenti[j]=new Demonstrator(indeks,ocenki,brojOcenki,imeIPrezime,kursevi,brojKursevi,brojCasovi);
   }
}
char kurs[20];
cin>>kurs;
cout<<"Demonstratori na "<<kurs<<" se:"<<endl;
pecatiDemonstratoriKurs (kurs,studenti,k);
for (int j=0;j<k;j++) delete studenti[j];
 delete [] studenti;

}


return 0;
}

