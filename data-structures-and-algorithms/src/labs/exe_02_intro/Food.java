package labs.exe_02_intro;

class Food extends Product {
    private int daysToExpiry;

    public Food(String name, double price, int daysToExpiry) {
        super(name, price);
        this.daysToExpiry = daysToExpiry;
    }

    public int getDaysToExpiry() {
        return daysToExpiry;
    }

    public void setDaysToExpiry(int daysToExpiry) {
        this.daysToExpiry = daysToExpiry;
    }

    @Override
    public double finalPrice() {
        if (daysToExpiry <= 3) {
            return super.finalPrice() / 2.0;
        }

        return super.finalPrice();
    }

    @Override
    public String toString() {
        return super.toString() + " days=" + daysToExpiry;
    }
}
