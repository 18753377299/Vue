
import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.net.URLDecoder;
import java.util.regex.Pattern;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.StringUtils;



public class Hello{
    public static void main(String[] args){
    	 String  aaString = "";
    	 if(StringUtils.isEmpty(aaString)){
    		 System.out.println("========aaaaaa===========");
    	 }
//        String str="123,assume345contribute";
//        System.out.println(str.replaceAll("\\d+",""));
    	String [] pictureArray= "4.2.4".split(",");
    	System.out.println("pictureArray:"+pictureArray);
    	String str22 = " he  ll o ";
    	String str2 = str22.replaceAll(" ", "");
    	System.out.println(str2);
    	System.out.println("、存在地下资产".indexOf("、存在地下资产"));
     // 要求将里面的字符取出，也就是说按照数字拆分
//        String str = "11Adsd1Bdfd22C333Dere4444Edf55555Fdf" ;
        String str="1、 存在地下资产2、 存在砖木结构厂房3、 企业所在区属于高雷区8、 电气线路使用年限超过10年9、 厂区历史上有进水历史";
        // 指定好一个字符串
        String pat = "\\d+[、]" ;
        // 指定好正则表达式
        Pattern p = Pattern.compile(pat) ;
        // 实例化Pattern类
        String s[] = p.split(str) ;
        // 执行拆分操作
        for(int x=0;x<s.length;x++){
        	System.out.print(s[x] + "\t") ;
        }
        System.out.println("");
        String urlString="http://10.10.1.61:6001/SunECM/GetImageForJJ.servlet?dHJtX2lwPWh0dHA6Ly8xMC4xMC4xLjYxOjYwMTEvU3VuVFJNL3NlcnZsZXQvR2V0SW1hZ2U/JmZpbGVfbmFtZT0vaG9tZS9taWRkbGV3YXJlL0VDTUZvbGRlci90ZW1wNjAwMS9teXNlbmQvcmlza0NvbnRyb2wvMjAxOC8wNS8zMC80Ni82Mi85QTE1Q0VDQTBFRTRGNjU4MjNDNTM2OEY1MkYwMTU0Ml8xLzQ3RjA0ODhELUZDM0QtMjk3OS1BMkQyLURBMkY4MTIxQzk4Qi5qcGc=";
        String  imageUrl=""; 
        try {
			imageUrl = URLDecoder.decode(urlString, "UTF-8");
			System.out.println("====================="+imageUrl);
			System.out.println(10/0);
		} catch (Exception e) {
			e.printStackTrace();
			e.getStackTrace();
		}
        AjaxResult ajaxResult = getImageBase(urlString);
    }
    public static AjaxResult getImageBase(String imageURL) {
		
		 String strBase64 = null;
		 AjaxResult ajaxResult = new AjaxResult();
		 DataInputStream dataInputStream = null;
   	 ByteArrayOutputStream outStream = null;
	        try {
	        	String imageUrl = "";
	    		try {
	    			System.out.println("==============imageURL================"+imageURL+"===========================");
	    			imageUrl = URLDecoder.decode(imageURL, "UTF-8");
	    			System.out.println("==============imageUrl================"+imageUrl+"===========================");
	    		} catch (UnsupportedEncodingException e) {
	    			e.printStackTrace();
	    		}
	    		
	    		URL url;
	    		url = new URL(imageUrl);
	    		dataInputStream = new DataInputStream(url.openStream());
	    		
	    		outStream = new ByteArrayOutputStream();
	    		
	    		byte[] buffer = new byte[1024];
	             
	            int len = 0;
	            while( (len=dataInputStream.read(buffer)) != -1 ){
	            	outStream.write(buffer, 0, len);
	            }
	   
	            // in.available()返回文件的字节长度
	            byte[] bytes = outStream.toByteArray();
	            // 将文件中的内容读入到数组中
	            dataInputStream.read(bytes);
	            try {
	            	 strBase64 = Base64.encodeBase64String(bytes);
				} catch (Exception e) {
					e.printStackTrace();
				}
	            
//	            strBase64 = Base64.getEncoder().encodeToString(bytes);
//	            strBase64 = new BASE64Encoder().encode(bytes);      //将字节流数组转换为字符串
	            dataInputStream.close();
//	            StringToImage(strBase64);
	            ajaxResult.setData(strBase64);
	            ajaxResult.setStatusText("成功");
				ajaxResult.setStatus(1);
	        } catch (Exception e) {
	        	ajaxResult.setStatusText("失败");
				ajaxResult.setStatus(0);
	            e.printStackTrace();
	        }finally{
	        	try {
	        		dataInputStream.close();
					outStream.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
	        }
	        return ajaxResult;
	}
}