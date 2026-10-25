package labs.exe_01_intro;

// is-a relationship
public class TeamLead extends Developer {
    private final int RATE = 1000;
    private int teamSize;

    public TeamLead(String id, String name, double baseSalary, int overtimeHours, int teamSize) {
        super(id, name, baseSalary, overtimeHours);
        this.teamSize = teamSize;
    }

    public int getTeamSize() {
        return teamSize;
    }

    public void setTeamSize(int teamSize) {
        this.teamSize = teamSize;
    }

    @Override
    public double calculateSalary() {
        double totalSalary = super.calculateSalary() + (teamSize * RATE);

        if (teamSize >= 5) {
            totalSalary += totalSalary * 5 / 100;
        }

        return totalSalary;
    }

    @Override
    public String toString() {
        return super.toString() + " team=" + teamSize;
    }
}
