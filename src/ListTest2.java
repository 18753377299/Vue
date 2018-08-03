import java.util.List;

	/**
 * @author  作者 E-mail: 
 * @date 创建时间：2017年12月11日 下午4:24:59
 * @version 1.0 
 * @parameter 
 * @since  
 * @return  */
public class ListTest2 {
   public static void main(String[] args){
	   String [] books={"aaa","bbb","ccccc"};
	   List bookList=new java.util.ArrayList();
	   for(int i=0;i<books.length;i++){
		   bookList.add(books[i]);
	   }
	   java.util.ListIterator lIterator= bookList.listIterator();
	   while(lIterator.hasNext()){
		   System.out.println(lIterator.next());
		   lIterator.add("===eeeeee===");
	   }
	   
	   System.out.println("=======反向=======");
	   while(lIterator.hasPrevious()){
		   System.out.println(lIterator.previous());
	   }
	   
   }
}
