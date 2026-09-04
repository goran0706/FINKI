import java.text.DecimalFormat;

public class _24_DecimalFormat {
    public static void main(String[] args) {
        var PI = 3.142;
        var decimalF = new DecimalFormat("#.##");
        var formattedText = decimalF.format(PI);
        System.out.println(formattedText);

        var price = 10_000.1234;
        var decimalFormatPrice = new DecimalFormat("$#.##");
        var formattedPrice = decimalFormatPrice.format(price);
        System.out.println(formattedPrice);
    }
}
