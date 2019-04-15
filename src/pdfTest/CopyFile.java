package pdfTest;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;


	/**
 * @author  作者 E-mail: 
 * @date 创建时间：2019年4月15日 下午6:30:03
 * @version 1.0 
 * @parameter 
 * @since  
 * @return  */
public class CopyFile {
	public static void main(String []args) throws IOException{
		 String sourceFile = "F:/riskcontrol/riskcontrol_file/downloadFile/aaaaa.doc";
         String destFile="F:/riskcontrol/riskcontrol_file/downloadFile/Spring444.doc";
         
         File source = new File(sourceFile);
         File target = new File(destFile);
//         CopyFile.copyFile(source,target);
         CopyFile.copyFile2(sourceFile,destFile);
	}	
	
//	public static void copyWord(){
//		Document sourceDoc = new Document("sample.docx");
//		Document destinationDoc = new Document("target.docx");
//		
//		foreach (Section sec in sourceDoc.Sections){
//		    foreach (DocumentObject obj in sec.Body.ChildObjects)
//		    {
//		        destinationDoc.Sections[0].Body.ChildObjects.Add(obj.Clone());
//		    }
//		}
//		destinationDoc.SaveToFile("target.docx");
//		System.Diagnostics.Process.Start("target.docx");
//	}
	
	// 复制文件 success,但是生成的word文档是xml格式的，复制完之后格式不变
	public static void copyFile(File sourceFile, File targetFile) throws IOException{
	    BufferedInputStream inBuff = null;
	    BufferedOutputStream outBuff = null;
	    try {
	        inBuff = new BufferedInputStream(new FileInputStream(sourceFile)); 
	        
	        outBuff = new BufferedOutputStream(new FileOutputStream(targetFile));
	       
	        byte[] b = new byte[1024 * 5]; 
	        int len;
	        while ((len = inBuff.read(b)) != -1) 
	        {
	            outBuff.write(b, 0, len);
	        }
	        
	        outBuff.flush();
	    } finally 
	    {
	        
	        if (inBuff != null)
	            inBuff.close();
	        if (outBuff != null)
	            outBuff.close();
	    }
	}
	
	public static void copyFile2(String sourceFile ,String targetFile) {
		try {
			String filename = sourceFile;
			File logfile = new File(filename);
			long lenth = logfile.length();
			long MaxLengh = 20*1024*1024;
			if(logfile.length()<MaxLengh) { //判断log文件是否大于20M
			    //原始文档路径
			    String old = sourceFile;
			    //新文档路径
			    String newPath = targetFile;
			    //将原始文档通过输入流读入内存
			    FileInputStream fis = new FileInputStream(new File(old));
			    BufferedInputStream bis = new BufferedInputStream(fis);
			    InputStreamReader isr = new InputStreamReader(bis);
			    BufferedReader br = new BufferedReader(isr);
			    String temp;
			    //通过输出流将内存中的数据写出到新的文档
			    FileOutputStream fos = new FileOutputStream(new File(newPath),false);//设置为false表示每次执行不累加内容到newpath，true表示累加内容到newpath
			    BufferedOutputStream bw = new BufferedOutputStream(fos);
			    PrintWriter pw = new PrintWriter(bw);
			    while((temp= br.readLine())!=null){
			        pw.println(temp);
			    }
			    if(pw!=null){
			        pw.close();
			    }
				FileWriter fw= new FileWriter(logfile);
				fw.write("");
			    fw.flush();    
			    fw.close(); 
 
			}
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
