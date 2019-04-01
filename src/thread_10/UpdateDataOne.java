package thread_10;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.Charset;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Locale;
import java.util.ResourceBundle;

import org.apache.commons.httpclient.DefaultHttpMethodRetryHandler;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.MultiThreadedHttpConnectionManager;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.params.HttpMethodParams;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.StreamUtils;

import com.alibaba.fastjson.JSON;

	/**
 * @author  作者 E-mail: 
 * @date 创建时间：2018年11月22日 下午6:11:35
 * @return  */
public class UpdateDataOne {
		
	public static void main(String[] args) {	
		System.out.println("hello");
		MoreThreadone moreThread =new MoreThreadone();
		moreThread.updateDtvData();
//		for(int i =0 ;i<20;i++){
////			MoreThread  mThread = new MoreThread(4666,4829);
//			MoreThread  mThread = new MoreThread(i*6500+1,(i+1)*6500);
//			mThread.start();
//		}		
		System.out.println("hello22");
	}		
}
class MoreThreadone extends Thread {
	
	private int start;
	private int end;
	
	public MoreThreadone() {
		super();
	}
	public MoreThreadone(int start, int end) {
		super();
		this.start = start;
		this.end = end;
	}
	
	public  void run(){
//		this.updateDtvData(start,end);
	}
	// 更新数据
	public void updateDtvData(){
		Connection conn = null;
		PreparedStatement stat = null;
		ResultSet rs = null;		
//				ResourceBundle bundle = ResourceBundle.getBundle("config.map", Locale.getDefault());
//				String riskMap_Address = bundle.getString("riskMap_address");
		String  riskMap_Address = "SMDTV_2";
		
		try {
			 Class.forName("oracle.jdbc.OracleDriver");
//					conn = slaveJdbcTemplate.getDataSource().getConnection();
//			conn = DriverManager.getConnection("jdbc:oracle:thin:@10.10.68.248:1521:orcl",
//                    "riskcontrol","riskcontrol");
			conn = DriverManager.getConnection("jdbc:oracle:thin:@10.10.68.248:1521:orcl",
                    "riskcontrol_freeze","riskcontrol_freeze");
					String sql="select SMID,SMX,SMY from " + riskMap_Address
							+ " where VALIDSTATUS ='1' and RAINSCALE is null";
//			String sql="select SMID,SMX,SMY from " + riskMap_Address
//					+ " where VALIDSTATUS ='1' and SMID between "+start+" and " + end;
//					String sql="select SMID,SMX,SMY from " + riskMap_Address
//							+ " where VALIDSTATUS ='1' and EQPGA is not null and SMID between "+start+" and " + end;
			stat = conn.prepareStatement(sql);
			rs = stat.executeQuery();
			System.out.println(rs);
			for(int i=1;rs.next();i++) {
				long startTime=System.currentTimeMillis();
				String[] str=new String[3];
				str[0]=rs.getString(1);
				str[1]=rs.getString(2);	
				str[2]=rs.getString(3);				
				//更新数据
				System.out.println("执行的条数："+i);
				this.updateData(str,riskMap_Address);
				long endTime=System.currentTimeMillis();
				System.out.println("程序运行时间： "+(endTime-startTime)+"ms");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}		
	}
	// 刷新表中的栅格风险值
	@SuppressWarnings("static-access")
	public void updateData(String [] smArray,String riskMapAddress){
		// 获取iserver的地址
		ResourceBundle bundle = ResourceBundle.getBundle("config.map", Locale.getDefault());
//				String serverName = bundle.getString("serverName");
		String serverName = "http://10.10.1.156:8090/";
		
		Connection conn = null;
		PreparedStatement stat = null;
//				ResultSet rs = null;
		String [] rasterDangerArray ={"rain_hazard_scale_1km","thunderstorm_hazard_scale_1km","snowstorm_hazard_scale_1km","hail_hazard_scale_1km",
		                              "flood_hazard_scale_1km","typhoon_hazard_scale_1km","landslide_hazard_scale_1km","eq_hazard_PGA"};

		String [] valueArray = new String[8];  
		for(int i=0;i<rasterDangerArray.length;i++){
			String url=serverName+"iserver/services/data-FXDT/rest/data/datasources/china/datasets/"+rasterDangerArray[i]+"/gridValue.json";
			String param = "x="+smArray[1]+"&y="+smArray[2];
			
			String resJson =  this.doGet(url,param);
//			String resJson =  this.callWebPageGet(url,param);
//			String resJson =  "";
//					System.out.println("请求的url:"+url+"?"+param);
			GridValue gridValue=new GridValue();
			if(StringUtils.isNotBlank(resJson)){
				gridValue = JSON.parseObject(resJson.toString(),GridValue.class);
				BigDecimal gridValueBd = gridValue.getValue();
				//假如值小于0，则置为0,保留两位小数
				if(gridValueBd.compareTo(new BigDecimal(0))==-1){
					gridValueBd = BigDecimal.ZERO;
				}
				valueArray[i] = gridValueBd.setScale(2,BigDecimal.ROUND_HALF_UP).toString();
			}else {
				System.out.println("请求的url:"+url+"?"+param);
				valueArray[i] = BigDecimal.ZERO.toString();
			}			
		}
		try {
//					conn = slaveJdbcTemplate.getDataSource().getConnection();
//			conn = DriverManager.getConnection("jdbc:oracle:thin:@10.10.68.248:1521:orcl",
//                    "riskcontrol","riskcontrol");
			conn = DriverManager.getConnection("jdbc:oracle:thin:@10.10.68.248:1521:orcl",
                    "riskcontrol_freeze","riskcontrol_freeze");			
			String sql="";
			sql ="update "+ riskMapAddress+" set RAINSCALE="+valueArray[0]+",THUNDERSTORMSCALE="+valueArray[1]+
					",SNOWSTORMSCALE="+valueArray[2]+",HAILSCALE="+valueArray[3]+
					",FLOODSCALE="+valueArray[4]+",TYPHOONSCALE="+valueArray[5]+
					",LANDSLIDESCALE="+valueArray[6]+",EQPGA="+valueArray[7]+" where SMID="+smArray[0];
//			sql ="update "+ riskMapAddress+" set RAINSCALE=null,THUNDERSTORMSCALE=null,SNOWSTORMSCALE=null,HAILSCALE=null,FLOODSCALE=null,TYPHOONSCALE=null,LANDSLIDESCALE=null,EQPGA=null where SMID="+smArray[0];
			stat = conn.prepareStatement(sql);
			stat.executeUpdate();			
		} catch (SQLException e) {
			e.printStackTrace();
		}			
	}
		
	 public static String doGet(String url, String param) {
		 
		 	MultiThreadedHttpConnectionManager mHCM =  new MultiThreadedHttpConnectionManager();  
		 	mHCM.setMaxConnectionsPerHost(20);
		 	mHCM.setMaxTotalConnections(40);
	        HttpClient client = new HttpClient();
	        client.setHttpConnectionManager(mHCM);
	        
	        GetMethod method = new GetMethod(url + "?" + param);
	        method.getParams().setParameter(HttpMethodParams.RETRY_HANDLER,new DefaultHttpMethodRetryHandler());
	        try {
	            client.executeMethod(method);
//	            Thread.sleep(100);
	            if (method.getStatusCode() == HttpStatus.SC_OK) {
	                return StreamUtils.copyToString(method.getResponseBodyAsStream(), Charset.forName("utf-8"));
	            }
	        } catch (Exception e) {
	        	e.printStackTrace();
	        	System.out.println("异常的URL:"+url + "?" + param);
//			        	LOGGER.info("执行HTTP Get请求" + url + "时，发生异常！",e);
//			        	throw new RuntimeException("执行HTTP Get请求" + url + "时，发生异常！",e);
	        } finally {
	            method.releaseConnection();
	        }
	        return "";
	   }
	 /**
	     * 用get方式连接url
	     * @param urlString url路径
	     * @param pdata    url参数
	     * @return 从url获得的数据
	     */
	    public static String callWebPageGet(String urlString,String param) {
	        String result="";
	        PrintWriter out = null;  
	        BufferedReader in = null; 
	        URL url=null;
	        try {
	            url = new URL(urlString+ "?" + param);//用url路径以及所用参数创建URL实例类
	            URLConnection connect = url.openConnection();//创建连接
	            connect.setRequestProperty("content-type","application/x-www-form-urlencoded;charset=utf-8");//设置请求header的属性--请求内容类型
	            connect.setRequestProperty("method","GET");//设置请求header的属性值--请求方式
	            // 建立实际的连接  
	            connect.connect();  //建立与url所在服务器的连接
	            // 获取所有响应头字段  
//	            Map<String, List<String>> map = connect.getHeaderFields();  
	            // 遍历所有的响应头字段 
//	            for (String key : map.keySet()) {  
//	                System.out.println(key + "--->" + map.get(key));  
//	            }
	            
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
	 
}
