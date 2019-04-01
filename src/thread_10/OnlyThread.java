package thread_10;

public class OnlyThread extends Thread{
	public static void main(String [] args){
		OnlyThread td =new OnlyThread();		
		td.start();   
	}
	public void run(){
		for(int row=1,count=1;row<10;row++,count++){
			for(int i=0; i<count;i++){
				System.out.print("*");
			}
			System.out.println();
		}
	}
	
}
