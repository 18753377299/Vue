package ReadDoc.test;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import org.apache.poi.POIXMLProperties.CoreProperties;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
	/**
 * @author  作者 E-mail: 
 * @date 创建时间：2019年4月17日 下午5:21:00
 * @version 1.0 
 * @parameter 
 * @since  
 * @return  */
public class XwpfTest {  
	   
	   /** 
	    * 通过XWPFWordExtractor访问XWPFDocument的内容 
	    * @throws Exception 
	    */  
	   public  static  void main(String[]args) throws Exception { 
		   
		  String sourceFile = "F:/riskcontrol/riskcontrol_file/downloadFile/RCJBX00200002019000014_A000011533.docx";
	        File file = new File(sourceFile);
	        InputStream is = new FileInputStream(file);  
		    Workbook rwb = WorkbookFactory.create(is);  
		    Sheet sheet = rwb.getSheetAt(0);  
		    Row row = sheet.getRow(3);  
		    Cell cell = row.getCell(0);  
		    System.out.println(cell.getStringCellValue());
		  
//	      InputStream is = new FileInputStream(sourceFile);  
//	      XWPFDocument doc = new XWPFDocument(is);  
//	      XWPFWordExtractor extractor = new XWPFWordExtractor(doc);  
//	      String text = extractor.getText();  
//	      System.out.println(text);
//	      CoreProperties coreProps = extractor.getCoreProperties();  
//	      XwpfTest.printCoreProperties(coreProps);  
//	      XwpfTest.close(is);  
	   }  
	    
	   /** 
	    * 输出CoreProperties信息 
	    * @param coreProps 
	    */  
	   private static  void printCoreProperties(CoreProperties coreProps) {  
	      System.out.println(coreProps.getCategory());   //分类  
	      System.out.println(coreProps.getCreator()); //创建者  
	      System.out.println(coreProps.getCreated()); //创建时间  
	      System.out.println(coreProps.getTitle());   //标题  
	   }  
	    
	   /** 
	    * 关闭输入流 
	    * @param is 
	    */  
	   private static void close(InputStream is) {  
	      if (is != null) {  
	         try {  
	            is.close();  
	         } catch (IOException e) {  
	            e.printStackTrace();  
	         }  
	      }  
	   }  
	    
	}  