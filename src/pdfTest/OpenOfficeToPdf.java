package pdfTest;

import java.io.File;

	/**
 * @author  作者 E-mail: 
 * @date 创建时间：2019年4月15日 下午4:08:06
 * @version 1.0 
 * @parameter 
 * @since  
 * @return  */
public class OpenOfficeToPdf {
	public static void main(String []args){
		try {
//           String sourceFile = "F:/riskcontrol/riskcontrol_file/downloadFile/RCJBX00200002019000014_A000011533.docx";
            String sourceFile = "F:/RCJBX00200002019000014_A000011533.docx";
            String destFile="F:/riskcontrol/riskcontrol_file/downloadFile/Spring1.pdf";
            
//            String sourceFile = "/home/openoffice/aaaaa.doc";
//            String destFile="/home/openoffice/Spring.pdf";
            
            File inputFile = new File(sourceFile);
            if(!inputFile.exists()){
                System.out.println("源文件不存在");
                throw new RuntimeException("源文件不存在");
            }
            File outputFile = new File(destFile);

            SocketOpenOfficeConnection connection = new SocketOpenOfficeConnection("127.0.0.1",8100);

            //尝试连接
            while(!connection.isConnected()){
                connection.connect();
            }

            //covert
            OpenOfficeDocumentConverter converter = new OpenOfficeDocumentConverter(connection);
            
//          DocumentConverter converter = new StreamOpenOfficeDocumentConverter(connection);
            converter.convert(inputFile, outputFile);
            //关闭连接
            connection.disconnect();
            //关闭openoffice进程
            System.out.println("=== 转换完成 ===");
        } catch(Exception e){
            e.printStackTrace();
            throw new RuntimeException("转换pdf失败");
        }
	}
}
