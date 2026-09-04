#include <iostream>
#include <stdexcept>

using namespace std;

class InvalidCodeFormatException {
private:
    string code;

public:
    InvalidCodeFormatException(string code) {
        this->code = code;
    }

    void message() {
        cout << "The code " << code
                << " is invalid doctor code format. THE CODE MUST BE 8 CHARACTERS LONG AND CANNOT CONTAIN COMMA." <<
                endl;
    }
};

class Doctor {
protected:
    string ime, prezime, kod;
    float plata;

public:
    Doctor(string ime = "", string prezime = "", string kod = "") {
        bool flag = false;
        for (int i = 0; i < kod.length(); ++i) {
            if (kod[i] == ',') {
                flag = true;
            }
        }
        if (kod.length() != 8 || flag) {
            throw InvalidCodeFormatException(kod);
        }
        this->ime = ime;
        this->prezime = prezime;
        this->kod = kod;
    }

    virtual float calculateSalary() = 0;

    virtual void print() = 0;

    virtual ~Doctor() {
    }
};

class GeneralDoctor : public Doctor {
    int pacienti;

public:
    GeneralDoctor(string ime = "", string prezime = "", string kod = "", int pacienti = 0) : Doctor(ime, prezime, kod) {
        this->pacienti = pacienti;
        plata = 45000;
    }

    //    General Doctor: John Smith CODE:236XY@2B Salary: 75330
    void print() override {
        cout << "General Doctor: " << ime << " " << prezime << " CODE:" << kod << " Salary: " << calculateSalary()
                << endl;
    }

    float calculateSalary() override {
        float salary = plata;

        salary += (pacienti / 10) * 3000;
        return salary * 0.93;
    }
};

class Specialist : public Doctor {
    string specijalnost;
    int intervencii;
    int iskustvo;

public:
    Specialist(string ime = "", string prezime = "", string kod = "", string specijalnost = "", int intervencii = 0,
               int iskustvo = 0) : Doctor(ime, prezime, kod) {
        this->specijalnost = specijalnost;
        this->intervencii = intervencii;
        this->iskustvo = iskustvo;
        plata = 55000;
    }

    //    Specialist: Alice Johnson CODE:ABCD123@ Pediatrician Salary: 74376.8
    void print() override {
        cout << "Specialist: " << ime << " " << prezime << " CODE:" << kod << " " << specijalnost << " Salary: "
                << calculateSalary() << endl;
    }

    float calculateSalary() override {
        float salary = plata;

        salary += intervencii * 85;
        salary += iskustvo * (plata * 0.05);
        return salary * 0.93;
    }
};

void findDoctorsPercentage(Doctor **doctors, int n) {
    int spec = 0, matichni = 0;

    for (int i = 0; i < n; ++i) {
        if (dynamic_cast<GeneralDoctor *>(doctors[i])) {
            matichni++;
        } else {
            spec++;
        }
    }
    //    42.8571% of the doctors are specialists and 57.1429% are general doctors.
    cout << (spec / (n * 1.0)) * 100 << "% of the doctors are specialists and " << (matichni / (n * 1.0)) * 100
            << "% are general doctors." << endl;
}


