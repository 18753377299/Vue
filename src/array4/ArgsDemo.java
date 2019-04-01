package array4;
	/**
 * @author  作者 E-mail: 
 * @date 创建时间：2018年11月9日 下午1:48:20
 * @version 1.0 
 * @parameter 
 * @since  
 * @return  */
public class ArgsDemo {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
//		System.out.println("输出参数共"+args.length+"个");
//		for(int i=0;i<args.length;i++){
//			System.out.println("第"+i+"个"+args[i]);
//		}
		int [] array1 = {1,2,3,4,5,6,7};
		int [] array2 = new int[10];
		System.arraycopy(array1, 2, array2, 2, 2);
		array1[3] =10;
		for(int i=0;i<array2.length;i++){
			System.out.print(array2[i]+" ");
		}
		System.out.println();
		//冒泡排序(原理：比较两个相邻的元素，将值大的元素交换至右端。)
		int [] sorArray = {2,3,1,5,8,6,59,34,24,1,34,46,67,34};
		int temp;
		for(int i=0;i<sorArray.length-1;i++){
			for(int j=0;j<sorArray.length-1-i;j++){
				if(sorArray[j]>sorArray[j+1]){
					temp = sorArray[j];
					sorArray[j] = sorArray[j+1];
					sorArray[j+1]= temp;
				}
			}
		}
		for(int k=0;k<sorArray.length;k++){
			System.out.print(sorArray[k]+" ");
		}
		System.out.println();
		//冒泡
		for(int i=0;i<sorArray.length;i++){
			for(int j=i+1;j<sorArray.length;j++){
				if(sorArray[i]>sorArray[j]){
					temp = sorArray[i];
					sorArray[i] = sorArray[j];
					sorArray[j]= temp;
				}
			}
		}
		for(int k=0;k<sorArray.length;k++){
			System.out.print(sorArray[k]+" ");
		}
		
		System.exit(0);
		
	}

}
