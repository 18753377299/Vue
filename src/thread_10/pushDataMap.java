package thread_10;

import java.io.IOException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.codec.Encoder;
import org.apache.commons.codec.binary.StringUtils;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;


import com.alibaba.fastjson.JSON;

public class pushDataMap implements Runnable {
	public static double pi = 3.1415926535897932384626;
	public static double a = 6378245.0;
	public static double ee = 0.00669342162296594323;
	@Override
	public void run() {
		// TODO Auto-generated method stub

//			PreparedStatement pstmt = null;    
		Connection conn=null;
	    PreparedStatement pstm=null;
	    ResultSet rs=null;
	    
		Connection conn1=null;
	    PreparedStatement pstm1=null;
	    ResultSet rs1=null;
	    
		Connection conn2=null;
	    PreparedStatement pstm2=null;
	    ResultSet rs2=null;
	    
	    
	    PreparedStatement pstm3=null;
	    ResultSet rs3=null;
	    
	    PreparedStatement pstmAdd=null;
	    ResultSet rsAdd=null;
	    
	    int count = 0;
		try {      
			Class.forName("com.informix.jdbc.IfxDriver").newInstance();        
			String url = "jdbc:informix-sqli://10.10.68.22:10001/prprisk:informixserver=test3;NEWLOCALE=zh_CN,zh_CN;NEWCODESET=gb18030,8859-1,819;IFX_USE_STRENC=true";        
			String user="ccfx";
			String password="piccccfx";
			conn= DriverManager.getConnection(url, user, password);
			
        	String sqladd= "select * from prpdcode";
		    //3.Ԥ������Ҫִ�е�sql
	        pstmAdd = conn.prepareStatement(sqladd);
	        //ִ��sql�����ز�ѯ���
	        rsAdd = pstmAdd.executeQuery();
	        Map<String, String> map =new HashMap<String, String>();
	        while(rsAdd.next()){
	        	map.put(rsAdd.getString(2).trim(), rsAdd.getString(3));
	        }
	        
	        
			//2����дsql���
		    String sql="select count(*) from riskmap_address where score is null";
		    //3.Ԥ������Ҫִ�е�sql
	        pstm = conn.prepareStatement(sql);
	        //ִ��sql�����ز�ѯ���
	        rs = pstm.executeQuery();
	        if(rs.next())
	        {
	        	
	        	try {

	        	int pageNo=	Integer.parseInt(Thread.currentThread().getName().charAt(7)+"");
	        	int dataCount=rs.getInt(1);

			    String sql1="select skip ? first ? * from riskmap_address where score is null order by addressid";
			    conn= DriverManager.getConnection(url, user, password);
			    //3.Ԥ������Ҫִ�е�sql
		        pstm1 = conn.prepareStatement(sql1);
		        pstm1.setInt(1, pageNo*dataCount/10);
		        if(Thread.currentThread().getName().charAt(7) != '9') {
		        	pstm1.setInt(2, dataCount/10);
		        }else {
		        	pstm1.setInt(2, dataCount%10+dataCount/10);
		        }
	        	System.out.println(pageNo+"***********"+pageNo*dataCount/10);
		        //ִ��sql�����ز�ѯ���
		        rs1 = pstm1.executeQuery();
		        
		        while(rs1.next()) {
					count ++;
		        	String addressId=rs1.getString(1);
		        	String postcode=rs1.getString(7);
		        	String addressname =rs1.getString(8);
		        		String postName ="";
		        		if(postcode !=null) {
			        		if(map.containsKey(postcode.substring(0, 4)+"00")) {
			        			postName = map.get(postcode.substring(0, 4)+"00");
			        		}else if(map.containsKey(postcode.substring(0, 3)+"000")) {
			        			postName =map.get(postcode.substring(0, 3)+"000");
			        		}else if(map.containsKey(postcode.substring(0, 2)+"0000")) {
			        			postName =map.get(postcode.substring(0, 2)+"0000");
			        		}else {
			        			postName ="ȫ��";
			        		}
			        	}else {
			        		postName ="ȫ��";
			        	}
			            System.out.println(subDun(addressname)+"**"+Thread.currentThread().getName());
				        HttpClient client = HttpClients.createDefault();
				        String urlStr = "http://10.133.216.176:6001/search/geo?keywords="+URLEncoder.encode(subDun(addressname), "UTF-8")+"&city="+postName+"&search_type=for_simple";
				        try {
				        HttpGet get = new HttpGet(urlStr);  
			            HttpResponse response = client.execute(get);
			            HttpEntity entity = response.getEntity();
			            String result = EntityUtils.toString(entity, "UTF-8");
			            Response resp = JSON.parseObject(result,Response.class);
			            System.out.println(result);
			            if(resp!=null && resp.getGeo()!=null) {
				            String location =resp.getGeo().getLocation();
				            String[] aa =location.split(",");
				            String score =resp.getGeo().getScore();
				            
				            
		        			Gps gps = gcj_To_Gps84(Double.parseDouble(aa[1]),Double.parseDouble(aa[0]));
		        			double lat= stringToDouble(gps.getWgLat());
		    				double lon= stringToDouble(gps.getWgLon());
				            
				            String sql3 ="update riskmap_address set pointx = ?,pointy=?,pointx2 = ?,pointy2=?,score=?,citycode=?,manualflag=? where addressid =?";
						    //3.Ԥ������Ҫִ�е�sql
					        pstm3 = conn.prepareStatement(sql3);
					        
					        pstm3.setString(1, String.valueOf(lon));
					        pstm3.setString(2, String.valueOf(lat));
					        pstm3.setString(3, aa[0]);
					        pstm3.setString(4, aa[1]);
				        	pstm3.setString(5, score);
					        if(resp.getCurrentDistrict()!=null) {
					        	pstm3.setString(6, resp.getCurrentDistrict().getCitycode());
					        }else {
					        	pstm3.setString(6, null);
					        }
					        pstm3.setString(7, "1");
					        pstm3.setString(8, addressId);
					        pstm3.executeUpdate();
				            System.out.print(location+"***********"+score);
			            }
				        }catch (Exception e) {
				        	e.printStackTrace();
				            String sql3 ="update riskmap_address set manualflag=? where addressid =?";
						    //3.Ԥ������Ҫִ�е�sql
					        pstm3 = conn.prepareStatement(sql3);
					        
					        pstm3.setString(1, "0");
					        pstm3.setString(2, addressId);
					        pstm3.executeUpdate();
				        	continue;
							// TODO: handle exception
						}
	
		        
	        }
	        System.out.println("����Ϊ"+count);	        
	        }catch (Exception e) {
	        	e.printStackTrace();
				// TODO: handle exception
			}
	        }
		}catch (Exception e) {
			e.printStackTrace();
			// TODO: handle exception
		}finally {
	        mysqlcolse(conn, pstm, rs);
	    }
	
	}
    public static void mysqlcolse(Connection con,PreparedStatement pstem,ResultSet rs) {

        try {
            if(con!=null) {
            con.close();
            }
            if(pstem!=null)
            {
                pstem.close();
            }
            if(rs!=null) {
                rs.close();
            }
        } catch (SQLException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }


}
    
