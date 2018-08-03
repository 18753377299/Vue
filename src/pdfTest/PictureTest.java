package pdfTest;

import java.io.DataInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.net.URL;

import net.sf.json.JSONObject;



	/**
 * @author  作者 E-mail: 
 * @date 创建时间：2017年12月28日 下午2:34:14
 * @version 1.0 
 * @parameter 
 * @since  
 * @return  */
public class PictureTest {
   public static void main(String[]args) throws Exception{ 
	   //把网络图片转换为本地图片
//	   http://10.10.1.61:6011/SunTRM/servlet/GetImage?ZGF0ZT0yMDE3MTIyOCZmaWxlX25hbWU9L2hvbWUvbWlkZGxld2FyZS9FQ01Gb2xkZXIvdGVtcDYwMDEvbXlzZW5kL3Jpc2tDb250cm9sLzIwMTcvMTIvMjgvMjgvNjYvMzY3RjEzNjQ1NTA0N0NDQTQzMzlGQUIwNjcwRkI2RTNfMS9EMjdFRTcxRS01N0U1LTMxMEYtQjZCOS1CNTA2NDAwMEVDNDguanBn

	   //	   String aa="http://pic76.nipic.com/file/20150826/19291311_131811815000_2.jpg";
	   String aa="http://10.10.1.61:6001/SunECM/GetImageForJJ.servlet?dHJtX2lwPWh0dHA6Ly8xMC4xMC4xLjYxOjYwMTEvU3VuVFJNL3NlcnZsZXQvR2V0SW1hZ2U/JmZpbGVfbmFtZT0vaG9tZS9taWRkbGV3YXJlL0VDTUZvbGRlci90ZW1wNjAwMS9teXNlbmQvcmlza0NvbnRyb2wvMjAxOC8wMS8wNS80Ny8xNS9GQzFBN0JBNkRCRUZBQzY2MDQyNjdCNTg5M0E3NTJDM18xLzk4NTc3QkQ3LTIyNzQtNEM0RC01RTgyLUYzNUFDMjcxRUU5Mi5qcGc=";
//	   String  aa = "http://11.205.242.60:8080/prprisk_zg_b/upload/TC00300000000201800290/1.1/1.1.1.jpg";
	   URL url=new URL(aa);
//	   
//	   JSONObject jsonObject = new JSONObject();
//	   jsonObject.put("path","10.10.1.156");
//	   jsonObject.put("archivesNo","RC00300000000201800005");
//	   String json = jsonObject.toString();
//	   System.out.println(json);
	   
	   String json_str="{'path':'10.10.1.156','archivesNo':'RC00300000000201800005'}";
//	   String [] jsonString={"path":"10.10.1.156","archivesNo":"RC00300000000201800005"};
	   String joStr = "{name:\"张三\",age:\"20\"}";
	   JSONObject jsonObject2=JSONObject.fromObject(joStr);
       System.out.println(jsonObject2.getString("name"));
	   
//	   String bb = "00000000,11000000,12000000";
//	   String cc = bb.substring(0,35);
//	   System.out.println(cc);
	   
	   DataInputStream dataInputStream=new DataInputStream(url.openStream());
//	   String direct="D:/picture/level";
	   
//	   String direct="http://11.205.242.60:8080/prprisk_zg_b/upload";
//	   File newFile=new File(direct);
//	   newFile.mkdirs();
//	   Date date =new Date();
//	   String imageName=newFile+"/erererer.jpg";
//	   FileOutputStream fileOutputStream=new FileOutputStream(new File(imageName));
	   FileOutputStream fileOutputStream=new FileOutputStream(new File("D:/picture/level/","erererer.jpg"));
	   byte[]buffer=new byte[1024];
	   int length;
	   while ((length=dataInputStream.read(buffer))>0) {
		  fileOutputStream.write(buffer,0,length);		
	   }
//	   System.out.println(buffer);
	   System.out.println(fileOutputStream);
	   fileOutputStream.close();
	   dataInputStream.close();	   
   }
}
