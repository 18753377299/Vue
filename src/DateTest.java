import java.text.DateFormat;
import java.util.Date;
import java.util.Locale;

	/**
 * @author  作者 E-mail: 
 * @date 创建时间：2018年3月9日 下午3:42:35
 * @version 1.0 
 * @parameter 
 * @since  
 * @return  */
public class DateTest {

	public static void main(String[] args) {
		Date date=new java.util.Date();
         System.out.println("输出日期："+date);
         
         DateFormat df1 = null ;     // 声明一个DateFormat  
         DateFormat df2 = null ;     // 声明一个DateFormat  
         df1 = DateFormat.getDateInstance(DateFormat.YEAR_FIELD,new Locale("zh","CN")) ; // 得到日期的DateFormat对象  
         df2 = DateFormat.getDateTimeInstance(DateFormat.YEAR_FIELD,DateFormat.ERA_FIELD,new Locale("zh","CN")) ;    // 得到日期时间的DateFormat对象  
         System.out.println("DATE：" + df1.format(new Date())) ; // 按照日期格式化  
         System.out.println("DATETIME：" + df2.format(new Date())) ;   // 按照日期时间格式化  
         DateFormat dateFormat = DateFormat.getDateInstance(DateFormat.DEFAULT, Locale.CHINA);
//			String  aa ="2018年-01月-12日";
		String classCName = dateFormat.format(new Date());
		System.out.println(classCName);
	}

}
