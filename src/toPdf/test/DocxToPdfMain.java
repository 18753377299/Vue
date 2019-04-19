package toPdf.test;

import java.util.HashMap;
import java.util.Map;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
	/**
 * @author  作者 E-mail: 
 * @date 创建时间：2019年4月17日 下午2:17:35
 * @version 1.0 
 * @parameter 
 * @since  
 * @return  */
public class DocxToPdfMain {
	public static void main(String[] args) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("id", "测试编号"  );
		params.put("jiaName", "甲方名称");
		params.put("jiaIDCard", "甲方id号");
		params.put("jarAddress", "甲方住宿");
		params.put("jarAddr", "甲方地址");
 
		params.put("yiName", "乙方名称");
		params.put("yiIDCard", "乙方id号");
		params.put("yiAddress", "乙方住宿地址");
		params.put("yiAddr", "乙方地址");
	
		XWPFDocument xWPFDocument= InputDocx.getInputDocx().
				valueInputWord(params, "F:/riskcontrol/riskcontrol_file/downloadFile/abc.doc");
		
		try {
			
			DocxToPdf.docxToPdf(xWPFDocument, "F:/riskcontrol/riskcontrol_file/downloadFile/spring1.pdf");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
