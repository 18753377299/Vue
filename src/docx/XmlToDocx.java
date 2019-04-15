package docx;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.Enumeration;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipException;
import java.util.zip.ZipFile;
import java.util.zip.ZipOutputStream;

import freemarker.template.TemplateException;
 
/**
 * 其实docx属于zip的一种，这里只需要操作word/document.xml中的数据，其他的数据不用动
 *
 * @author
 *
 */
public class XmlToDocx {
 
    /**
     *
     *  @param xmlTemplate xml的文件名
     *  @param docxTemplate docx的路径和文件名
     * @param xmlTemp  填充完数据的临时xml
     * @param toFilePath  目标文件名
     * @param map  需要动态传入的数据
     * @throws IOException
     * @throws TemplateException
     */
	
    public static void toDocx(String xmlTemplate,String docxTemplate,String xmlTemp ,String  toFilePath,Map map)  {
        try {
            // 1.map是动态传入的数据
            // 这个地方不能使用FileWriter因为需要指定编码类型否则生成的Word文档会因为有无法识别的编码而无法打开
            Writer w1 = new OutputStreamWriter(new FileOutputStream(xmlTemp), "gb2312");
            // 2.把map中的数据动态由freemarker传给xml
            XmlTplUtil.process(xmlTemplate, map, w1);
            // 3.把填充完成的xml写入到docx中
            XmlToDocx xtd = new XmlToDocx();
            xtd.outDocx(new File(xmlTemp), docxTemplate, toFilePath);
        }catch (Exception e) {
            e.printStackTrace();
        }
    }
    /**
     *
     * @param documentFile 动态生成数据的docunment.xml文件
     * @param docxTemplate docx的模板
     * @param toFilePath  需要导出的文件路径
     * @throws ZipException
     * @throws IOException
     */
 
    public void outDocx(File documentFile, String docxTemplate, String toFilePath) throws ZipException, IOException {
 
        try {
            File docxFile = new File(docxTemplate);
            ZipFile zipFile = new ZipFile(docxFile);
            Enumeration<? extends ZipEntry> zipEntrys = zipFile.entries();
            ZipOutputStream zipout = new ZipOutputStream(new FileOutputStream(toFilePath));
            int len = -1;
            byte[] buffer = new byte[1024];
            while (zipEntrys.hasMoreElements()) {
                ZipEntry next = zipEntrys.nextElement();
                InputStream is = zipFile.getInputStream(next);
                // 把输入流的文件传到输出流中 如果是word/document.xml由我们输入
                zipout.putNextEntry(new ZipEntry(next.toString()));
//                if ("word/document.xml".equals(next.toString())) {
                  if ("template/docx/document.xml".equals(next.toString())) {
                    InputStream in = new FileInputStream(documentFile);
                    while ((len = in.read(buffer)) != -1) {
                        zipout.write(buffer, 0, len);
                    }
                    in.close();
                } else {
                    while ((len = is.read(buffer)) != -1) {
                        zipout.write(buffer, 0, len);
                    }
                    is.close();
                }
            }
            zipout.close();
 
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}