int main() {
    int testCase, n;
    string name, surname, specialty, code;
    int numberOfPatients, yearsOfExperience, numberOfInterventions;
    cin >> testCase;

    if (testCase == 1) {
        cout << "TESTING GENERAL DOCTOR CLASS" << endl;
        Doctor *d = new GeneralDoctor("John", "Smith", "236XY@2B", 120);
        Doctor *d1 = new GeneralDoctor("Marco", "Brown", "345X!Y2B", 120);
        Doctor *d2 = new GeneralDoctor("Emily", "Johnson", "ABCD123@", 230);
        d->print();
        d1->print();
        d2->print();

        cout << "GENERAL DOCTOR CLASS OK!" << endl;
    } else if (testCase == 2) {
        cout << "TESTING SPECIALIST DOCTOR CLASS" << endl;
        Doctor *d = new Specialist("Beth", "Davis", "96Tr$$33", "Cardiologist", 45, 5);
        Doctor *d1 = new Specialist("William", "Wilson", "785#Qy2B", "Pulmonologist", 50, 7);
        Doctor *d2 = new Specialist("Micheal", "Rosen", "7896YZ$s", "Radiologist", 41, 10);
        d->print();
        d1->print();
        d2->print();
        cout << "SPECIALIST DOCTOR CLASS OK!" << endl;
    } else if (testCase == 3) {
        cout << "TESTING EXCEPTION HANDLING" << endl;
        try {
            Doctor *d = new GeneralDoctor("John", "Smith", "23Y@2B", 120);
            d->print();
        } catch (InvalidCodeFormatException &e) {
            e.message();
        }

        cout << "EXCEPTION HANDLING OK!" << endl;
    } else if (testCase == 4) {
        cout << "TESTING EXCEPTION HANDLING" << endl;
        try {
            Doctor *d = new Specialist("Beth", "Davis", "9,R$$334", "Cardiologist", 45, 5);
            d->print();
        } catch (InvalidCodeFormatException &e) {
            e.message();
        }

        cout << "EXCEPTION HANDLING OK!" << endl;
    } else if (testCase == 5) {
        cout << "TESTING EXCEPTION HANDLING" << endl;
        try {
            Doctor *d = new Specialist("Beth", "Davis", "9,R$$334", "Cardiologist", 45, 5);
            d->print();
        } catch (InvalidCodeFormatException &e) {
            e.message();
        }
        try {
            Doctor *d1 = new Specialist("William", "Wilson", "785#Qy2B", "Pulmonologist", 50, 7);
            d1->print();
        } catch (InvalidCodeFormatException &e) {
            e.message();
        }
        try {
            Doctor *d2 = new Specialist("Beth", "Davis", "96Tr,", "Cardiologist", 45, 5);
            d2->print();
        } catch (InvalidCodeFormatException &e) {
            e.message();
        }
        cout << "EXCEPTION HANDLING OK!" << endl;
    } else {
        cout << "INTEGRATION TEST AND TESTING GLOBAL FUNCTION!" << endl;
        cin >> n;
        Doctor **doctors = new Doctor *[n];
        for (int i = 0; i < n; i++) {
            int t;
            cin >> t;
            cin >> name >> surname;
            cin >> code;
            if (t == 1) // General doctor
            {
                cin >> numberOfPatients;
                try {
                    doctors[i] = new GeneralDoctor(name, surname, code, numberOfPatients);
                } catch (InvalidCodeFormatException &e) {
                    e.message();
                    i--;
                    n--;
                }
            } else // Specialist
            {
                cin >> specialty;
                cin >> numberOfInterventions >> yearsOfExperience;
                try {
                    doctors[i] = new Specialist(name, surname, code, specialty, numberOfInterventions,
                                                yearsOfExperience);
                } catch (InvalidCodeFormatException &e) {
                    e.message();
                    i--;
                    n--;
                }
            }
        }
        cout << "LIST OF ALL DOCTORS: " << endl;
        for (int i = 0; i < n; i++) {
            doctors[i]->print();
        }
        findDoctorsPercentage(doctors, n);
        for (int i = 0; i < n; i++) {
            delete doctors[i];
        }
        delete[] doctors;
    }
    return 0;
}

