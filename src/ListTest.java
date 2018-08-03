import java.util.ArrayList;
import java.util.List;

	/**
 * @author  作者 E-mail: 
 * @date 创建时间：2017年12月11日 下午4:08:40
 * @version 1.0 
 * @parameter 
 * @since  
 * @return  */
public class ListTest {
   public static void main(String[]args){
	   List books=new ArrayList();
	   books.add("aaa");
	   books.add("bbbb");
	   books.add("ccccc");
	   System.out.println(books);
	   books.remove(new A());
	   System.out.println(books);
	   books.remove(new A());
	   System.out.println(books);
	   List<String> list =new ArrayList<String>();
	   try {
		   for(String temp:list){
			   System.out.println("aaaa"+temp);
		   }
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
	   
   }
}
class A{
	public boolean equals(Object object){
		return true;
	}
}
