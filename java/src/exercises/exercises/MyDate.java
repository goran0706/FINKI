package exercises;

public class MyDate {
    int day;
    int month;
    int year;

    {
        day = 1;
        month = 1;
        year = 2000;
    }

    public MyDate() {}

    public MyDate(int day, int month, int year) {
        this.day = day;
        this.month = month;
        this.year = year;
    }

    @Override
    public String toString() {
        return day + "/" + month + "/" + year;
    }

    public void setDate(int d, int m, int y) {
        day = d;
        month = m;
        year = y;
    }
}