    //��ȡ����֮ǰ
	public static String subDun(String result) {
		result =result.trim().replaceAll("\\s*", "").replaceAll("#", "").replaceAll("\\([^\\(^\\)]*\\)", "").replaceAll("\\��[^\\��^\\��]*\\��", "")
				.replaceAll("\\\\","");
		if(result.indexOf("��")>-1) {
			result = result.substring(0,result.indexOf("��")+1);
		}
//				result=subCun(result);
//		result=sub(result);
		return result.trim();
	}
    //��ȡ��xx��֮ǰ
	public static String sub(String s) {
		String result =s;
		if(s.lastIndexOf("��")>-1) {
			for(int i =1;i<s.length();i++) {
				if(Character.isDigit(s.charAt(s.lastIndexOf("��")-i))) {
					continue;
				}else {
					result = s.substring(0,s.lastIndexOf("��")-i+1);
					break;
				}
			}
		}
		return result;
	}
	
	
	// ��ȡ��¥���á�����·����
	public static String subCun(String s) {
		String result =s;
		if(s.indexOf("¥")>-1) {
			result = s.substring(0,s.lastIndexOf("¥")+1);
		}else if(s.indexOf("��")>-1) {
			result = s.substring(0,s.lastIndexOf("��")+1);
		}else if(s.indexOf("С��")>-1) {
			result = s.substring(0,s.lastIndexOf("С��")+1);
		}else if(s.indexOf("��")>-1) {
			result = s.substring(0,s.lastIndexOf("��")+1);
		}else if(s.indexOf("·")>-1) {
			result = s.substring(0,s.lastIndexOf("·")+1);
		}else if(s.indexOf("��")>-1) {
			result = s.substring(0,s.lastIndexOf("��")+1);
		}
//		else if(s.indexOf("԰��")>-1) {
//			result = s.substring(0,s.lastIndexOf("԰��")+1);
//		}else if(s.indexOf("��ҵ԰")>-1) {
//			result = s.substring(0,s.lastIndexOf("��ҵ԰")+1);
//		}else if(s.indexOf("��")>-1) {
//			result = s.substring(0,s.lastIndexOf("��")+1);
//		}
		return result;
	}
	// ��ȡ��¥���á�����·����
	public static String subNoDao(String s) {
		String result =s;
		if(s.indexOf("��")>-1) {
			result = s.substring(0,s.indexOf("��")+1);
		}else if(s.indexOf("԰��")>-1) {
			result = s.substring(0,s.indexOf("԰��")+1);
		}else if(s.indexOf("��ҵ԰")>-1) {
			result = s.substring(0,s.indexOf("��ҵ԰")+1);
		}else if(s.indexOf("��")>-1) {
			result = s.substring(0,s.indexOf("��")+1);
		}
		return result;
	}
	
