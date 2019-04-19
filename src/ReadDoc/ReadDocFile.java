package ReadDoc;

import java.io.File;
import java.io.IOException;

import org.apache.poi.POIXMLDocument;
import org.apache.poi.POIXMLTextExtractor;
import org.apache.poi.openxml4j.exceptions.OpenXML4JException;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.xmlbeans.XmlException;
import org.springframework.util.FileCopyUtils;
	/**
 * @author  作者 E-mail: 
 * @date 创建时间：2019年4月16日 上午9:04:43
 * @version 1.0 
 * @parameter 
 * @since  
 * @return  */
public class ReadDocFile {
	public static void main(String[]args){
		try {
			String path = "F:/riskcontrol/riskcontrol_file/downloadFile/RCJBX00200002019000014_A000011533.doc";
			File file = new File(path);
//			F:/riskcontrol/riskcontrol_file/downloadFile/
			String pathAmong = "F:/riskcontrol/riskcontrol_file/downloadFile/RCJBX00200002019000014_A000011533.docx";
			String pathtarget = "F:/riskcontrol/riskcontrol_file/downloadFile/eee111.docx";
			File uFile = new File(pathtarget);
			File fileAmong = new File(pathAmong);
			file.renameTo(fileAmong);
			 
//			 if(!uFile.exists()){
//			    uFile.createNewFile();
//			 }
//			 FileCopyUtils.copy(file, uFile);
//			 OPCPackage opcPackage = POIXMLDocument.openPackage(pathtarget);
//			 POIXMLTextExtractor extractor = new XWPFWordExtractor(opcPackage);
//			 String txt= extractor.getText();
//			 System.out.println("=========="+txt);
			 
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
	}

}
