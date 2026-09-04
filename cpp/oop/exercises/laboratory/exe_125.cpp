// Да се креира класа MedicalRecord во кој се чува податоци за еден пациент.
// Класата треба да ги содржи следните атрибути:
//
// string patient_id;
// string timestamp;
// int heart_rate;
// int systolic_bp;
// int diastolic_bp;
// double spo2;
//
// Потребно е да се имплементираат:
//
// Default конструктор
// Конструктор со параметри
// Copy конструктор
// Оператор =
// Оператор за читање istream>>
// Оператор за печатење ostream<< во следнуот формат
// Patient with ID: <patient_id>
// <timestamp> | HR <heart_rate> BP <systolic_bp>/<diastolic_bp> mmHg SpO2 <spo2>%
//
// Функцијата string HealthGroup() која ги категоризира пациентите во три категории: Critical, Monitor и Healthy:
// Critical - heart_rate < 40 или heart_rate > 130 или systolic_bp < 80 или systolic_bp > 180 или diastolic_bp < 50 или diastolic_bp > 110 или spo2 < 90.0
// Monitor - heart_rate < 50 или heart_rate > 110 или systolic_bp < 90 или systolic_bp > 160 или diastolic_bp < 55 или diastolic_bp > 100 или spo2 < 94.0
// Healthy - сите остантаи
// Да се напише глобалната функција FilterByHealthGroup() која прима низа од MedicalRecord број на елементи и string категориј.
// Како резултат функцијата враќа нова динамички алоцирана низа која ги содржи само пациентите од дадената категорија.
//
// Податоците се дадени во датотеката text.txt во форматот: прв ред - број на test case, втор ред - број на елементи,
// секој следен ред содржи податоци за еден пациент(за читање на податоци за еден пациент користете го istream операторот од класата)

#include <string>
#include <fstream>
#include "iostream"


using namespace std;

void writeToFile() {
    ofstream file("text.txt");
    char c;
    while ((c = cin.get()) != '#') {
        file.put(c);
    }
    file.close();
}

class MedicalRecord {
private:
    string patient_id;
    string timestamp;
    int heart_rate;
    int systolic_bp;
    int diastolic_bp;
    double spo2;

public:
    MedicalRecord(string patient_id = "", string timestamp = "", int heart_rate = 0, int systolic_bp = 0,
                  int diastolic_bp = 0, double spo2 = 0) {
        this->patient_id = patient_id;
        this->timestamp = timestamp;
        this->heart_rate = heart_rate;
        this->systolic_bp = systolic_bp;
        this->diastolic_bp = diastolic_bp;
        this->spo2 = spo2;
    }

    MedicalRecord(const MedicalRecord &m) {
        this->patient_id = m.patient_id;
        this->timestamp = m.timestamp;
        this->heart_rate = m.heart_rate;
        this->systolic_bp = m.systolic_bp;
        this->diastolic_bp = m.diastolic_bp;
        this->spo2 = m.spo2;
    }

    friend istream &operator >>(istream &in, MedicalRecord &m) {
        in >> m.patient_id >> m.timestamp >> m.heart_rate >> m.systolic_bp >> m.diastolic_bp >> m.spo2;
    }

    // Patient with ID: <patient_id>
    // <timestamp> | HR <heart_rate> BP <systolic_bp>/<diastolic_bp> mmHg SpO2 <spo2>%

    friend ostream &operator<<(ostream &out, const MedicalRecord &m) {
        out << "Patient with ID: " << m.patient_id << endl;
        out << m.timestamp << " | HR " << m.heart_rate << " BP " << m.systolic_bp << "/" << m.diastolic_bp
                << " mmHg  SpO2 " << m.spo2 << "%" << endl;
        return out;
    }

