package toPdf.test;
	/**
 * @author  作者 E-mail: 
 * @date 创建时间：2019年4月17日 下午2:16:58
 * @version 1.0 
 * @parameter 
 * @since  
 * @return  */
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;

import org.apache.poi.xwpf.converter.pdf.PdfConverter;
import org.apache.poi.xwpf.converter.pdf.PdfOptions;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
 
public class DocxToPdf {
		public static void docxToPdf( XWPFDocument document,String outUrl ) throws Exception {
			 OutputStream outStream=getOutFileStream(outUrl);
			 PdfOptions options = PdfOptions.create();
			 PdfConverter.getInstance().convert(document, outStream, options);
		}
		
		protected static OutputStream getOutFileStream(String outputFilePath) throws IOException{
			File outFile = new File(outputFilePath);
			try{
				//Make all directories up to specified
				outFile.getParentFile().mkdirs();
			} catch (NullPointerException e){
				//Ignore error since it means not parent directories
			}
			outFile.createNewFile();
			FileOutputStream oStream = new FileOutputStream(outFile);
			return oStream;
		}
 
}