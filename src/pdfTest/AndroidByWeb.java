package pdfTest;


import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Calendar;
import java.util.Date;
	/**
 * @author  作者 E-mail: 
 * @date 创建时间：2017年12月29日 下午3:01:43
 * @version 1.0 
 * @parameter 
 * @since  
 * @return  */
public class AndroidByWeb {
	public static void main(String[]args) throws NoSuchAlgorithmException{
//		http://openapi.xg.qq.com/v2/push/create_multipush?access_id=2100272892&message={"title":"测试消息","content":"来自restapi的批量接口测试消息","custom_content":{"key1":"value1","key2":"value2"}}&message_type=2&timestamp=1515397165&sign=39be7e1b692af3698b5f125852a7de85
	 
//	  String sign="POSTopenapi.xg.qq.com/v2/push/create_multipushaccess_id=2100272892message={'title':'测试消息','content':'来自restapi的批量接口测试消息','custom_content':{'key1':'value1','key2':'value2'}}message_type=2timestamp=15145336721cb0279b9105ba154ecdf3e53998fe9c";
	  long temp=System.currentTimeMillis();
	  String temp1=String.valueOf(temp);
	  temp=Long.valueOf(temp1.substring(0, 10));
	  String sign="GETopenapi.xg.qq.com/v2/push/create_multipushaccess_id=2100272892message={'title':'测试消息','content':'来自restapi的批量接口测试消息','custom_content':{'key1':'value1','key2':'value2'}}message_type=2timestamp="+temp+"1cb0279b9105ba154ecdf3e53998fe9c";
	  sign="GETopenapi.xg.qq.com/v2/push/single_deviceaccess_id=2100272892device_token=f16183ad8c350ca5bdb9e63222ebd443d6a78dd3message={'title':'测试消息','content':'来自restapi的批量接口测试消息'}message_type=1timestamp="+temp+"1cb0279b9105ba154ecdf3e53998fe9c";
   	
	  String str= AndroidByWeb.encode2hex(sign);
	  MD5 md5 = new MD5();
	  String md5Str=md5.getMD5ofStr(sign);
	  System.out.println("加密后为：" + str);
	  System.out.println("md5Str="+md5Str);
	  System.out.println("temp:"+temp);
	  System.out.println("时间戳："+System.currentTimeMillis());
	  System.out.println("时间戳："+Calendar.getInstance().getTimeInMillis());//new Date().getTime()
	  System.out.println("时间戳："+new Date().getTime());
	}
	/** 
     * 将源字符串使用MD5加密为32位16进制数 
     * @param source 
     * @return 
     */  
    public static String encode2hex(String source) {  
        byte[] data = encode2bytes(source);  
  
        StringBuffer hexString = new StringBuffer();  
        for (int i = 0; i < data.length; i++) {  
            String hex = Integer.toHexString(0xff & data[i]);  
              
            if (hex.length() == 1) {  
                hexString.append('0');  
            }  
              
            hexString.append(hex);  
        }  
          
        return hexString.toString();  
    } 
    /** 
     * 将源字符串使用MD5加密为字节数组 
     * @param source 
     * @return 
     */  
    public static byte[] encode2bytes(String source) {  
        byte[] result = null;  
        try {  
            MessageDigest md = MessageDigest.getInstance("MD5");  
            md.reset();  
            md.update(source.getBytes("UTF-8"));  
            result = md.digest();  
        } catch (NoSuchAlgorithmException e) {  
            e.printStackTrace();  
        } catch (UnsupportedEncodingException e) {  
            e.printStackTrace();  
        }  
          
        return result;  
    }  
    /** 
     * 验证字符串是否匹配 
     * @param unknown 待验证的字符串 
     * @param okHex 使用MD5加密过的16进制字符串 
     * @return  匹配返回true，不匹配返回false 
     */  
    public static boolean validate(String unknown , String okHex) {  
        return okHex.equals(encode2hex(unknown));  
    }  
      
}
