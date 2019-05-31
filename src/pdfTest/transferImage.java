package pdfTest;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLDecoder;

import javax.imageio.ImageIO;

import org.apache.commons.codec.binary.Base64;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;


//addby 20180327
public class transferImage {

	public static void main(String[] args) {
//		String imgUrlPath ="http://10.10.1.61:6001/SunECM/GetImageForJJ.servlet?dHJtX2lwPWh0dHA6Ly8xMC4xMC4xLjYxOjYwMTEvU3VuVFJNL3NlcnZsZXQvR2V0SW1hZ2U/JmZpbGVfbmFtZT0vaG9tZS9taWRkbGV3YXJlL0VDTUZvbGRlci90ZW1wNjAwMS9teXNlbmQvcmlza0NvbnRyb2wvMjAxOC8wMS8wNS80Ny8xNS9GQzFBN0JBNkRCRUZBQzY2MDQyNjdCNTg5M0E3NTJDM18xLzk4NTc3QkQ3LTIyNzQtNEM0RC01RTgyLUYzNUFDMjcxRUU5Mi5qcGc=";
//		URL url=null;
//		try {
//			url = new URL(imgUrlPath);
//		} catch (MalformedURLException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//		encodeImgageToBase64(url);
////		System.out.println(encodeImgageToBase64(url));
//		getImageBase(imgUrlPath);
		
		
		String baseString="data:image/png;base64,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";
//		String  baseString="";
		//生成图片
		generateImage(baseString);
		
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
	    
	    public static String generateImage(String picBase64Info) {
			if (picBase64Info == null) { // 图像数据为空
				return "";
			}
			int index = picBase64Info.indexOf(',') + 1;
			picBase64Info = picBase64Info.substring(index, picBase64Info.length());
			if ("".equals(picBase64Info.trim())) {
				return "";
			}
			 BASE64Decoder decoder = new BASE64Decoder();
			 try{
				 //Base64解码,转成byte[]
				 byte[] b = decoder.decodeBuffer(picBase64Info);
				 for(int i=0;i<b.length;++i){
					 if(b[i]<0) {//调整异常数据
						 b[i]+=256;
					 }
				 }
				 String imgFilePath = "E://打分图1.png";//新生成的图片
				 OutputStream out = new FileOutputStream(imgFilePath);
				 out.write(b);
				 out.flush();
				 out.close();
				 return imgFilePath;
			 }catch (Exception e){
				 return "";
			 }
		}
	

}
