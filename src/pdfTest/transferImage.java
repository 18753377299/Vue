package pdfTest;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLDecoder;

import javax.imageio.ImageIO;

import org.apache.commons.codec.binary.Base64;

import sun.misc.BASE64Encoder;


//addby 20180327
public class transferImage {

	public static void main(String[] args) {
		String imgUrlPath ="http://10.10.1.61:6001/SunECM/GetImageForJJ.servlet?dHJtX2lwPWh0dHA6Ly8xMC4xMC4xLjYxOjYwMTEvU3VuVFJNL3NlcnZsZXQvR2V0SW1hZ2U/JmZpbGVfbmFtZT0vaG9tZS9taWRkbGV3YXJlL0VDTUZvbGRlci90ZW1wNjAwMS9teXNlbmQvcmlza0NvbnRyb2wvMjAxOC8wMS8wNS80Ny8xNS9GQzFBN0JBNkRCRUZBQzY2MDQyNjdCNTg5M0E3NTJDM18xLzk4NTc3QkQ3LTIyNzQtNEM0RC01RTgyLUYzNUFDMjcxRUU5Mi5qcGc=";
		URL url=null;
		try {
			url = new URL(imgUrlPath);
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		encodeImgageToBase64(url);
//		System.out.println(encodeImgageToBase64(url));
		getImageBase(imgUrlPath);
//		System.out.println(getImageBase(imgUrlPath));	
		
	}
	
	/**
	   * 将网络图片进行Base64位编码
	   * 
	   * @param imgUrl 图片的url路径，如http://.....xx.jpg
	   * @return
	   */
	  public static String encodeImgageToBase64(URL imageUrl) {// 将图片文件转化为字节数组字符串，并对其进行Base64编码处理
		ByteArrayOutputStream outputStream = null;
		try {
		  BufferedImage bufferedImage = ImageIO.read(imageUrl);
		  outputStream = new ByteArrayOutputStream();
		  ImageIO.write(bufferedImage, "jpg", outputStream);
		} catch (MalformedURLException e1) {
		  e1.printStackTrace();
		} catch (IOException e) {
		  e.printStackTrace();
		}
		// 对字节数组Base64编码
		BASE64Encoder encoder = new BASE64Encoder();
		return encoder.encode(outputStream.toByteArray());// 返回Base64编码过的字节数组字符串
	  }
	  //success
	  public static String getImageBase(String imageURL) {
			
			 String strBase64 = null;
//			 AjaxResult ajaxResult = new AjaxResult();
			 DataInputStream dataInputStream = null;
	    	 ByteArrayOutputStream outStream = null;
		        try {
		        	String imageUrl = "";
		    		try {
		    			imageUrl = URLDecoder.decode(imageURL, "UTF-8");
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
//		            dataInputStream.read(bytes);
		            strBase64 = Base64.encodeBase64String(bytes);
		            
//		            strBase64 = Base64.getEncoder().encodeToString(bytes);
//		            strBase64 = new BASE64Encoder().encode(bytes);      //将字节流数组转换为字符串
		            dataInputStream.close();
//		            StringToImage(strBase64);
//		            ajaxResult.setData(strBase64);
//		            ajaxResult.setStatusText("成功");
//					ajaxResult.setStatus(1);
		        } catch (Exception e) {
//		        	ajaxResult.setStatusText("失败");
//					ajaxResult.setStatus(0);
//		            e.printStackTrace();
		        }finally{
		        	try {
		        		dataInputStream.close();
						outStream.close();
					} catch (IOException e) {
						e.printStackTrace();
					}
		        }


		        return strBase64;
		}
	  
	  /** 
	     * 获取网络图片并转为Base64编码 
	     *  
	     * @param url 
	     *            网络图片路径 
	     * @return base64编码 
	     * @throws Exception    error
	     */  
	    public static String GetUrlImageToBase64(String url) throws Exception {  
	        if (url == null || "".equals(url.trim()))  
	            return null;  
	        URL u = new URL(url);  
	        // 打开图片路径  
	        HttpURLConnection conn = (HttpURLConnection) u.openConnection();  
	        // 设置请求方式为GET  
	        conn.setRequestMethod("GET");  
	        // 设置超时响应时间为5秒  
	        conn.setConnectTimeout(5000);  
	        // 通过输入流获取图片数据  
	        InputStream inStream = conn.getInputStream();  
	        // 读取图片字节数组  
	        byte[] data = new byte[inStream.available()];  
	        inStream.read(data);  
	        inStream.close();  
	        // 对字节数组Base64编码  
	        BASE64Encoder encoder = new BASE64Encoder();  
	        // 返回Base64编码过的字节数组字符串  
	        return encoder.encode(data);  
	    }  
	

}
