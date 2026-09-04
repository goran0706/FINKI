package lessons._1_oop.entities;

import java.util.Date;

public class Person {
    private String firstName;
    private String lastName;
    private String homeAddress;
    private Date date;

    public Person(String firstName, String lastName, String homeAddress, Date date) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.homeAddress = homeAddress;
        this.date = date;
    }

    public Person() {
        this("Jane", "Doe", null, new Date(1990, 6, 7));
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getHomeAddress() {
        return homeAddress;
    }

    public void setHomeAddress(String homeAddress) {
        this.homeAddress = homeAddress;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}