package toPdf;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
	/**
 * @author  作者 E-mail: 
 * @date 创建时间：2019年4月15日 下午5:32:39
 * @version 1.0 
 * @parameter 
 * @since  
 * @return  */
public class XmlToDocx {
	public static void main(String []args){
		try {
			String xmlTemplate = "F:/riskcontrol/riskcontrol_file/downloadFile/aaaaa.doc";
			String docxTemplate  = "F:/riskcontrol/riskcontrol_file/downloadFile/aaaaa.docx";
			
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
}
