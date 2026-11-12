#include <iostream>
#include <cstring>

using namespace std;

class InvestmentPlan {
private:
    char name[80];
    float sum;
    float shareNumber;
    bool day;

public:
    InvestmentPlan(const char *name = "", float sum = 0, float shareNumber = 0, bool day = false) {
        strcpy(this->name, name);
        this->sum = sum;
        this->shareNumber = shareNumber;
        this->day = day;
    }

    InvestmentPlan(const InvestmentPlan &p) {
        strcpy(this->name, p.name);
        this->sum = p.sum;
        this->shareNumber = p.shareNumber;
        this->day = p.day;
    }

    ~InvestmentPlan() {
    }

    float getShareNumber() {
        return shareNumber;
    }

    bool getDay() {
        return day;
    }

    float getSum() {
        return sum;
    }
};

class InvestmentFund {
protected:
    char name[50];
    InvestmentPlan *array;
    int n;
    float priceOfShare;

public:
    InvestmentFund(const char *name = "", InvestmentPlan *array = nullptr, int n = 0, float priceOfShare = 0) {
        strcpy(this->name, name);
        this->n = n;
        this->priceOfShare = priceOfShare;
        this->array = new InvestmentPlan[n];
        for (int i = 0; i < n; i++) {
            if (array) {
                this->array[i] = array[i];
            } else {
                this->array[i] = InvestmentPlan();
            }
        }
    }

    InvestmentFund(const InvestmentFund &p) {
        strcpy(this->name, p.name);
        this->n = p.n;
        this->priceOfShare = p.priceOfShare;
        this->array = new InvestmentPlan[n];
        for (int i = 0; i < n; i++) {
            this->array[i] = p.array[i];
        }
    }

    virtual ~InvestmentFund() {
        delete[] this->array;
    }

    virtual double profit() const = 0;

    double totalPrice() const {
        float total = 0;
        for (int i = 0; i < n; i++) {
            total = total + array[i].getShareNumber() * priceOfShare;
        }
        return total;
    }

    double totalNewPlans() const {
        float total = 0;
        for (int i = 0; i < n; i++) {
            if (array[i].getDay()) {
                total = total + array[i].getSum();
            }
        }
        return total;
    }
};

class MoneyFund : public InvestmentFund {
private:
    static float provision;

public:
    MoneyFund(const char *name = "", InvestmentPlan *array = nullptr, int n = 0,
              float priceOfShare = 0) : InvestmentFund(name, array, n, priceOfShare) {
    }

    double profit() const override {
        return (totalPrice() * (MoneyFund::provision / 100.0)) / 365.0;
    }
};

float MoneyFund::provision = 1;

class ActionFund : public InvestmentFund {
private:
    static float provision;
    static float entry;

public:
    ActionFund(const char *name = "", InvestmentPlan *array = nullptr, int n = 0,
               float priceOfShare = 0) : InvestmentFund(name, array, n, priceOfShare) {
    }

    double profit() const override {
        return (totalPrice() * ActionFund::provision / 100.0) / 365.0 + (totalNewPlans() * ActionFund::entry / 100.0);
    }
};

float ActionFund::provision = 1.5;
float ActionFund::entry = 3;

double totalProfit(InvestmentFund **funds, int n) {
    double total = 0;
    for (int i = 0; i < n; i++) {
        total = total + funds[i]->profit();
    }
    return total;
}

int main() {
    char investitor[80], ime[50];
    double plan, brUdeli, udel;
    bool flag = false;
    int n, m;
    cin >> n;
    InvestmentFund **fondovi = new InvestmentFund *[n];
    for (int i = 0; i < n; i++) {
        cin >> ime;
        cin >> m;
        InvestmentPlan *ip = new InvestmentPlan[m];
        for (int j = 0; j < m; j++) {
            cin >> investitor >> plan >> brUdeli;
            if (j % 2) flag = true;
            else flag = false;
            InvestmentPlan IP(investitor, plan, brUdeli, flag);
            ip[j] = IP;
        }
        cin >> udel;
        if (i % 2) {
            fondovi[i] = new ActionFund(ime, ip, m, udel);
        } else {
            fondovi[i] = new MoneyFund(ime, ip, m, udel);
        }
    }
    cout << totalProfit(fondovi, n);
    return 0;
}