//#include <iostream>
//#include <cstring>
//#include <stdexcept>
//using namespace std;
//
//class InvalidCodeFormatException{
//private:
//    string message;
//public:
//    InvalidCodeFormatException(string message){
//        this->message=message;
//    }
//    void print(){
//        cout << "The code " << message << " is invalid doctor code format. THE CODE MUST BE 8 CHARACTERS LONG AND CANNOT CONTAIN COMMA." << endl;
//    }
//};
//class Doctor{
//protected:
//    string name;
//    string surname;
//    float salary;
//    string code;
//public:
//    Doctor(string name ="", string surname="", float salary = 0, string code =""){
//        bool flag = false;
//        for (int i = 0; i < code.length(); ++i) {
//            if (code[i] == ','){
//                flag = true;
//            }
//            if (code.length() !=8 || flag){
//                throw InvalidCodeFormatException(code);
//            }
//        }
//        this->name=name;
//        this->surname=surname;
//        this->salary=salary;
//        this->code=code;
//    }
//    Doctor(const Doctor &d){
//        this->name=d.name;
//        this->surname=d.surname;
//        this->salary=d.salary;
//        this->code=d.code;
//    }
//    virtual float calculateSalary() = 0;
//    virtual void print() = 0;
//};
//class GeneralDoctor:public Doctor{
//    int pacienti;
//public:
//    GeneralDoctor(string name ="", string surname="", string code ="",int pacienti = 0): Doctor(name,surname,0,code){
//        this->pacienti=pacienti;
//    }
//    float calculateSalary () override{
//        salary = 45000;
//        salary +=(pacienti / 10) * 3000;
//        salary *= 0.93;
//        return salary;
//    }
//    void print()override{
//        cout<<"General Doctor: "<<name<<" "<<surname<<" CODE:"<<code<<" Salary: "<<calculateSalary()<<endl;
//    }
//};
//class Specialist:public Doctor{
//private:
//    string specijalnost;
//    int intervencii;
//    int iskustvo;
//public:
//    Specialist(string name = "", string surname="",string code="", string specijalnost="",int intervencii = 0, int iskustvo = 0): Doctor(name,surname,0,code){
//        this->specijalnost=specijalnost;
//        this->intervencii=intervencii;
//        this->iskustvo=iskustvo;
//    }
//    float calculateSalary() override{
//        salary = 55000.0;
//        salary += 85 * intervencii;
//        salary += 0.05 * 55000 * iskustvo;
//        salary *= 0.93;
//        return salary;
//    }
//
//    void print()override{
//        cout<<"Specialist: "<<name<<" "<<surname<<" CODE:"<<code<<" "<<specijalnost<<" Salary: "<<calculateSalary()<<endl;
//    }
//};
//void findDoctorsPercentage(Doctor **doctors, int n){
//    int counter = 0;
//    for (int i = 0; i < n; ++i) {
//        if (dynamic_cast<Specialist*>(doctors[i])!= nullptr){
//            counter++;
//        }
//    }
//    cout<<((float)counter /n ) * 100 << "% of the doctors are specialists and "<<(100 - ((float)counter / n) * 100) << "% are general doctors."<<endl;
//
//}
//
//int main()
//{
//    int testCase, n;
//    string name, surname, specialty, code;
//    int numberOfPatients, yearsOfExperience, numberOfInterventions;
//    cin >> testCase;
//
//    if (testCase == 1)
//    {
//        cout << "TESTING GENERAL DOCTOR CLASS" << endl;
//        try {
//            Doctor *d = new GeneralDoctor("John", "Smith", "236XY@2B", 120);
//            Doctor *d1 = new GeneralDoctor("Marco", "Brown", "345X!Y2B", 120);
//            Doctor *d2 = new GeneralDoctor("Emily", "Johnson", "ABCD123@", 230);
//            d->print();
//            d1->print();
//            d2->print();
//        }
//        catch (InvalidCodeFormatException& e)
//        {
//            e.print();
//        }
//        cout << "GENERAL DOCTOR CLASS OK!" << endl;
//    }
//    else if (testCase == 2)
//    {
//        cout << "TESTING SPECIALIST DOCTOR CLASS" << endl;
//        try {
//            Doctor *d = new Specialist("Beth", "Davis", "96Tr$$33", "Cardiologist", 45, 5);
//            Doctor *d1 = new Specialist("William", "Wilson", "785#Qy2B", "Pulmonologist", 50, 7);
//            Doctor *d2 = new Specialist("Micheal", "Rosen", "7896YZ$s", "Radiologist", 41, 10);
//            d->print();
//            d1->print();
//            d2->print();
//        }
//        catch (InvalidCodeFormatException& e)
//        {
//            e.print();
//        }
//        cout << "SPECIALIST DOCTOR CLASS OK!" << endl;
//    }
//    else if (testCase == 3)
//    {
//        cout << "TESTING EXCEPTION HANDLING" << endl;
//        try {
//            Doctor *d = new GeneralDoctor("John", "Smith", "23Y@2B", 120);
//            d->print();
//        }
//        catch (InvalidCodeFormatException& e)
//        {
//            e.print();
//        }
//        cout << "EXCEPTION HANDLING OK!" << endl;
//    }
//    else if (testCase == 4)
//    {
//        cout << "TESTING EXCEPTION HANDLING" << endl;
//        try {
//            Doctor *d = new Specialist("Beth", "Davis", "9,R$$334", "Cardiologist", 45, 5);
//            d->print();
//        }
//        catch (InvalidCodeFormatException& e)
//        {
//            e.print();
//        }
//        cout << "EXCEPTION HANDLING OK!" << endl;
//    }
//    else if (testCase == 5)
//    {
//        cout << "TESTING EXCEPTION HANDLING" << endl;
//        try {
//            Doctor *d = new Specialist("Beth", "Davis", "9,R$$334", "Cardiologist", 45, 5);
//            d->print();
//        }
//        catch (InvalidCodeFormatException& e)
//        {
//            e.print();
//        }
//        try {
//            Doctor *d1 = new Specialist("William", "Wilson", "785#Qy2B", "Pulmonologist", 50, 7);
//            d1->print();
//        }
//        catch (InvalidCodeFormatException& e)
//        {
//            e.print();
//        }
//        try {
//            Doctor *d2 = new Specialist("Beth", "Davis", "96Tr,", "Cardiologist", 45, 5);
//            d2->print();
//        }
//        catch (InvalidCodeFormatException& e)
//        {
//            e.print();
//        }
//        cout << "EXCEPTION HANDLING OK!" << endl;
//    }
//    else
//    {
//        cout << "INTEGRATION TEST AND TESTING GLOBAL FUNCTION!" << endl;
//        cin >> n;
//        Doctor **doctors = new Doctor *[n];
//        for (int i = 0; i < n; i++)
//        {
//            int t;
//            cin >> t;
//            cin >> name >> surname;
//            cin >> code;
//            if (t == 1) // General doctor
//            {
//                cin >> numberOfPatients;
//                try {
//                    doctors[i] = new GeneralDoctor(name, surname, code, numberOfPatients);
//                }
//                catch (InvalidCodeFormatException& e)
//                {
//                    e.print();
//                    --n;
//                    --i;
//                }
//            }
//            else // Specialist
//            {
//                cin >> specialty;
//                cin >> numberOfInterventions >> yearsOfExperience;
//                try {
//                    doctors[i] = new Specialist(name, surname, code, specialty, numberOfInterventions, yearsOfExperience);
//                }
//                catch (InvalidCodeFormatException& e)
//                {
//                    e.print();
//                    --n;
//                    --i;
//                }
//            }
//        }
//        cout << "LIST OF ALL DOCTORS: " << endl;
//        for (int i = 0; i < n; i++)
//        {
//            doctors[i]->print();
//        }
//        findDoctorsPercentage(doctors, n);
//        for (int i = 0; i < n; i++)
//        {
//            delete doctors[i];
//        }
//        delete[] doctors;
//    }
//    return 0;
//}
