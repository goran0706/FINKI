package lessons._2_classes;

import lessons._1_oop.entities.Book;

public class BookDemo {

    public static void main(String[] args) {
        Book gameOfThrones = new Book("George Martin", "Game of Thrones", "Fantasy", 864);
        Book javaBook = new Book("joel Murach", "Murach's Java Programming", "Programming", 800);

        System.out.println(gameOfThrones.getAuthor());
        System.out.println(gameOfThrones.getTitle());
        System.out.println(gameOfThrones.getGenre());
        System.out.println(gameOfThrones.getNumPages());
        System.out.println(gameOfThrones.getClass());

        System.out.println(javaBook.getAuthor());
        System.out.println(javaBook.getTitle());
        System.out.println(javaBook.getGenre());
        System.out.println(javaBook.getNumPages());
        System.out.println(javaBook.getClass());
    }
}