    string HealthGroup() const {
        if (heart_rate < 40 || heart_rate > 130 || systolic_bp < 80 || systolic_bp > 180 ||
            diastolic_bp < 50 || diastolic_bp > 110 || spo2 < 90.0)
            return "Critical";
        else if (heart_rate < 50 || heart_rate > 110 || systolic_bp < 90 || systolic_bp > 160 ||
                 diastolic_bp < 55 || diastolic_bp > 100 || spo2 < 94.0)
            return "Monitor";
        else
            return "Healthy";
    }
};

MedicalRecord *FilterByHealthGroup(MedicalRecord *records, int n, string cat) {
    MedicalRecord *filter = new MedicalRecord[n];
    int index = 0;
    for (int i = 0; i < n; i++) {
        if (records[i].HealthGroup() == cat) {
            filter[index++] = records[i];
        }
    }
    return filter;
}


int main() {
    writeToFile();
    ifstream fin("text.txt");
    if (!fin) {
        std::cerr << "Cannot open file\n";
        return 1;
    }

    int testCase, n;


    //TODO read testCase, n from file
    fin >> testCase >> n;

    //TODO dynamically allocate array of Medical Record with n elements, then read the elements from file using the istream operator of the class
    MedicalRecord *records = new MedicalRecord[n];
    for (int i = 0; i < n; i++) {
        fin >> records[i];
    }

    if (testCase == 1) {
        cout << "===== Testing Constructor, Istream Operator & OstreamOperator =====" << endl;

        for (int i = 0; i < n; i++) {
            cout << records[i];
        }
    }

    if (testCase == 2) {
        cout << "===== Testing HealthGroup Function =====" << endl;

        for (int i = 0; i < n; i++) {
            cout << records[i].HealthGroup() << endl;
        }
    }

    if (testCase == 3) {
        cout << "===== Testing FilterByHealthGroup Global Function =====" << endl;

        int count = 0;
        for (int i = 0; i < n; i++) {
            if (records[i].HealthGroup() == "Healthy") {
                count++;
            }
        }

        MedicalRecord *filtered = FilterByHealthGroup(records, n, "Healthy");

        cout << "Health Patients:" << endl;
        for (int i = 0; i < count; i++) {
            cout << filtered[i];
        }
    }

    if (testCase == 4) {
        cout << "===== Testing FilterByHealthGroup Global Function =====" << endl;

        int count = 0;
        for (int i = 0; i < n; i++) {
            if (records[i].HealthGroup() == "Monitor") {
                count++;
            }
        }

        MedicalRecord *filtered = FilterByHealthGroup(records, n, "Monitor");

        cout << "Monitor Patients:" << endl;
        for (int i = 0; i < count; i++) {
            cout << filtered[i];
        }
    }

    if (testCase == 5) {
        cout << "===== Testing FilterByHealthGroup Global Function =====" << endl;

        int count = 0;
        for (int i = 0; i < n; i++) {
            if (records[i].HealthGroup() == "Critical") {
                count++;
            }
        }

        MedicalRecord *filtered = FilterByHealthGroup(records, n, "Critical");

        cout << "Critical Patients:" << endl;
        for (int i = 0; i < count; i++) {
            cout << filtered[i];
        }
    }

    if (testCase == 4) {
        cout << "===== Testing FilterByHealthGroup Global Function =====" << endl;

        int count = 0;
        for (int i = 0; i < n; i++) {
            if (records[i].HealthGroup() == "Monitor") {
                count++;
            }
        }

        MedicalRecord *filtered = FilterByHealthGroup(records, n, "Monitor");

        cout << "Monitor Patients:" << endl;
        for (int i = 0; i < count; i++) {
            cout << filtered[i];
        }
    }

    if (testCase == 5) {
        cout << "===== Testing FilterByHealthGroup Global Function =====" << endl;

        int count = 0;
        for (int i = 0; i < n; i++) {
            if (records[i].HealthGroup() == "Critical") {
                count++;
            }
        }

        MedicalRecord *filtered = FilterByHealthGroup(records, n, "Critical");

        cout << "Critical Patients:" << endl;
        for (int i = 0; i < count; i++) {
            cout << filtered[i];
        }
    }

    delete[] records;

    return 0;
}
