public class _12_Loops {
    public static void main(String[] args) {
        // For Loop
        for (int i = 0; i < 5; i++) {
            System.out.println(i);
        }

        // For Each
        int[] nums = new int[5];
        nums[0] = 0;
        nums[1] = 1;
        nums[2] = 2;
        nums[3] = 3;
        nums[4] = 4;

        int[] nums1 = {1, 2, 3, 4, 5};

        for (int num : nums) {
            System.out.println(num);
        }

        for (int num : nums1) {
            System.out.println(num);
        }
    }
}
