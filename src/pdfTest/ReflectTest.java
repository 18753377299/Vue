package pdfTest;

import java.lang.reflect.Field;

	/**
 * @author  作者 E-mail: 
 * @date 创建时间：2017年12月27日 上午10:03:45
 * @version 1.0 
 * @parameter 反射小测试
 * @since  
 * @return  */
public class ReflectTest {
	public static void main(String[]args) throws Exception{
//		Class class1=User.class;
//		Field [] fields  =class1.getDeclaredFields();
		User user =new User();
		user.setName("222");
		String name=(String)reflect(user,"name");
		setMethod(user, "info", "3333");
		System.out.println("name:"+name);
		System.out.println("info:"+user.getInfo());
		
	}
	public static Object reflect(Object object,String fieldName) throws Exception {
		Field f=object.getClass().getDeclaredField(fieldName);
		f.setAccessible(true);
		Object object2=new Object();
		System.out.println("getname:"+f.getName());
		object2=f.get(object);
//		for(Field f:fields){
//			f.setAccessible(true);
//			object2=f.get(fieldName);
//		}
		return object2;
	}
	public static void setMethod(Object object,String fieldName,String fieldValue) throws Exception{
		Field f;
		f = object.getClass().getDeclaredField(fieldName);
		f.setAccessible(true);
		f.set(object, fieldValue);			
	}
}
