package pdf;
import java.io.File;
import java.util.logging.Logger;

import org.apache.commons.io.FilenameUtils;
import org.artofsolving.jodconverter.OfficeDocumentConverter;
import org.artofsolving.jodconverter.office.DefaultOfficeManagerConfiguration;
import org.artofsolving.jodconverter.office.ExternalOfficeManagerConfiguration;
import org.artofsolving.jodconverter.office.OfficeException;
import org.artofsolving.jodconverter.office.OfficeManager;
 
public class PdfUtils {
    private static final Logger logger = Logger.getLogger(PdfUtils.class.getName());
    @SuppressWarnings("static-access")
//    private static String officeHome = "这里写的是你的openoffice的安装地址";
    private static String officeHome = "E:/OpenOffice4.1.6/OpenOffice4";
    @SuppressWarnings("static-access")
    private static int port = 8100;
    private static OfficeManager officeManager;
 
        // 尝试连接已存在的服务器
    private static boolean reconnect(){
        try {
        	// 尝试连接openoffice的已存在的服务器
            ExternalOfficeManagerConfiguration externalProcessOfficeManager = new ExternalOfficeManagerConfiguration();
            externalProcessOfficeManager.setConnectOnStart(true);
            externalProcessOfficeManager.setPortNumber(8100);
            officeManager = externalProcessOfficeManager.buildOfficeManager();
            officeManager.start();
            return true;
        } catch (OfficeException e) {
            e.printStackTrace();
            return false;
        }
         
    }
    // 开启新的openoffice的进程
    private static void start() {
        try {
            DefaultOfficeManagerConfiguration configuration = new DefaultOfficeManagerConfiguration();
            configuration.setOfficeHome(officeHome);// 安装地址
            configuration.setPortNumbers(port);// 端口号
            configuration.setTaskExecutionTimeout(1000 * 60 * 5);// 设置任务执行超时为5分钟
            configuration.setTaskQueueTimeout(1000 * 60 * 60 * 24);// 设置任务队列超时为24小时
            officeManager = configuration.buildOfficeManager();
            officeManager.start(); // 启动服务
        } catch (Exception e) {
        	e.printStackTrace();
        }
    }
        // 使用完需要关闭该进程
    private static void stop() {
        try {
            if (officeManager != null)
                officeManager.stop();
        } catch (Exception e) {
        	e.printStackTrace();
        }
    }
 
 
    public static File convertToPdf(String input) {
        File inputFile = null;
        File outFile = null;
        try {
        	// 如果已存在的服务不能连接或者不存在服务，那么开启新的服务　　　　
            if(!reconnect()){
                start();// 开启服务
            }
            // filenameUtils是Apache对java io的封装。　FilenameUtils.separatorsToSystem：转换分隔符为当前系统分隔符　/ FilenameUtils.getFullPath:获取文件的完整目录　　　　　　　　　　　　　　// FilenameUtils.getBaseName:取出文件目录和后缀名的文件名
            String output = FilenameUtils.separatorsToSystem(FilenameUtils.getFullPath(input) + FilenameUtils.getBaseName(input) + ".pdf");
            inputFile = new File(input);
            outFile = new File(output);
            OfficeDocumentConverter converter = new OfficeDocumentConverter(officeManager);
            converter.convert(inputFile,outFile); // 转换文档
        } catch (Exception e) {
            outFile = null;
            e.printStackTrace();
        }finally{
            stop();
        }
        return outFile;
    }
   // 测试工具类是否成功
    public static void main(String[] args) {
    	//PdfUtils.convertToPdf("E:/test.ppt");
//    	String fileString= "F:/RCJBX00200002019000014_A000011533.docx";
    	String fileString= "F:/riskcontrol/riskcontrol_file/downloadFile/qqq.docx";
    	File sf = new File(fileString);
    	System.out.println(sf.getPath());
    }
 
}