package lessons._1_oop.entities;

/*
    Unified Modeling Language (UML)
    UML class diagrams help us organize and describe classes

    - author:String
    - title:String
    - genre:String
    - numPages:int
    --------------------------
    + Book(author:String, title:String, genre:String, numPages:int)
    + getAuthor():String
    + getTitle():String
    + getGenre():String
    + getNumPages():int
    --------------------------
*/

public class Book {
    private final String author;
    private final String title;
    private final String genre;
    private final int numPages;

    public Book(String author, String title, String genre, int numPages) {
        this.author = author;
        this.title = title;
        this.genre = genre;
        this.numPages = numPages;
    }

    public String getAuthor() {
        return author;
    }

    public String getTitle() {
        return title;
    }

    public String getGenre() {
        return genre;
    }

    public int getNumPages() {
        return numPages;
    }
}
