package lessons;

public class _19_Loops {
    public static void main(String[] args) {

        // For Loop
        for (int i = 0; i < 5; i++) {
            System.out.println(i);
        }

        // For Each
        int[] nums = new int[5];
        nums[0] = 0;
        nums[0] = 1;
        nums[0] = 2;
        nums[0] = 3;
        nums[0] = 4;

        int[] nums1 = {1,2,3,4,5};

        for (int num: nums) {
            System.out.println(num);
        }

        for (int num: nums1) {
            System.out.println(num);
        }
    }
}
