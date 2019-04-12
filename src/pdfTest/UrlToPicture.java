package pdfTest;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;

import javax.imageio.ImageIO;

import sun.misc.BASE64Decoder;
	/**
 * @author  作者 E-mail: 
 * @date 创建时间：2019年4月10日 下午6:01:29
 * @version 1.0 
 * @parameter 
 * @since  
 * @return  */
public class UrlToPicture {
	public static void main(String []args){
		try {
			String imageDataurl ="iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAABZUlEQVR4Xu3TQREAAAiEQK9/aWvsAxMw4O06ysAommCuINgTFKQgmAEMp4UUBDOA4bSQgmAGMJwWUhDMAIbTQgqCGcBwWkhBMAMYTgspCGYAw2khBcEMYDgtpCCYAQynhRQEM4DhtJCCYAYwnBZSEMwAhtNCCoIZwHBaSEEwAxhOCykIZgDDaSEFwQxgOC2kIJgBDKeFFAQzgOG0kIJgBjCcFlIQzACG00IKghnAcFpIQTADGE4LKQhmAMNpIQXBDGA4LaQgmAEMp4UUBDOA4bSQgmAGMJwWUhDMAIbTQgqCGcBwWkhBMAMYTgspCGYAw2khBcEMYDgtpCCYAQynhRQEM4DhtJCCYAYwnBZSEMwAhtNCCoIZwHBaSEEwAxhOCykIZgDDaSEFwQxgOC2kIJgBDKeFFAQzgOG0kIJgBjCcFlIQzACG00IKghnAcFpIQTADGE4LKQhmAMNpIQXBDGA4LQQL8oTPAGUY76lBAAAAAElFTkSuQmCC";
			
			BASE64Decoder decoder = new BASE64Decoder();
			byte[] b = decoder.decodeBuffer(imageDataurl);//转码得到图片数据
			ByteArrayInputStream bais = new ByteArrayInputStream(b);
			BufferedImage bi1 = ImageIO.read(bais);
			File w2 = new File("D://test.png");
			ImageIO.write(bi1, "png", w2);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
}