    public double stringToDouble(double log){
   	 BigDecimal b = new BigDecimal(log);
   	 double dou = b.setScale(6, BigDecimal.ROUND_HALF_UP).doubleValue(); 
   	 return dou;
   }
   /**
	 * * ��������ϵ (GCJ-02) to 84 * * @param lon * @param lat * @return
	 * */
	public static Gps gcj_To_Gps84(double lat, double lon) {
		Gps gps = transform(lat, lon);
		double lontitude = lon * 2 - gps.getWgLon();
		double latitude = lat * 2 - gps.getWgLat();
		return new Gps(latitude, lontitude);
	}
	
	
	public static Gps transform(double lat, double lon) {
		if (outOfChina(lat, lon)) {
			return new Gps(lat, lon);
		}
		double dLat = transformLat(lon - 105.0, lat - 35.0);
		double dLon = transformLon(lon - 105.0, lat - 35.0);
		double radLat = lat / 180.0 * pi;
		double magic = Math.sin(radLat);
		magic = 1 - ee * magic * magic;
		double sqrtMagic = Math.sqrt(magic);
		dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
		dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
		double mgLat = lat + dLat;
		double mgLon = lon + dLon;
		return new Gps(mgLat, mgLon);
	}
	public static double transformLat(double x, double y) {
		double ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y
				+ 0.2 * Math.sqrt(Math.abs(x));
		ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
		ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
		ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
		return ret;
	}
 
	public static double transformLon(double x, double y) {
		double ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1
				* Math.sqrt(Math.abs(x));
		ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
		ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
		ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0
				* pi)) * 2.0 / 3.0;
		return ret;
	}
	public static boolean outOfChina(double lat, double lon) {
		if (lon < 72.004 || lon > 137.8347)
			return true;
		if (lat < 0.8293 || lat > 55.8271)
			return true;
		return false;
	}
	 /**
     * ִ��һ����������HTTP GET���󣬷���������Ӧ��JSON�ַ���
     *
     * @param url �����URL��ַ
     * @return ����������Ӧ��JSON�ַ���
     */
    public static String doGet(String url, String param) {

        String result = "";
	    HttpClient client = HttpClients.createDefault();
        HttpGet get = new HttpGet(url + "?" + param); 
        try {
            HttpResponse response = client.execute(get);
            HttpEntity entity = response.getEntity();
            result = EntityUtils.toString(entity, "UTF-8");
        } catch (IOException e) {
        	e.printStackTrace();
        } finally {
        	get.releaseConnection();
        }
        return result;
    }
	
}


