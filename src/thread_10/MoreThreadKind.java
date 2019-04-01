package thread_10;

public class MoreThreadKind  extends Thread{
	
	public static void main(String []args) {
		MoreThreadKind mt1 =new MoreThreadKind();
		MoreThreadKind mt2 =new MoreThreadKind();
		MoreThreadKind mt3 =new MoreThreadKind();
		mt1.start();
		mt2.start();
		mt3.start();
	}
	public void run(){
		for(int row=1,count=1;row<10;row++,count++){
			for(int i=0; i<count;i++){
				System.out.print("*");
			}
			System.out.println();
		}
		System.out.println("==========="+Thread.currentThread().getName());
	}
}
