package Date;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

import org.apache.http.ParseException;
	/**
 * @author  作者 E-mail: 
 * @date 创建时间：2019年1月6日 下午4:50:01
 * @version 1.0 
 * @parameter 
 * @since  
 * @return  */
public class SearchDate {
	public static void main(String[] args) throws ParseException, java.text.ParseException {
		String dateMonth ="2019-1-12"; //dateMonth
//		Date date =new Date();
//		int month = date.getMonth();
//		int year = date.getYear();
		SimpleDateFormat sdft=new SimpleDateFormat("yyyy-MM");
		String dstr="2019-01";
		Date date=sdft.parse(dstr);
		
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		int year = cal.get(Calendar.YEAR);
		int month = cal.get(Calendar.MONTH); 
		System.out.println(year+","+month);
		System.out.println((new SimpleDateFormat("yyyy-MM-dd")).format(new Date())); 
		
		SearchDate searchDate=new SearchDate();
		searchDate.aa();
		System.out.println(searchDate.getMaxDayByYearMonth(year,month));
//        int year = 2019;
//        int month = 0;//月份从0开始,10代表11月份
        Calendar calendar = new GregorianCalendar(year, month, 1);
        int i = 1;
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        while (calendar.get(Calendar.MONTH) < month + 1) {
            calendar.set(Calendar.WEEK_OF_YEAR, i++);
            calendar.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY);
            if (calendar.get(Calendar.MONTH) == month) {
            	String  aString = sdf.format(calendar.getInstance().getTime());
            	System.out.println(sdf.format(calendar.getInstance().getTime()));

                System.out.printf("星期天：%tF%n", calendar);
            }
            calendar.set(Calendar.DAY_OF_WEEK, Calendar.SATURDAY);
            if (calendar.get(Calendar.MONTH) == month) {
                System.out.printf("星期六：%tF%n", calendar);
                System.out.println(sdf.format(calendar.getInstance().getTime()));
            }
        }
    }
	public int getMaxDayByYearMonth(int year, int month) {
		  Calendar calendar = Calendar.getInstance();
		  calendar.set(Calendar.YEAR, year);
		  calendar.set(Calendar.MONTH, month);
		  return calendar.getActualMaximum(Calendar.DATE);
	}
	public String  aa() {
		SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd");
		Calendar c = Calendar.getInstance();
		c.setTime(new Date());
//		System.out.println("当前日期:"+sf.format(c.getTime()));
		c.add(Calendar.DAY_OF_MONTH, 1);
		System.out.println("增加一天后日期:"+sf.format(c.getTime()));
		return null;
	}
	
}
