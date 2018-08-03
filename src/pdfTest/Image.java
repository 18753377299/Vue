package pdfTest;

import java.util.List;
	/**
 * @author  作者 E-mail: 
 * @date 创建时间：2017年12月21日 上午9:56:08
 * @version 1.0 
 * @parameter 
 * @since  
 * @return  */
public class Image {
	
	private String image;
	private List<ImageSeparate> imageSeparates;

	public List<ImageSeparate> getImageSeparates() {
		return imageSeparates;
	}

	public void setImageSeparates(List<ImageSeparate> imageSeparates) {
		this.imageSeparates = imageSeparates;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}
	
	
}
