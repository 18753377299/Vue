package  URL;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.URL;
import java.net.URLConnection;
import java.util.List;
import java.util.Map;

public class CallWebPage {	
	
	@SuppressWarnings("static-access")
	public static void  main(String [] args){
		
		String url ="http://10.10.1.156:8090/iserver/services/data-FXDT/rest/data/datasources/china/datasets/hail_hazard_scale_1km/gridValue.json?x=120.85419&y=29.81507";
		CallWebPage callWebPage =new CallWebPage();
		String getString =  callWebPage.CallWebPageGet(url);
		System.out.println("==========="+getString);
	}
	
    /**
     * 用get方式连接url
     * @param urlString url路径
     * @param pdata    url参数
     * @return 从url获得的数据
     */
    public static String CallWebPageGet(String urlString) {
        String result="";
        PrintWriter out = null;  
        BufferedReader in = null; 
        URL url=null;
        try {
            url = new URL(urlString);//用url路径以及所用参数创建URL实例类
            URLConnection connect = url.openConnection();//创建连接
            connect.setRequestProperty("content-type","application/x-www-form-urlencoded;charset=utf-8");//设置请求header的属性--请求内容类型
            connect.setRequestProperty("method","GET");//设置请求header的属性值--请求方式
            // 建立实际的连接  
            connect.connect();  //建立与url所在服务器的连接
            // 获取所有响应头字段  
            Map<String, List<String>> map = connect.getHeaderFields();  
            // 遍历所有的响应头字段  
//            for (String key : map.keySet()) {  
//                System.out.println(key + "--->" + map.get(key));  
//            }
            // 定义BufferedReader输入流来读取URL的响应  
            in = new BufferedReader(new InputStreamReader(connect.getInputStream()));  
            String line="";  
            while ((line = in.readLine()) != null) {  
                result +=  line;  
            }  
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        
        return result;
    }
    /**
     * 用gpost方式连接url
     * @param urlString url路径
     * @param pdata    url参数
     * @return 从url获得的数据
     */
    public static String CallWebPagePost(String urlString,String pdata) {
        String result="";
        PrintWriter out = null;  
        BufferedReader in = null; 
        URL url=null;
        try {
            url = new URL(urlString);
            URLConnection connect = url.openConnection();
            connect.setRequestProperty("content-type","application/x-www-form-urlencoded;charset=utf-8");
            connect.setRequestProperty("method","POST");
            byte[] bytes= pdata.getBytes("utf-8") ;
            connect.setDoOutput(true);  
            connect.setDoInput(true);  
            
            out = new PrintWriter(connect.getOutputStream());  
            // 发送请求参数  
            out.print(pdata);
            out.flush();  
            // 定义BufferedReader输入流来读取URL的响应  
            in = new BufferedReader(new InputStreamReader(connect.getInputStream()));  
            String line;  
            while ((line = in.readLine()) != null) {  
                result +=  line;  
            }      
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        
        return result;
    }
}